from collections import defaultdict
from datetime import datetime, timedelta
from typing import Annotated, List
from fastapi import FastAPI, HTTPException, Depends, Form, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from models import Image, User, FAQ
from database import db_connect, create_session, get_db
from sqlalchemy.orm import Session
from schemas import UserBase, Question
from auth import read_users_me, router
import os
import shutil
import asyncio
from rapidfuzz import fuzz, process
import openai

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
openai.api_key = os.getenv("OPENAI_API_KEY")
user_dependency = Annotated[dict, Depends(read_users_me)]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    
    expiration_time = datetime.strptime(expires_in, '%Y-%m-%d')  # 1-day expiration
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

def get_faq_data(db: Session):
    return db.query(FAQ).all()

def preprocess_text(text: str):
    return text.lower().strip()

def find_best_match(db: Session, question: str):
    faq_data = get_faq_data(db)
    questions = [q.question for q in faq_data]
    
    # Keyword-based matching
    keyword_matches = defaultdict(int)
    question_words = set(preprocess_text(question).split())
    
    for faq in faq_data:
        faq_words = set(preprocess_text(faq.question).split())
        common_words = question_words & faq_words
        keyword_matches[faq] = len(common_words)
    
    best_keyword_match = max(keyword_matches, key=keyword_matches.get, default=None)
    if best_keyword_match and keyword_matches[best_keyword_match] > 0:
        return best_keyword_match.answer
    
    # Fuzzy matching
    best_match, score, index = process.extractOne(question, questions, scorer=fuzz.ratio)
    return faq_data[index].answer if score > 70 else None

@app.post("/ask")
def ask_question(q: Question, db: Session = Depends(get_db)):
    answer = find_best_match(db, q.text)
    if answer:
        return {"answer": answer}
    
    
    # # Fallback to OpenAI
    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=[{"role": "user", "content": q.text}]
    # )
    # return {"answer": response["choices"][0]["message"]["content"]}

@app.post("/add_faq")
def add_faq(q: Question, a: Question, db: Session = Depends(get_db)):
    new_faq = FAQ(question=q.text, answer=a.text)
    db.add(new_faq)
    db.commit()
    return {"message": "FAQ added successfully"}