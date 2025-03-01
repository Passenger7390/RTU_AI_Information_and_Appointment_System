from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str


class UserInDB(UserBase):
    hashed_password: str

class Token(BaseModel): # Token model
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

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

class Question(BaseModel):
    text: str

class DeleteRequest(BaseModel):
    ids: List[int]

class FAQCreate(BaseModel):
    question: str
    synonyms: Optional[List[str]] = []
    answer: str

class FAQOut(BaseModel):
    id: int
    question: str
    answer: str

    class Config:
        from_attributes = True

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    response: Optional[str] = None
    suggestions: Optional[List[str]] = None