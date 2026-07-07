from pydantic import BaseModel, Field
from typing import List, Optional
from schemas.weather import WeatherResponse
from schemas.hotel import HotelResponse

class TravelRequest(BaseModel):
    budget: float = Field(..., description="Overall trip budget in INR")
    days: int = Field(..., description="Number of days for travel", ge=1)
    travel_type: str = Field(..., description="Type of travel (Beach, Adventure, Historical, Nature, Religious, Wildlife)")
    season: str = Field(..., description="Season of travel (Summer, Winter, Monsoon, All)")

class BudgetEstimate(BaseModel):
    hotel_cost: float
    food_cost: float
    travel_cost: float
    activity_cost: float
    total_cost: float

class RecommendationResponse(BaseModel):
    destination: str
    weather: Optional[WeatherResponse] = None
    budget_estimate: Optional[BudgetEstimate] = None
    hotels: List[HotelResponse] = []
