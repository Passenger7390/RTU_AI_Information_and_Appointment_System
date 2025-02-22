import os
from dotenv import load_dotenv
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
    # USER = os.getenv("user")
    # PASSWORD = os.getenv("password")
    # HOST = os.getenv("host")
    # PORT = os.getenv("port")
    # DBNAME = os.getenv("dbname")

    #DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

    DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")
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


# insert table here to create

# engine, _ = db_connect()
# session = create_session(engine)
# create_table(engine)
# print("table created")



