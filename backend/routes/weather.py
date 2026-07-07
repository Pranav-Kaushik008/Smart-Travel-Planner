from fastapi import APIRouter, HTTPException
from schemas.weather import WeatherResponse
from services.weather_service import get_weather

router = APIRouter(tags=["Weather"])

@router.get("/weather/{city}", response_model=WeatherResponse)
async def get_city_weather(city: str):
    weather_info = await get_weather(city)
    if not weather_info:
        raise HTTPException(status_code=404, detail="Weather data not found")
    return weather_info
