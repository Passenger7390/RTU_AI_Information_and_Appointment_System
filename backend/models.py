#from pydantic import BaseModel
from database import Base
from sqlalchemy import Column, Integer, String, DateTime, func

class Advertisement(Base):
    __tablename__ = "advertisements"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True),nullable=False, server_default=func.now())
    title = Column(String,nullable=False)
    media_url = Column(String,nullable=False)
    duration = Column(Integer,nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True,nullable=False)
    hashed_password = Column(String,nullable=False)    


