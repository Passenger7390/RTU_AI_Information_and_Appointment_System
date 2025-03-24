from datetime import datetime
from fastapi import FastAPI, HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from models import Image
from database import db_dependency
from auth import router as auth_router, user_dependency
from adcrud import router as adcrud_router, periodic_cleanup
from chatcrud import router as chat_router
from appointmentCore import router as appointment_router
from professorCore import router as professor_router
import asyncio
import os
env = os.getenv("ENV")

if env == "development":
    app = FastAPI(title="Running in development environment")
elif env == "production":
    app = FastAPI(title="Running in production environment", docs_url=None, redoc_url=None)
else:
    app = FastAPI(title="Running in production environment", docs_url=None, redoc_url=None)

app.include_router(auth_router)
app.include_router(adcrud_router)
app.include_router(chat_router)
app.include_router(appointment_router)
app.include_router(professor_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic_cleanup())


@app.get("/ping", status_code=status.HTTP_200_OK)
async def ping():
    return {"message": "pong", "status": "ok", "timestamp": datetime.now().isoformat()}
    
@app.get("/dashboard", status_code=status.HTTP_200_OK)
async def getLogin(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    return {"message" : "Welcome Admin!"}


# Get all images filename
@app.get('/')
async def get_images(db: db_dependency):
    images = db.query(Image).all()
    list_of_images = []
    for image in images:
        list_of_images.append({"filename": image.filename, "duration": image.duration})
    return list_of_images

@app.get('/api/images')
async def get_images_api(db: db_dependency):
    images = db.query(Image).all()
    list_of_images = []
    for image in images:
        list_of_images.append({"filename": image.filename, "duration": image.duration})
    return list_of_images





