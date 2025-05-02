from datetime import datetime
import logging
from fastapi import FastAPI, HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from models import Image
from database import db_dependency
from auth import router as auth_router, user_dependency
from adcrud import router as adcrud_router, periodic_cleanup
from chatcrud import router as chat_router
from appointmentCore import router as appointment_router, check_email_periodically
from professorCore import router as professor_router
from otp import router as otp_router, cleanup_expired_otp
from mapCore import router as map_router
from contextlib import asynccontextmanager
import asyncio
import os
env = os.getenv("ENV")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

background_tasks = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Starting background tasks...")
    
    task1 = asyncio.create_task(periodic_cleanup())
    background_tasks.add(task1)
    task1.add_done_callback(background_tasks.discard)

    task2 = asyncio.create_task(cleanup_expired_otp())
    background_tasks.add(task2)
    task2.add_done_callback(background_tasks.discard)

    task3 = asyncio.create_task(check_email_periodically())
    background_tasks.add(task3)
    task3.add_done_callback(background_tasks.discard)

    logging.info("Background tasks started successfully")
    yield

    # Shutdown: cancel all background tasks
    logging.info("Shutting down background tasks")
    for task in background_tasks:
        task.cancel()

    # Wait for all tasks to be cancelled
    await asyncio.gather(*background_tasks, return_exceptions=True)
    logging.info("All background tasks stopped")

if env == "development":
    app = FastAPI(title="Running in development environment", lifespan=lifespan)
elif env == "production":
    app = FastAPI(title="Running in production environment", docs_url=None, redoc_url=None, lifespan=lifespan)
else:
    app = FastAPI(title="Running in production environment", docs_url=None, redoc_url=None, lifespan=lifespan)

app.include_router(auth_router)
app.include_router(adcrud_router)
app.include_router(chat_router)
app.include_router(appointment_router)
app.include_router(professor_router)
app.include_router(otp_router)
app.include_router(map_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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





