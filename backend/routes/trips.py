from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database.db import get_db
from models.trip import Trip
from schemas.trip import TripCreate, TripResponse, TripExpenseUpdate
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter(tags=["Trips"])

from models.group import GroupTrip

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
    # 1. Fetch individual trips
    stmt_indiv = select(Trip).where(Trip.user_id == current_user.id)
    res_indiv = await db.execute(stmt_indiv)
    indiv_trips = res_indiv.scalars().all()
    
    # 2. Fetch group trips
    stmt_group = select(GroupTrip).where(GroupTrip.user_id == current_user.id)
    res_group = await db.execute(stmt_group)
    group_trips = res_group.scalars().all()
    
    combined_list = []
    for t in indiv_trips:
        dict_item = {
            "id": t.id,
            "user_id": t.user_id,
            "destination": t.destination,
            "budget": t.budget,
            "days": t.days,
            "travel_type": t.travel_type,
            "season": t.season,
            "weather_temp": t.weather_temp,
            "weather_desc": t.weather_desc,
            "weather_humidity": t.weather_humidity,
            "weather_wind_speed": t.weather_wind_speed,
            "itinerary": t.itinerary,
            "hotel_cost": t.hotel_cost,
            "food_cost": t.food_cost,
            "travel_cost": t.travel_cost,
            "activity_cost": t.activity_cost,
            "total_cost": t.total_cost,
            "actual_hotel": t.actual_hotel,
            "actual_food": t.actual_food,
            "actual_travel": t.actual_travel,
            "actual_activities": t.actual_activities,
            "actual_misc": t.actual_misc,
            "actual_total": t.actual_total,
            "is_group_trip": False,
            "created_at": t.created_at
        }
        combined_list.append(dict_item)
        
    for gt in group_trips:
        dict_item = {
            "id": gt.id,
            "user_id": gt.user_id,
            "destination": gt.destination,
            "budget": gt.total_budget,
            "days": gt.days,
            "travel_type": gt.travel_type,
            "season": gt.season,
            "weather_temp": None,
            "weather_desc": None,
            "weather_humidity": None,
            "weather_wind_speed": None,
            "itinerary": gt.itinerary,
            "hotel_cost": gt.accommodation_budget,
            "food_cost": gt.food_budget,
            "travel_cost": gt.transport_budget,
            "activity_cost": gt.activities_budget,
            "total_cost": gt.total_budget,
            "actual_hotel": None,
            "actual_food": None,
            "actual_travel": None,
            "actual_activities": None,
            "actual_misc": None,
            "actual_total": None,
            "is_group_trip": True,
            "group_name": gt.group_name,
            "organizer_name": gt.organizer_name,
            "relationship_type": gt.relationship_type,
            "adults_count": gt.adults_count,
            "children_count": gt.children_count,
            "seniors_count": gt.seniors_count,
            "total_travelers": gt.total_travelers,
            "created_at": gt.created_at
        }
        combined_list.append(dict_item)
        
    # Sort combined list by created_at descending
    combined_list.sort(key=lambda x: x["created_at"], reverse=True)
    return combined_list

@router.patch("/trips/{trip_id}/expenses", response_model=TripResponse)
async def update_trip_expenses(
    trip_id: int,
    data: TripExpenseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Allow users to log their actual trip expenses after completing a trip."""
    stmt = select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id)
    res = await db.execute(stmt)
    trip = res.scalars().first()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Update individual actual expense fields
    if data.actual_hotel is not None:
        trip.actual_hotel = data.actual_hotel
    if data.actual_food is not None:
        trip.actual_food = data.actual_food
    if data.actual_travel is not None:
        trip.actual_travel = data.actual_travel
    if data.actual_activities is not None:
        trip.actual_activities = data.actual_activities
    if data.actual_misc is not None:
        trip.actual_misc = data.actual_misc
    
    # Auto-compute actual_total from all filled fields
    trip.actual_total = sum(filter(None, [
        trip.actual_hotel,
        trip.actual_food,
        trip.actual_travel,
        trip.actual_activities,
        trip.actual_misc
    ]))
    
    await db.commit()
    await db.refresh(trip)
    return trip

@router.delete("/trips/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id)
    res = await db.execute(stmt)
    trip = res.scalars().first()
    
    if trip:
        await db.delete(trip)
        await db.commit()
        return None
        
    stmt_g = select(GroupTrip).where(GroupTrip.id == trip_id, GroupTrip.user_id == current_user.id)
    res_g = await db.execute(stmt_g)
    gtrip = res_g.scalars().first()
    if gtrip:
        await db.delete(gtrip)
        await db.commit()
        return None
        
    raise HTTPException(status_code=404, detail="Trip not found")

@router.delete("/clear-trip-history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_all_trips(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    from sqlalchemy import delete
    stmt = delete(Trip).where(Trip.user_id == current_user.id)
    await db.execute(stmt)
    stmt_g = delete(GroupTrip).where(GroupTrip.user_id == current_user.id)
    await db.execute(stmt_g)
    await db.commit()
    return None
