from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from schemas.travel import TravelRequest, RecommendationResponse
from schemas.itinerary import ItineraryRequest, ItineraryResponse
from services.recommendation_service import recommendation_engine
from services.weather_service import get_weather
from services.budget_service import estimate_budget
from services.hotel_service import get_hotels_by_destination
from services.gemini_service import generate_itinerary as gemini_generate_itinerary
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter(tags=["Travel Planner"])

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(req: TravelRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Run ML prediction
    destination = recommendation_engine.predict(
        budget=req.budget,
        days=req.days,
        travel_type=req.travel_type,
        season=req.season
    )
    
    # 2. Fetch current weather for the predicted destination
    weather_info = await get_weather(destination)
    
    # 3. Estimate budget details
    budget_breakdown = estimate_budget(
        destination=destination,
        days=req.days,
        travel_type=req.travel_type,
        total_budget=req.budget
    )
    
    # 4. Fetch recommended hotels in the destination
    hotels = await get_hotels_by_destination(destination, db)
    
    return RecommendationResponse(
        destination=destination,
        weather=weather_info,
        budget_estimate=budget_breakdown,
        hotels=hotels
    )

@router.post("/generate-itinerary", response_model=ItineraryResponse)
async def generate_itinerary(req: ItineraryRequest, current_user: User = Depends(get_current_user)):
    itinerary_md = await gemini_generate_itinerary(
        destination=req.destination,
        days=req.days,
        travel_type=req.travel_type,
        budget=req.budget
    )
    return ItineraryResponse(itinerary=itinerary_md)
