import logging
from typing import List
import anyio
import os
import string
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from rapidfuzz import fuzz, process
from google import genai
from auth import read_users_me
from database import get_db
from models import FAQ
from schemas import FAQCreate, FAQOut, FAQUpdate, QueryRequest, QueryResponse, UserBase

router = APIRouter(prefix="/ray", tags=["ray"])
client = genai.Client(api_key=os.getenv("GEMINI_API"))
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/chat", response_model=QueryResponse)
async def chat(query_request: QueryRequest, db: Session = Depends(get_db)):
    query = query_request.query
    logger.info("Received query: %s", query)
    faqs = get_all_faqs(db)
    
    # Try to find an FAQ answer if there is a clear match.
    answer = match_faq(query, faqs)
    if answer:
        logger.info("FAQ match found.")
        return QueryResponse(response=answer)
    
    # Otherwise, look for ambiguous suggestions.
    suggestions = get_faq_suggestions_by_words(query, faqs)
    if suggestions:
        logger.info("Sending suggestions for fallback response.")
        clarification_text = "I couldn't clearly understand your question. Did you mean one of the following?"
        return QueryResponse(response=clarification_text, suggestions=suggestions)
    
    # Fallback: Call Gemini API if no suggestions are found.
    try:
        logger.info("Calling Google Gemini API for fallback response.")
        gemini_response = await get_gemini_response(query)
        return QueryResponse(response=gemini_response)
    except Exception as e:
        logger.error("Gemini API error: %s", str(e))
        raise HTTPException(status_code=500, detail="Gemini API call failed: " + str(e))

@router.get("/faqs", response_model=List[FAQOut])
async def read_faqs(db: Session = Depends(get_db)):
    result = get_all_faqs(db)

    return [
        FAQOut(
            id=faq.id,
            synonyms=faq.synonyms if isinstance(faq.synonyms, list) else ([] if faq.synonyms is None else [faq.synonyms]),
            question=faq.question,
            answer=faq.answer
        ) for faq in result
    ]

@router.post("/faqs", response_model=FAQCreate)
async def add_faq(faq: FAQCreate, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    existing = get_faq_by_question(db, faq.question)
    if existing:
        raise HTTPException(status_code=400, detail="FAQ with that question already exists")
    new_faq = create_faq(db, faq)
    return new_faq

@router.put("/faqs", response_model=FAQOut)
async def update_faq(params: FAQUpdate, db: Session = Depends(get_db)):
    existing = db.query(FAQ).get(params.id)
    if not existing:
        raise HTTPException(status_code=404, detail="FAQ not found")
    existing.question = params.question
    existing.synonyms = params.synonyms
    existing.answer = params.answer
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: int, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).delete()
    db.commit()
    return {"message": f"Deleted FAQ with ID {faq_id}"}

def get_all_faqs(db: Session):
    return db.query(FAQ).all()

def get_faq_by_question(db: Session, question: str):
    return db.query(FAQ).filter(FAQ.question.ilike(question)).first()

def create_faq(db: Session, faq: FAQCreate):
    new_faq = FAQ(
        question=faq.question.strip(),
        synonyms=faq.synonyms,  # synonyms should be a list (stored as JSONB in PostgreSQL)
        answer=faq.answer.strip()
    )
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

# def normalize(text: str) -> str:
#     return text.strip().lower()

def normalize(text: str) -> str:
    # Remove punctuation, trim whitespace, and convert to lowercase.
    return text.strip().lower().translate(str.maketrans('', '', string.punctuation))

def match_faq(query: str, faqs, threshold: float = 70) -> str:
    """
    Find the best FAQ answer if the highest match score is above the given threshold.
    """
    normalized_query = normalize(query)
    candidate_tuples = []
    for faq in faqs:
        candidate_tuples.append((normalize(faq.question), faq))
        if faq.synonyms:
            for syn in faq.synonyms:
                candidate_tuples.append((normalize(syn), faq))
    if not candidate_tuples:
        return None
    candidate_texts = [text for text, _ in candidate_tuples]
    best_match = process.extractOne(normalized_query, candidate_texts, scorer=fuzz.ratio)
    if best_match and best_match[1] >= threshold:
        matched_text = best_match[0]
        for text, faq in candidate_tuples:
            if text == matched_text:
                return faq.answer
    return None

def get_faq_suggestions_by_words(query: str, faqs, threshold: float = 0.3, max_suggestions: int = 3) -> list:
    """
    Search FAQs word by word using Jaccard similarity.
    
    Parameters:
      - query (str): The user's query.
      - faqs: List of FAQ records.
      - threshold (float): Minimum Jaccard similarity required (0 to 1).
      - max_suggestions (int): Maximum number of suggestions to return.
      
    Returns:
      - List of candidate FAQ texts (questions or synonyms) that meet the threshold.
    """
    normalized_query = normalize(query)
    query_words = set(normalized_query.split())
    suggestions = []
    
    for faq in faqs:
        candidate_texts = [normalize(faq.question)]
        if faq.synonyms:
            candidate_texts.extend(normalize(syn) for syn in faq.synonyms)
            
        for candidate in candidate_texts:
            candidate_words = set(candidate.split())
            if not candidate_words:
                continue
            jaccard = len(query_words & candidate_words) / len(query_words | candidate_words)
            if jaccard >= threshold:
                suggestions.append((candidate, jaccard))
                
    # Sort suggestions by similarity score in descending order and limit the count.
    suggestions.sort(key=lambda x: x[1], reverse=True)
    return [sug[0] for sug in suggestions[:max_suggestions]]

async def get_gemini_response(query: str, history: list = None) -> str:
    """
    Get an AI-generated response from Google Gemini.

    This function starts a chat session with the Gemini model using the provided conversation history,
    then sends the prompt and returns the response text.
    """
    history = history or []
    
    def sync_get_response():
        # Create a chat session that remembers conversation history.
        # Adjust the code below based on the actual genai API:
        chat_session = client.chats.create(model='gemini-2.0-flash', history=history)
        response = chat_session.send_message(query)

        return response.text.strip()
    
    try:
        return await anyio.to_thread.run_sync(sync_get_response)
    except Exception as e:
        raise Exception("Gemini API error: " + str(e))

