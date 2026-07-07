from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database.db import get_db
from models.trip import Trip
from schemas.trip import TripCreate, TripResponse
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter(tags=["Trips"])

@router.post("/save-trip", response_model=TripResponse)
async def save_trip(trip_data: TripCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_trip = Trip(
        user_id=current_user.id,
        destination=trip_data.destination,
        budget=trip_data.budget,
        days=trip_data.days,
        travel_type=trip_data.travel_type,
        season=trip_data.season,
        weather_temp=trip_data.weather_temp,
        weather_desc=trip_data.weather_desc,
        weather_humidity=trip_data.weather_humidity,
        weather_wind_speed=trip_data.weather_wind_speed,
        itinerary=trip_data.itinerary,
        hotel_cost=trip_data.hotel_cost,
        food_cost=trip_data.food_cost,
        travel_cost=trip_data.travel_cost,
        activity_cost=trip_data.activity_cost,
        total_cost=trip_data.total_cost
    )
    
    db.add(db_trip)
    await db.commit()
    await db.refresh(db_trip)
    return db_trip

@router.get("/trip-history", response_model=List[TripResponse])
async def get_trip_history(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Trip).where(Trip.user_id == current_user.id).order_by(Trip.created_at.desc())
    res = await db.execute(stmt)
    trips = res.scalars().all()
    return list(trips)

@router.delete("/trips/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id)
    res = await db.execute(stmt)
    trip = res.scalars().first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    await db.delete(trip)
    await db.commit()
    return None
