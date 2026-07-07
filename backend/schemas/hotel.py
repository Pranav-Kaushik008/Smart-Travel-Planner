from pydantic import BaseModel
from typing import Optional

class HotelResponse(BaseModel):
    id: int
    name: str
    destination: str
    rating: float
    price_per_night: float
    amenities: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
