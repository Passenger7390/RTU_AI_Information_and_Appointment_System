from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
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

class ProfessorInformation(Base):
    __tablename__ = "professor_information"

    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(UUID, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    office_hours = Column(String, nullable=True)
    title = Column(String, nullable=True)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(UUID, unique=True, nullable=False)
    student_name = Column(String, nullable=False)
    student_id = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    professor_name = Column(Integer, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, nullable=False)