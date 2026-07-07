from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TripCreate(BaseModel):
    destination: str
    budget: float
    days: int
    travel_type: str
    season: str
    weather_temp: Optional[float] = None
    weather_desc: Optional[str] = None
    weather_humidity: Optional[int] = None
    weather_wind_speed: Optional[float] = None
    itinerary: Optional[str] = None
    hotel_cost: float
    food_cost: float
    travel_cost: float
    activity_cost: float
    total_cost: float

class TripResponse(BaseModel):
    id: int
    user_id: int
    destination: str
    budget: float
    days: int
    travel_type: str
    season: str
    weather_temp: Optional[float]
    weather_desc: Optional[str]
    weather_humidity: Optional[int]
    weather_wind_speed: Optional[float]
    itinerary: Optional[str]
    hotel_cost: float
    food_cost: float
    travel_cost: float
    activity_cost: float
    total_cost: float
    created_at: datetime

    class Config:
        from_attributes = True
