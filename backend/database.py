import os
from typing import Annotated
from dotenv import load_dotenv
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables
load_dotenv()

Base = declarative_base()
metadata = MetaData()


def get_db():
    engine, _ = db_connect()
    session = create_session(engine)
    try:
        yield session
    finally:
        session.close()

def db_connect():

    DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable not set")
    engine = create_engine(DATABASE_URL)
    connection = engine.connect()

    return engine, connection

def create_session(engine):
    Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)
    session = Session()
    return session

def create_table(engine):
    # Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)


db_dependency = Annotated[Session, Depends(get_db)]




