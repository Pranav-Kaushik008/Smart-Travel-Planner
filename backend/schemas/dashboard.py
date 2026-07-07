from pydantic import BaseModel
from typing import List, Dict, Any

class PopularDestination(BaseModel):
    destination: str
    count: int

class BudgetAnalytics(BaseModel):
    category: str  # e.g., "Hotel", "Food", "Travel", "Activity"
    amount: float

class TripMonthAnalytics(BaseModel):
    month: str
    count: int

class DashboardAnalytics(BaseModel):
    total_trips: int
    most_popular_destination: str
    average_budget: float
    popular_destinations: List[PopularDestination]
    budget_breakdown: List[BudgetAnalytics]
    trips_over_time: List[TripMonthAnalytics]
