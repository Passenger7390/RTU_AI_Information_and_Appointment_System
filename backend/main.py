from fastapi import FastAPI, HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from models import Image
from database import db_dependency
from auth import router as auth_router, user_dependency
from adcrud import router as adcrud_router, periodic_cleanup
from chatcrud import router as chat_router
import asyncio


app = FastAPI()
app.include_router(auth_router)
app.include_router(adcrud_router)
app.include_router(chat_router)

origins = [
    "http://localhost:5173",
    "http://192.168.100.76:5173/",
    "http://192.168.100.76:4173",
    "http://192.168.100.59:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic_cleanup())

    
@app.get("/dashboard", status_code=status.HTTP_200_OK)
async def getLogin(user: user_dependency, db: db_dependency):
    print(user)
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







