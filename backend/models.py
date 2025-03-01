from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True,nullable=False)
    hashed_password = Column(String,nullable=False)    

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True),nullable=False, server_default=func.now())
    filename = Column(String, nullable=False)
    title = Column(String, nullable=False)
    duration = Column(Integer,nullable=False)
    expires_in = Column(DateTime(timezone=True),nullable=False)
    
class FAQ(Base):
    __tablename__ = "faq"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, unique=True, index=True ,nullable=False)
    synonyms = Column(JSONB, nullable=True)
    answer = Column(String, nullable=False)