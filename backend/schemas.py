from pydantic import BaseModel
from datetime import datetime

class AdvertisementBase(BaseModel):
    title: str
    duration: int
    media_url: str

class AdvertisementCreate(AdvertisementBase):
    pass

class AdvertisementResponse(AdvertisementBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True