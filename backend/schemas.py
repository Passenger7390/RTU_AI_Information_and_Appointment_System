from pydantic import BaseModel
from datetime import datetime

class AdvertisementBase(BaseModel):
    title: str
    duration: int
    media_url: str
    expires_in: datetime

class AdvertisementCreate(AdvertisementBase):
    pass

class AdvertisementResponse(AdvertisementBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

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
