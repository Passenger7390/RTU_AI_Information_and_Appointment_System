from fastapi import FastAPI, HTTPException, Depends, Form
from models import Advertisement
from database import db_connect, create_session, create_table, get_db
from sqlalchemy.orm import Session
from schemas import AdvertisementResponse, AdvertisementCreate

app = FastAPI()

# engine, connection = db_connect()
# session = create_session(engine)

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

# @app.get("/", response_model=AdvertisementResponse)
# async def get_ads():
    
@app.post("/login")
async def login():
    return

