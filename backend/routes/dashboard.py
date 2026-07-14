from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Dict, Any
from database.db import get_db
from models.trip import Trip
from schemas.dashboard import DashboardAnalytics, PopularDestination, BudgetAnalytics, TripMonthAnalytics
from middleware.auth_middleware import get_current_user
from models.user import User
from collections import defaultdict

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard/analytics", response_model=DashboardAnalytics)
async def get_dashboard_analytics(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Total Trips
    stmt_count = select(func.count(Trip.id)).where(Trip.user_id == current_user.id)
    res_count = await db.execute(stmt_count)
    total_trips = res_count.scalar() or 0
    
    if total_trips == 0:
        return DashboardAnalytics(
            total_trips=0,
            most_popular_destination="N/A",
            average_budget=0.0,
            average_days=0.0,
            total_actual_spent=0.0,
            popular_destinations=[],
            budget_breakdown=[],
            actual_breakdown=[],
            trips_over_time=[]
        )
        
    # 2. Average Budget & Average Days
    stmt_avg = select(func.avg(Trip.budget), func.avg(Trip.days)).where(Trip.user_id == current_user.id)
    res_avg = await db.execute(stmt_avg)
    avg_row = res_avg.first()
    average_budget = float(avg_row[0] or 0.0)
    average_days = float(avg_row[1] or 0.0)
    
    # 3. Popular Destinations
    stmt_dest = select(Trip.destination, func.count(Trip.id).label("count")).where(Trip.user_id == current_user.id).group_by(Trip.destination).order_by(func.count(Trip.id).desc()).limit(5)
    res_dest = await db.execute(stmt_dest)
    popular_destinations = [PopularDestination(destination=row[0], count=row[1]) for row in res_dest.all()]
    
    most_popular_destination = popular_destinations[0].destination if popular_destinations else "N/A"
    
    # 4. Estimated Budget Breakdown (Hotel, Food, Travel, Activity)
    stmt_costs = select(
        func.sum(Trip.hotel_cost),
        func.sum(Trip.food_cost),
        func.sum(Trip.travel_cost),
        func.sum(Trip.activity_cost)
    ).where(Trip.user_id == current_user.id)
    res_costs = await db.execute(stmt_costs)
    costs = res_costs.first()
    
    budget_breakdown = []
    if costs:
        budget_breakdown = [
            BudgetAnalytics(category="Hotel", amount=float(costs[0] or 0.0)),
            BudgetAnalytics(category="Food", amount=float(costs[1] or 0.0)),
            BudgetAnalytics(category="Travel", amount=float(costs[2] or 0.0)),
            BudgetAnalytics(category="Activity", amount=float(costs[3] or 0.0)),
        ]
    
    # 5. Actual Expenses (user-reported)
    stmt_actual = select(
        func.sum(Trip.actual_hotel),
        func.sum(Trip.actual_food),
        func.sum(Trip.actual_travel),
        func.sum(Trip.actual_activities),
        func.sum(Trip.actual_misc),
        func.sum(Trip.actual_total)
    ).where(Trip.user_id == current_user.id)
    res_actual = await db.execute(stmt_actual)
    actuals = res_actual.first()
    
    total_actual_spent = float(actuals[5] or 0.0) if actuals else 0.0
    
    actual_breakdown = []
    if actuals:
        actual_breakdown = [
            BudgetAnalytics(category="Hotel", amount=float(actuals[0] or 0.0)),
            BudgetAnalytics(category="Food", amount=float(actuals[1] or 0.0)),
            BudgetAnalytics(category="Travel", amount=float(actuals[2] or 0.0)),
            BudgetAnalytics(category="Activities", amount=float(actuals[3] or 0.0)),
            BudgetAnalytics(category="Miscellaneous", amount=float(actuals[4] or 0.0)),
        ]
        
    # 6. Trips Over Time (Grouped by Month)
    stmt_trips = select(Trip.created_at).where(Trip.user_id == current_user.id).order_by(Trip.created_at.asc())
    res_trips = await db.execute(stmt_trips)
    dates = res_trips.scalars().all()
    
    month_counts = defaultdict(int)
    for dt in dates:
        month_str = dt.strftime("%b %Y")  # e.g., "Jan 2026"
        month_counts[month_str] += 1
        
    trips_over_time = [TripMonthAnalytics(month=m, count=c) for m, c in month_counts.items()]
    
    return DashboardAnalytics(
        total_trips=total_trips,
        most_popular_destination=most_popular_destination,
        average_budget=round(average_budget, 2),
        average_days=round(average_days, 1),
        total_actual_spent=round(total_actual_spent, 2),
        popular_destinations=popular_destinations,
        budget_breakdown=budget_breakdown,
        actual_breakdown=actual_breakdown,
        trips_over_time=trips_over_time
    )
