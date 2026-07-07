from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from models.user import User
from schemas.auth import UserResponse
from middleware.auth_middleware import get_current_user
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(tags=["Profile"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(data: ProfileUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.email is not None:
        current_user.email = data.email
        
    await db.commit()
    await db.refresh(current_user)
    return current_user
