from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    full_name: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str]
    phone: Optional[str] = None
    location: Optional[str] = None
    dob: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[List[str]] = []
    favorite_destinations: Optional[List[str]] = []
    languages: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True
