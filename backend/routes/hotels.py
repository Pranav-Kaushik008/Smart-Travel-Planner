from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database.db import get_db
from schemas.hotel import HotelResponse
from services.hotel_service import get_hotels_by_destination

router = APIRouter(tags=["Hotels"])

@router.get("/hotels/{destination}", response_model=List[HotelResponse])
async def get_hotels(destination: str, db: AsyncSession = Depends(get_db)):
    hotels = await get_hotels_by_destination(destination, db)
    return hotels
