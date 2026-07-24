from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


class GroupMemberCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(default=25, ge=0, le=120)
    gender: str = Field(default="Other")
    role: str = Field(default="Member")  # Organizer, Treasurer, Driver, Member
    phone: Optional[str] = None
    email: Optional[str] = None
    emergency_contact: Optional[str] = None
    food_preference: Optional[str] = "No Preference"
    special_needs: Optional[str] = None
    contribution_amount: float = Field(default=0.0, ge=0.0)


class GroupExpenseCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    amount: float = Field(..., gt=0.0)
    category: str = Field(default="Miscellaneous")
    paid_by: str = Field(..., min_length=1)
    split_between: str = Field(default="All Members")


class GroupTravelRequest(BaseModel):
    group_name: str = Field(default="Group Adventure")
    organizer_name: str = Field(default="Group Organizer")
    relationship_type: str = Field(default="Friends")  # Friends, Family, Corporate Team, College Trip, Pilgrimage, Backpacking Group, Custom Group
    
    # Composition
    adults_count: int = Field(default=1, ge=1)
    children_count: int = Field(default=0, ge=0)
    seniors_count: int = Field(default=0, ge=0)
    
    # Core Preferences
    days: int = Field(..., ge=1)
    travel_type: str = Field(..., description="Beach, Adventure, Historical, Nature, Religious, Wildlife")
    season: str = Field(..., description="Summer, Winter, Monsoon, All")
    
    # Detailed Budget
    total_budget: float = Field(..., gt=0.0)
    accommodation_budget: Optional[float] = 0.0
    food_budget: Optional[float] = 0.0
    transport_budget: Optional[float] = 0.0
    activities_budget: Optional[float] = 0.0
    shopping_budget: Optional[float] = 0.0
    emergency_fund: Optional[float] = 0.0
    misc_budget: Optional[float] = 0.0
    
    split_method: str = Field(default="Equal Split")
    special_requirements: Optional[List[str]] = []
    members: Optional[List[GroupMemberCreate]] = []


class GroupRecommendationResponse(BaseModel):
    destination: str
    total_travelers: int
    budget_per_person: float
    expected_daily_spending: float
    average_cost_per_day_person: float
    room_plan: Dict[str, Any]
    transport_plan: Dict[str, Any]
    emergency_directory: Dict[str, Any]
    weather: Optional[Dict[str, Any]] = None
    budget_estimate: Optional[Dict[str, Any]] = None
    hotels: List[Any] = []
    split_summary: List[Dict[str, Any]] = []
