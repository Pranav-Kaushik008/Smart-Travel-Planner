from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from models.user import User
from schemas.auth import UserResponse
from middleware.auth_middleware import get_current_user
from pydantic import BaseModel, EmailStr
from typing import Optional, List

router = APIRouter(tags=["Profile"])


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    dob: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[List[str]] = None
    favorite_destinations: Optional[List[str]] = None
    languages: Optional[List[str]] = None


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.email is not None:
        current_user.email = data.email
    if data.phone is not None:
        current_user.phone = data.phone
    if data.location is not None:
        current_user.location = data.location
    if data.dob is not None:
        current_user.dob = data.dob
    if data.bio is not None:
        current_user.bio = data.bio
    if data.interests is not None:
        current_user.interests = data.interests
    if data.favorite_destinations is not None:
        current_user.favorite_destinations = data.favorite_destinations
    if data.languages is not None:
        current_user.languages = data.languages

    await db.commit()
    await db.refresh(current_user)
    return current_user
