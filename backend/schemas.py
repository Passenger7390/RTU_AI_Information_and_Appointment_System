from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from uuid import UUID
class UserBase(BaseModel):
    username: str

class CreateUser(BaseModel):    # Create User model
    username: str
    password: str

class Token(BaseModel): # Token model
    access_token: str
    token_type: str

class ImageBase(BaseModel):
    filepath: str
    duration: int
    expires_in: datetime

class ImageCreate(ImageBase):
    pass

class ImageResponse(ImageBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class DeleteRequest(BaseModel):
    ids: List[int]

class FAQCreate(BaseModel):
    question: str
    synonyms: Optional[List[str]] = []
    answer: str

class FAQUpdate(BaseModel):
    id: int
    question: str
    synonyms: Optional[List[str]] = []
    answer: str

class FAQOut(BaseModel):
    id: int
    question: str
    synonyms: List[str]
    answer: str

    class Config:
        from_attributes = True

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    response: Optional[str] = None
    suggestions: Optional[List[str]] = None

class CreateProfessor(BaseModel):
    first_name: str
    last_name: str
    email: str
    office_hours: Optional[str] = None
    title: Optional[str] = None

class ProfessorResponse(BaseModel):
    id: int
    name: str
    office_hours: Optional[str] = None
    title: Optional[str] = None

class AppointmentCreate(BaseModel):
    student_name: str
    student_id: str
    student_email: str
    professor_name: str
    start_time: str
    end_time: str

class AppointmentResponse(BaseModel):
    id: int
    uuid: UUID
    student_name: str
    professor_name: str
    start_time: datetime
    end_time: datetime
    status: str

class AppointmentGet(BaseModel):
    uuid: UUID

class AppointmentGetByReference(BaseModel):
    reference: str