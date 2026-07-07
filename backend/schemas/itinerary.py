from pydantic import BaseModel
from typing import List

class ItineraryRequest(BaseModel):
    destination: str
    days: int
    travel_type: str
    budget: float

class ItineraryResponse(BaseModel):
    itinerary: str
