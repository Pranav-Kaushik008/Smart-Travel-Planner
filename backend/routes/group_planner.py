from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from database.db import get_db
from models.user import User
from models.group import GroupTrip, GroupMember, GroupExpense
from schemas.group import (
    GroupTravelRequest,
    GroupRecommendationResponse,
    GroupExpenseCreate
)
from services.recommendation_service import recommendation_engine
from services.weather_service import get_weather
from services.budget_service import estimate_budget
from services.hotel_service import get_hotels_by_destination
from services import group_service
from services.gemini_service import generate_group_itinerary
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/group", tags=["Group Travel Planner"])


@router.post("/recommend", response_model=GroupRecommendationResponse)
async def group_recommend(
    req: GroupTravelRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate ML destination recommendations & group heuristics (room allocation, transport option, emergency directory).
    """
    total_travelers = max(1, req.adults_count + req.children_count + req.seniors_count)
    per_person_budget = req.total_budget / total_travelers
    
    # 1. Run ML prediction for destination using per-person budget
    destination = recommendation_engine.predict(
        budget=per_person_budget,
        days=req.days,
        travel_type=req.travel_type,
        season=req.season
    )
    
    # 2. Weather forecast
    weather_info = await get_weather(destination)
    weather_dict = None
    if weather_info:
        if hasattr(weather_info, "model_dump"):
            weather_dict = weather_info.model_dump()
        elif hasattr(weather_info, "dict"):
            weather_dict = weather_info.dict()
        else:
            weather_dict = weather_info
    
    # 3. Budget breakdown
    budget_breakdown = estimate_budget(
        destination=destination,
        days=req.days,
        travel_type=req.travel_type,
        total_budget=req.total_budget
    )
    budget_dict = None
    if budget_breakdown:
        if hasattr(budget_breakdown, "model_dump"):
            budget_dict = budget_breakdown.model_dump()
        elif hasattr(budget_breakdown, "dict"):
            budget_dict = budget_breakdown.dict()
        else:
            budget_dict = budget_breakdown
    
    # 4. Hotels
    hotels = await get_hotels_by_destination(destination, db)
    hotels_list = []
    if hotels:
        for h in hotels:
            if hasattr(h, "model_dump"):
                hotels_list.append(h.model_dump())
            elif hasattr(h, "dict"):
                hotels_list.append(h.dict())
            else:
                hotels_list.append({
                    "id": getattr(h, "id", 1),
                    "name": getattr(h, "name", f"{destination} Stay"),
                    "destination": getattr(h, "destination", destination),
                    "rating": getattr(h, "rating", 4.5),
                    "price_per_night": getattr(h, "price_per_night", 2500.0),
                    "amenities": getattr(h, "amenities", "Wi-Fi, Restaurant"),
                    "image_url": getattr(h, "image_url", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500")
                })
    
    # 5. Group Heuristics Calculations
    room_plan = group_service.calculate_room_plan(
        total_travelers=total_travelers,
        adults=req.adults_count,
        children=req.children_count,
        seniors=req.seniors_count,
        total_budget=req.total_budget,
        days=req.days
    )
    
    transport_plan = group_service.calculate_transport_plan(
        total_travelers=total_travelers,
        days=req.days
    )
    
    emergency_directory = group_service.get_emergency_directory(destination)
    
    members_dicts = []
    if req.members:
        for m in req.members:
            if hasattr(m, "model_dump"):
                members_dicts.append(m.model_dump())
            elif hasattr(m, "dict"):
                members_dicts.append(m.dict())
            else:
                members_dicts.append(dict(m))

    split_summary = group_service.calculate_expense_split(
        total_budget=req.total_budget,
        adults=req.adults_count,
        children=req.children_count,
        seniors=req.seniors_count,
        members=members_dicts,
        split_method=req.split_method
    )
    
    budget_per_person = round(req.total_budget / total_travelers, 2)
    expected_daily_spending = round(req.total_budget / max(1, req.days), 2)
    avg_cost_per_day_person = round(expected_daily_spending / total_travelers, 2)
    
    return GroupRecommendationResponse(
        destination=destination,
        total_travelers=total_travelers,
        budget_per_person=budget_per_person,
        expected_daily_spending=expected_daily_spending,
        average_cost_per_day_person=avg_cost_per_day_person,
        room_plan=room_plan,
        transport_plan=transport_plan,
        emergency_directory=emergency_directory,
        weather=weather_dict,
        budget_estimate=budget_dict,
        hotels=hotels_list,
        split_summary=split_summary
    )


@router.post("/generate-itinerary")
async def group_itinerary(
    req: GroupTravelRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generates a group-tailored day-wise itinerary using Gemini AI with rest break & dietary considerations.
    """
    total_travelers = max(1, req.adults_count + req.children_count + req.seniors_count)
    per_person_budget = req.total_budget / total_travelers
    
    # Predict destination first if not supplied
    destination = recommendation_engine.predict(
        budget=per_person_budget,
        days=req.days,
        travel_type=req.travel_type,
        season=req.season
    )
    
    itinerary_md = await generate_group_itinerary(
        destination=destination,
        days=req.days,
        travel_type=req.travel_type,
        total_budget=req.total_budget,
        total_travelers=total_travelers,
        adults=req.adults_count,
        children=req.children_count,
        seniors=req.seniors_count,
        relationship=req.relationship_type,
        special_requirements=req.special_requirements or []
    )
    return {"itinerary": itinerary_md, "destination": destination}


@router.post("/save-trip")
async def save_group_trip(
    data: Dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Saves a Group Trip to the database along with members and initial budget splits.
    """
    try:
        group_trip = GroupTrip(
            user_id=current_user.id,
            group_name=data.get("group_name", "Group Trip"),
            organizer_name=data.get("organizer_name", current_user.full_name or current_user.username),
            relationship_type=data.get("relationship_type", "Friends"),
            adults_count=int(data.get("adults_count", 1)),
            children_count=int(data.get("children_count", 0)),
            seniors_count=int(data.get("seniors_count", 0)),
            total_travelers=int(data.get("total_travelers", 1)),
            destination=data.get("destination", "Goa"),
            days=int(data.get("days", 3)),
            travel_type=data.get("travel_type", "Beach"),
            season=data.get("season", "All"),
            total_budget=float(data.get("total_budget", 10000.0)),
            accommodation_budget=float(data.get("accommodation_budget", 0.0)),
            food_budget=float(data.get("food_budget", 0.0)),
            transport_budget=float(data.get("transport_budget", 0.0)),
            activities_budget=float(data.get("activities_budget", 0.0)),
            shopping_budget=float(data.get("shopping_budget", 0.0)),
            emergency_fund=float(data.get("emergency_fund", 0.0)),
            misc_budget=float(data.get("misc_budget", 0.0)),
            split_method=data.get("split_method", "Equal Split"),
            special_requirements=data.get("special_requirements", []),
            room_plan=data.get("room_plan", {}),
            transport_plan=data.get("transport_plan", {}),
            emergency_directory=data.get("emergency_directory", {}),
            itinerary=data.get("itinerary", "")
        )
        db.add(group_trip)
        await db.commit()
        await db.refresh(group_trip)

        # Save members if provided
        members = data.get("members", [])
        for m in members:
            db_member = GroupMember(
                group_trip_id=group_trip.id,
                name=m.get("name", "Member"),
                age=int(m.get("age", 25)),
                gender=m.get("gender", "Other"),
                role=m.get("role", "Member"),
                phone=m.get("phone"),
                email=m.get("email"),
                emergency_contact=m.get("emergency_contact"),
                food_preference=m.get("food_preference", "No Preference"),
                special_needs=m.get("special_needs"),
                contribution_amount=float(m.get("contribution_amount", 0.0))
            )
            db.add(db_member)
        
        await db.commit()
        return {"status": "success", "message": "Group trip saved successfully!", "group_trip_id": group_trip.id}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save group trip: {str(e)}")


@router.post("/expenses")
async def add_group_expense(
    expense: GroupExpenseCreate,
    group_trip_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Adds a live expense to a group trip and recalculates balances.
    """
    query = select(GroupTrip).where(GroupTrip.id == group_trip_id, GroupTrip.user_id == current_user.id)
    res = await db.execute(query)
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Group trip not found.")

    db_expense = GroupExpense(
        group_trip_id=group_trip_id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        paid_by=expense.paid_by,
        split_between=expense.split_between
    )
    db.add(db_expense)
    await db.commit()
    await db.refresh(db_expense)

    return {"status": "success", "expense_id": db_expense.id, "message": f"Expense '{expense.title}' added."}
