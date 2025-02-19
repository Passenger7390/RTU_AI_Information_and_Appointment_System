from typing import Annotated
from fastapi import FastAPI, HTTPException, Depends, Form, status
from fastapi.middleware.cors import CORSMiddleware
from models import Advertisement, User
from database import db_connect, create_session, create_table, get_db
from sqlalchemy.orm import Session
from schemas import AdvertisementResponse, AdvertisementCreate
from auth import getCurrentUser, router


app = FastAPI()
app.include_router(router)
# engine, connection = db_connect()
# session = create_session(engine)

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

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(getCurrentUser)]

@app.post("/upload")
async def upload_ad(title: str = Form(...), 
            media_url: str = Form(...), 
            duration: int = Form(...), 
            db: Session = Depends(get_db)):
    try:
        ad_data = AdvertisementCreate(title=title, media_url=media_url, duration=duration)
        new_ad = Advertisement(**ad_data.model_dump())
        db.add(new_ad)
        db.commit()
        db.refresh(new_ad)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) 
    
@app.get("/admin", status_code=status.HTTP_200_OK)
async def getLogin(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    return {"message" : "Welcome Admin!"}

