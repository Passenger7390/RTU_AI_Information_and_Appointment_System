from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from uuid import UUID
class UserBase(BaseModel):
    username: str
    id: int
    role: str
    professor_id: Optional[UUID] = None

class CreateUser(BaseModel):    # Create User model
    username: str
    password: str
    role: str = "professor"

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
    isPinned: bool

class FAQOut(BaseModel):
    id: int
    question: str
    synonyms: List[str]
    answer: str
    isPinned: bool

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
    office_hours: str
    title: Optional[str] = None

class RegisterProfessor(CreateProfessor):
    username: str
    password: str
    class Config:
        from_attributes = True
class ProfessorResponse(BaseModel):
    id: int
    name: str
    professor_id: UUID
    office_hours: str
    title: Optional[str] = None

class AppointmentCreate(BaseModel):
    student_name: str
    student_id: str
    student_email: str
    professor_uuid: UUID
    concern: str
    start_time: str
    end_time: str

class AppointmentResponse(BaseModel):
    uuid: str
    student_name: str
    student_id: str
    student_email: str
    professor_name: str
    start_time: str
    end_time: str
    status: str

class AppointmentResponseForTable(AppointmentResponse):
    professor_id: UUID
    class Config:
        from_attributes = True

# class AppointmentGet(BaseModel):
#     uuid: UUID

# class AppointmentGetByReference(BaseModel):
#     reference: str

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str

class DeleteProfessors(BaseModel):
    ids: List[UUID]

class UpdateProfessor(BaseModel):
    first_name: str
    last_name: str
    email: str
    office_hours: str
    title: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: str

class StarFAQ(BaseModel):
    id: int