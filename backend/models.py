from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, DateTime, Boolean, func, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.sql import expression
from datetime import datetime, timedelta

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True,nullable=False)
    hashed_password = Column(String,nullable=False)
    role = Column(String, nullable=False, default='professor') 
    professor_id = Column(UUID, ForeignKey("professor_information.professor_id", ondelete="CASCADE"), nullable=True)  # Link to professor if applicable  

    professor_info = relationship("ProfessorInformation", back_populates="users")  # Add relationship
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
    isPinned = Column(Boolean, server_default=expression.false(), nullable=False)

class ProfessorInformation(Base):
    __tablename__ = "professor_information"

    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(UUID, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    office_hours = Column(String, nullable=False)
    title = Column(String, nullable=True)

    appointments = relationship("Appointment", back_populates="professor")
    users = relationship("User", back_populates="professor_info")  # Add back-relationship

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(UUID, unique=True, nullable=False)
    student_name = Column(String, nullable=False)
    student_id = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    professor_uuid = Column(UUID, ForeignKey("professor_information.professor_id", ondelete="CASCADE"), nullable=False)
    concern = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True),nullable=True, server_default=func.now())

    professor = relationship("ProfessorInformation", back_populates="appointments")

class OTPSecret(Base):
    __tablename__ = "otp_secret"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    secret = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, nullable=False)

    def is_expired(self):
        current_time = datetime.now(self.expires_at.tzinfo)
        is_expired = self.expires_at < current_time
        return is_expired  
      
    @classmethod
    def create(cls, email, secret, expiry_minutes=5):
        expires_at = datetime.now() + timedelta(minutes=expiry_minutes)
        return cls(email=email, secret=secret, expires_at=expires_at, is_used=False)
    
class UserFAQ(Base):
    __tablename__ = "user_faq"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
