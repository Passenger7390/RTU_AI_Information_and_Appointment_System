import asyncio
from datetime import datetime, time
import shutil
from fastapi import Depends, File, Form, HTTPException, APIRouter, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from auth import read_users_me
from database import create_session, db_connect, get_db
from schemas import DeleteRequest, UserBase
from models import Image
import os

router = APIRouter(prefix="/ad", tags=["ad"]) # Create a router for authentication
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
engine, connection = db_connect()
session = create_session(engine)

@router.post("/upload/")
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

    today = datetime.now().date()
    # print(datetime.datetime.time(23,59,59))
    if expiration_time.date() == today:
        expiration_time = datetime.combine(today, time(23,59,59))
    new_image = Image(filename=file.filename, title=title, duration=duration, expires_in=expiration_time)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    
    return {"file_url": f"/media/{file.filename}", "expiration": expiration_time}

# GET images
@router.get("/media/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    return FileResponse(file_path)

@router.get('/table-data')
async def getTableData(db: Session = Depends(get_db)):
    images = db.query(Image).all()
    list_of_images = []
    for image in images:
        list_of_images.append({'id': image.id, 'created_at': image.created_at,"filename": image.filename, "title": image.title, "duration": image.duration, "expires_in": image.expires_in})
    return list_of_images

@router.post("/delete")
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

async def delete_expired_images(db: Session):   # Delete expired images
    now = datetime.now()
    expired_images = db.query(Image).filter(Image.expires_in < now).all()

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

async def periodic_cleanup():
    while True:
        with session as db:
            await delete_expired_images(db)
        await asyncio.sleep(30)  # Run every 30 seconds