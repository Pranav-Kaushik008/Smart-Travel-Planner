from pydantic import BaseModel
from typing import List, Optional

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
    average_days: float  # Average trip duration in days
    total_actual_spent: float  # Sum of all user-reported actual_total across trips
    popular_destinations: List[PopularDestination]
    budget_breakdown: List[BudgetAnalytics]
    actual_breakdown: List[BudgetAnalytics]  # Sum of actual expenses by category
    trips_over_time: List[TripMonthAnalytics]
