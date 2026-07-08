from schemas.travel import BudgetEstimate

def estimate_budget(destination: str, days: int, travel_type: str, total_budget: float) -> BudgetEstimate:
    # Heuristics for travel destination cost tier
    expensive_destinations = ["Andaman", "Ladakh", "Goa","Varanasi"]
    mid_destinations = ["Manali", "Kerala", "Jaipur", "Ooty","Coorg","Tirupati"]
    
    # Establish daily multipliers based on destination tier
    if destination in expensive_destinations:
        hotel_multiplier = 2500.0
        food_multiplier = 1000.0
        travel_multiplier = 1500.0
        activity_multiplier = 1200.0
    elif destination in mid_destinations:
        hotel_multiplier = 1500.0
        food_multiplier = 700.0
        travel_multiplier = 1000.0
        activity_multiplier = 800.0
    else:
        # Budget destination
        hotel_multiplier = 1000.0
        food_multiplier = 500.0
        travel_multiplier = 600.0
        activity_multiplier = 500.0
        
    # Scale based on travel style
    if travel_type == "Adventure":
        activity_multiplier *= 1.5
        travel_multiplier *= 1.2
    elif travel_type == "Beach":
        hotel_multiplier *= 1.2
        food_multiplier *= 1.1
    elif travel_type == "Historical" or travel_type == "Religious":
        activity_multiplier *= 0.7
        
    # Base estimated costs
    est_hotel = hotel_multiplier * days
    est_food = food_multiplier * days
    est_travel = travel_multiplier * days
    est_activity = activity_multiplier * days
    est_total = est_hotel + est_food + est_travel + est_activity
    
    # Scale proportions to match the user's input budget if input budget is reasonable
    # otherwise we scale the inputs
    if total_budget > 0:
        # Proportional allocation
        ratio = total_budget / est_total
        # If user provides a very low budget, we still display it but cap it at min survival budget
        # Let's allocate proportionally
        hotel_cost = round(est_hotel * ratio, 2)
        food_cost = round(est_food * ratio, 2)
        travel_cost = round(est_travel * ratio, 2)
        activity_cost = round(est_activity * ratio, 2)
        total_cost = round(total_budget, 2)
    else:
        hotel_cost = round(est_hotel, 2)
        food_cost = round(est_food, 2)
        travel_cost = round(est_travel, 2)
        activity_cost = round(est_activity, 2)
        total_cost = round(est_total, 2)
        
    return BudgetEstimate(
        hotel_cost=hotel_cost,
        food_cost=food_cost,
        travel_cost=travel_cost,
        activity_cost=activity_cost,
        total_cost=total_cost
    )
