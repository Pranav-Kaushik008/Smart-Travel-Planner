from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Dict, Any
from database.db import get_db
from models.trip import Trip
from models.group import GroupTrip
from schemas.dashboard import DashboardAnalytics, PopularDestination, BudgetAnalytics, TripMonthAnalytics
from middleware.auth_middleware import get_current_user
from models.user import User
from collections import defaultdict

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard/analytics", response_model=DashboardAnalytics)
async def get_dashboard_analytics(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    uid = current_user.id

    # ─── INDIVIDUAL TRIPS ────────────────────────────────────────────────────
    stmt_count = select(func.count(Trip.id)).where(Trip.user_id == uid)
    total_trips = (await db.execute(stmt_count)).scalar() or 0

    average_budget = 0.0
    average_days = 0.0
    if total_trips > 0:
        stmt_avg = select(func.avg(Trip.budget), func.avg(Trip.days)).where(Trip.user_id == uid)
        avg_row = (await db.execute(stmt_avg)).first()
        average_budget = float(avg_row[0] or 0.0)
        average_days = float(avg_row[1] or 0.0)

    # Popular destinations (individual)
    stmt_dest = (
        select(Trip.destination, func.count(Trip.id).label("count"))
        .where(Trip.user_id == uid)
        .group_by(Trip.destination)
        .order_by(func.count(Trip.id).desc())
        .limit(5)
    )
    popular_destinations = [
        PopularDestination(destination=row[0], count=row[1])
        for row in (await db.execute(stmt_dest)).all()
    ]
    most_popular_destination = popular_destinations[0].destination if popular_destinations else "N/A"

    # Budget breakdown (individual estimated)
    stmt_costs = select(
        func.sum(Trip.hotel_cost), func.sum(Trip.food_cost),
        func.sum(Trip.travel_cost), func.sum(Trip.activity_cost)
    ).where(Trip.user_id == uid)
    costs = (await db.execute(stmt_costs)).first()
    budget_breakdown = []
    if costs:
        budget_breakdown = [
            BudgetAnalytics(category="Hotel",    amount=float(costs[0] or 0.0)),
            BudgetAnalytics(category="Food",     amount=float(costs[1] or 0.0)),
            BudgetAnalytics(category="Travel",   amount=float(costs[2] or 0.0)),
            BudgetAnalytics(category="Activity", amount=float(costs[3] or 0.0)),
        ]

    # Actual expenses (individual, user-reported)
    stmt_actual = select(
        func.sum(Trip.actual_hotel), func.sum(Trip.actual_food),
        func.sum(Trip.actual_travel), func.sum(Trip.actual_activities),
        func.sum(Trip.actual_misc), func.sum(Trip.actual_total)
    ).where(Trip.user_id == uid)
    actuals = (await db.execute(stmt_actual)).first()
    total_actual_spent = float(actuals[5] or 0.0) if actuals else 0.0
    actual_breakdown = []
    if actuals:
        actual_breakdown = [
            BudgetAnalytics(category="Hotel",         amount=float(actuals[0] or 0.0)),
            BudgetAnalytics(category="Food",          amount=float(actuals[1] or 0.0)),
            BudgetAnalytics(category="Travel",        amount=float(actuals[2] or 0.0)),
            BudgetAnalytics(category="Activities",    amount=float(actuals[3] or 0.0)),
            BudgetAnalytics(category="Miscellaneous", amount=float(actuals[4] or 0.0)),
        ]

    # Trips over time & exact creation dates (individual)
    stmt_trips = select(Trip.created_at).where(Trip.user_id == uid).order_by(Trip.created_at.asc())
    dates = (await db.execute(stmt_trips)).scalars().all()
    
    month_counts = defaultdict(int)
    trip_dates_list = []
    for dt in dates:
        month_counts[dt.strftime("%b %Y")] += 1
        trip_dates_list.append(dt.strftime("%Y-%m-%d"))

    trips_over_time = [TripMonthAnalytics(month=m, count=c) for m, c in month_counts.items()]

    # ─── GROUP TRIPS ─────────────────────────────────────────────────────────
    stmt_g_count = select(func.count(GroupTrip.id)).where(GroupTrip.user_id == uid)
    total_group_trips = (await db.execute(stmt_g_count)).scalar() or 0

    total_group_travelers = 0
    avg_group_size = 0.0
    total_group_budget = 0.0
    group_destinations: List[PopularDestination] = []
    group_budget_breakdown: List[BudgetAnalytics] = []

    if total_group_trips > 0:
        stmt_g_agg = select(
            func.sum(GroupTrip.total_travelers),
            func.avg(GroupTrip.total_travelers),
            func.sum(GroupTrip.total_budget),
        ).where(GroupTrip.user_id == uid)
        g_agg = (await db.execute(stmt_g_agg)).first()
        total_group_travelers = int(g_agg[0] or 0)
        avg_group_size = float(g_agg[1] or 0.0)
        total_group_budget = float(g_agg[2] or 0.0)

        # Group dates
        stmt_g_dates = select(GroupTrip.created_at).where(GroupTrip.user_id == uid)
        g_dates = (await db.execute(stmt_g_dates)).scalars().all()
        for dt in g_dates:
            trip_dates_list.append(dt.strftime("%Y-%m-%d"))

        # Group popular destinations
        stmt_g_dest = (
            select(GroupTrip.destination, func.count(GroupTrip.id).label("count"))
            .where(GroupTrip.user_id == uid)
            .group_by(GroupTrip.destination)
            .order_by(func.count(GroupTrip.id).desc())
            .limit(5)
        )
        group_destinations = [
            PopularDestination(destination=row[0], count=row[1])
            for row in (await db.execute(stmt_g_dest)).all()
        ]

        # Group budget breakdown
        stmt_g_budget = select(
            func.sum(GroupTrip.accommodation_budget),
            func.sum(GroupTrip.food_budget),
            func.sum(GroupTrip.transport_budget),
            func.sum(GroupTrip.activities_budget),
            func.sum(GroupTrip.shopping_budget),
            func.sum(GroupTrip.emergency_fund),
            func.sum(GroupTrip.misc_budget),
        ).where(GroupTrip.user_id == uid)
        g_budget = (await db.execute(stmt_g_budget)).first()
        if g_budget:
            group_budget_breakdown = [
                BudgetAnalytics(category="Accommodation", amount=float(g_budget[0] or 0.0)),
                BudgetAnalytics(category="Food",          amount=float(g_budget[1] or 0.0)),
                BudgetAnalytics(category="Transport",     amount=float(g_budget[2] or 0.0)),
                BudgetAnalytics(category="Activities",    amount=float(g_budget[3] or 0.0)),
                BudgetAnalytics(category="Shopping",      amount=float(g_budget[4] or 0.0)),
                BudgetAnalytics(category="Emergency",     amount=float(g_budget[5] or 0.0)),
                BudgetAnalytics(category="Misc",          amount=float(g_budget[6] or 0.0)),
            ]

    # ─── BUILD RESPONSE ───────────────────────────────────────────────────────
    return DashboardAnalytics(
        total_trips=total_trips,
        most_popular_destination=most_popular_destination,
        average_budget=round(average_budget, 2),
        average_days=round(average_days, 1),
        total_actual_spent=round(total_actual_spent, 2),
        popular_destinations=popular_destinations,
        budget_breakdown=budget_breakdown,
        actual_breakdown=actual_breakdown,
        trips_over_time=trips_over_time,
        trip_dates=trip_dates_list,
        total_group_trips=total_group_trips,
        total_group_travelers=total_group_travelers,
        avg_group_size=round(avg_group_size, 1),
        total_group_budget=round(total_group_budget, 2),
        group_destinations=group_destinations,
        group_budget_breakdown=group_budget_breakdown,
    )
