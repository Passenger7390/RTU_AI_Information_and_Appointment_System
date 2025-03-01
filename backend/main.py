from collections import defaultdict
from datetime import datetime, timedelta
from typing import Annotated, List
import anyio
from fastapi import FastAPI, HTTPException, Depends, Form, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from models import Image, User, FAQ
from database import db_connect, create_session, get_db
from sqlalchemy.orm import Session
from schemas import UserBase, DeleteRequest, QueryRequest, QueryResponse, FAQCreate, FAQOut
from auth import read_users_me, router
import os
import shutil
import asyncio
from rapidfuzz import fuzz, process
import openai
import logging
import chatcrud
from google import genai


app = FastAPI()
app.include_router(router)
engine, connection = db_connect()
session = create_session(engine)

origins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://0.0.0.0:4173",
    "http://0.0.0.0:4173",
    "http://192.168.100.76:4173/",
    "http://172.17.0.1:4173/",
    "http://192.168.100.76:5173",
    "http://192.168.100.76:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")
user_dependency = Annotated[dict, Depends(read_users_me)]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

client = genai.Client(api_key=os.getenv("GEMINI_API"))

async def periodic_cleanup():
    while True:
        with session as db:
            await delete_expired_images(db)
        await asyncio.sleep(30)  # Run every 30 seconds

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic_cleanup())

    
@app.get("/dashboard", status_code=status.HTTP_200_OK)
async def getLogin(user: user_dependency, db: Annotated[Session, Depends(get_db)]):
    print(user)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    return {"message" : "Welcome Admin!"}


# Upload Images and store the filename and filepath in the database
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), duration: int = Form(...), title: str = Form(...), expires_in: str = Form(...), current_user: UserBase = Depends(read_users_me) ,db: Session = Depends(get_db)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file_exist = db.query(Image.filename).filter(Image.filename == file.filename).first()
    if file_exist:
        raise HTTPException(status_code=400, detail="File already exists")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    expiration_time = datetime.strptime(expires_in, '%Y-%m-%d')  # Set Expiration date
    print(expiration_time)

    new_image = Image(filename=file.filename, title=title, duration=duration, expires_in=expiration_time)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    
    return {"file_url": f"/media/{file.filename}", "expiration": expiration_time}

async def delete_expired_images(db: Session):   # Delete expired images
    now = datetime.now()
    expired_images = db.query(Image).filter(Image.expires_in <= now).all()

    for image in expired_images:
        if os.path.exists(os.path.join(UPLOAD_DIR, image.filename)):
            try:
                db.delete(image)
            except OSError as e:
                print(f"Error deleting file: {e}")
            finally:
                os.remove(os.path.join(UPLOAD_DIR, image.filename))

    db.commit()
    
    return {"message": f"Deleted {len(expired_images)} expired images."}


# Get all images filename
@app.get('/')
async def get_images(db: Session = Depends(get_db)):
    images = db.query(Image).all()
    list_of_images = []
    for image in images:
        list_of_images.append({"filename": image.filename, "duration": image.duration})
    return list_of_images

# GET images
@app.get("/media/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    return FileResponse(file_path)

@app.get('/table-data')
async def getTableData(db: Session = Depends(get_db)):
    images = db.query(Image).all()
    list_of_images = []
    for image in images:
        list_of_images.append({'id': image.id, 'created_at': image.created_at,"filename": image.filename, "title": image.title, "duration": image.duration, "expires_in": image.expires_in})
    return list_of_images

@app.post("/delete")
async def delete_images(
    request: DeleteRequest,
    current_user: UserBase = Depends(read_users_me),
    db: Session = Depends(get_db)
):
    for image_id in request.ids:
        image = db.query(Image).filter(Image.id == image_id).first()
        if image:
            file_path = os.path.join(UPLOAD_DIR, image.filename)
            if os.path.exists(file_path):
                os.remove(file_path)
            db.delete(image)
    
    db.commit()
    return {"message": f"Deleted {len(request.ids)} images"}

def normalize(text: str) -> str:    # Normalize text
    return text.strip().lower()

def match_faq(query: str, faqs, threshold: float = 70) -> str:
    normalized_query = query.strip().lower()
    # Prepare a list of (normalized_question, faq_object) tuples.
    questions = [(faq.question.strip().lower(), faq) for faq in faqs]
    
    # Extract the best matching question using rapidfuzz's extractOne.
    best_match = process.extractOne(
        normalized_query, 
        [q for q, _ in questions],
        scorer=fuzz.ratio
    )
    
    if best_match and best_match[1] >= threshold:
        matched_question = best_match[0]
        # Find the FAQ corresponding to the matched question.
        for question, faq in questions:
            if question == matched_question:
                return faq.answer
    return None

@app.post("/chat", response_model=QueryResponse)
async def chat(query_request: QueryRequest, db: Session = Depends(get_db)):
    query = query_request.query
    logger.info("Received query: %s", query)
    faqs = chatcrud.get_all_faqs(db)
    answer = match_faq(query, faqs)
    if answer:
        logger.info("FAQ match found.")
        return QueryResponse(response=answer)

    # Fallback: use OpenAI API
    try:
        logger.info("Calling Google Gemini API for fallback response.")
        gemini_response = await get_gemini_response(query)
        return QueryResponse(response=gemini_response)
    except Exception as e:
        logger.error("Gemini API error: %s", str(e))
        raise HTTPException(status_code=500, detail="Gemini API call failed: " + str(e))

# Additional endpoints for managing FAQs

@app.get("/faqs", response_model=list[FAQOut])
def read_faqs(db: Session = Depends(get_db)):
    faqs = chatcrud.get_all_faqs(db)
    return faqs

@app.post("/faqs", response_model=FAQOut)
def add_faq(faq: FAQCreate, db: Session = Depends(get_db)):
    existing = chatcrud.get_faq_by_question(db, faq.question)
    if existing:
        raise HTTPException(status_code=400, detail="FAQ with that question already exists")
    new_faq = chatcrud.create_faq(db, faq)
    return new_faq


async def get_gemini_response(query: str, history: list = None) -> str:
    """
    Get an AI-generated response from Google Gemini.
    
    Parameters:
      - query (str): The user prompt.
      - history (list): Optional conversation history.
      
    Returns:
      - str: The AI-generated response text.
      
    This function starts a chat session with the Gemini model and sends the prompt.
    """
    history = history or []
    
    def sync_get_response():
        chat = client.chats.create(model='gemini-2.0-flash')

        # Send the user prompt to the model and get the response.
        response = chat.send_message(query)
        return response.text.strip()

    try:
        # Run the synchronous call in a thread to avoid blocking.
        return await anyio.to_thread.run_sync(sync_get_response)
    except Exception as e:
        raise Exception("Gemini API error: " + str(e))