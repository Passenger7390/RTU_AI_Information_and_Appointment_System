from datetime import datetime, timedelta
from typing import Annotated, List
from fastapi import FastAPI, HTTPException, Depends, Form, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from models import Image
from database import db_connect, create_session, get_db
from sqlalchemy.orm import Session
from schemas import AdvertisementResponse, AdvertisementCreate
from auth import read_users_me, router
import os
import shutil
import asyncio

app = FastAPI()
app.include_router(router)
engine, connection = db_connect()
session = create_session(engine)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_dependency = Annotated[dict, Depends(read_users_me)]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def periodic_cleanup():
    while True:
        with session as db:
            await delete_expired_images(db)
        await asyncio.sleep(3600)  # Run every hour

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic_cleanup())
    
@app.get("/dashboard", status_code=status.HTTP_200_OK)
async def getLogin(user: user_dependency, db: Annotated[Session, Depends(get_db)]):
    print(user)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    return {"message" : "Welcome Admin!"}



# @app.get('/get-ads', response_model=List[dict])
# def get_ad_link(db: Session = Depends(get_db)):
#     ads = db.query(Ad.media_url, Ad.duration).all()
#     list_of_ad = []
#     for ad in ads:
#         list_of_ad.append({"url":get_embed_url(ad.media_url), "duration":ad.duration})
#     print(list_of_ad)
#     return list_of_ad



@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db=Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    expiration_time = datetime.now() + timedelta(days=1)  # 1-day expiration

    new_image = Image(filepath=file.filename, duration=15, expires_in=expiration_time)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    
    return {"file_url": f"/media/{file.filename}", "expiration": expiration_time}

async def delete_expired_images(db: Session):   # Delete expired images
    now = datetime.now()
    expired_images = db.query(Image).filter(Image.expires_in < now).all()
    
    for image in expired_images:
        if os.path.exists(image.filepath):
            os.remove(image.filepath)
        db.delete(image)
    
    db.commit()
    
    return {"message": f"Deleted {len(expired_images)} expired images."}


# TODO: Get the images on the database
@app.get('/')
async def get_images(db: Session = Depends(get_db)):
    images = db.query(Image.filepath).all()
    list_of_images = []
    for image in images:
        list_of_images.append(image.filepath)
    return list_of_images

@app.get("/media/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    return FileResponse(file_path)
