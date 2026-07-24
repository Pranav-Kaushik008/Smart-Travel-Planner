import math
from typing import Dict, Any, List


def calculate_room_plan(total_travelers: int, adults: int, children: int, seniors: int, total_budget: float, days: int) -> Dict[str, Any]:
    """
    Calculates group room and bed requirements based on group composition and budget.
    """
    rooms_required = max(1, math.ceil(total_travelers / 2))
    beds_required = total_travelers
    
    family_rooms = math.ceil(children / 2) if children > 0 else 0
    twin_sharing = max(0, math.ceil((adults + seniors - (family_rooms * 2)) / 2))
    triple_sharing = 1 if total_travelers >= 3 and total_travelers % 3 == 0 else 0
    dormitory_beds = total_travelers if total_budget / max(1, total_travelers) < 4000 else 0
    luxury_suites = max(1, math.ceil(total_travelers / 4)) if (total_budget / max(1, total_travelers)) > 15000 else 0

    est_room_rate_per_night = min(8000.0, max(1500.0, (total_budget * 0.40) / max(1, rooms_required * days)))
    est_acc_cost = round(rooms_required * est_room_rate_per_night * days, 2)

    return {
        "rooms_required": rooms_required,
        "beds_required": beds_required,
        "family_rooms": family_rooms,
        "twin_sharing": twin_sharing,
        "triple_sharing": triple_sharing,
        "dormitory_beds": dormitory_beds,
        "luxury_suites": luxury_suites,
        "est_acc_cost": est_acc_cost,
        "est_room_rate_per_night": round(est_room_rate_per_night, 2)
    }


def calculate_transport_plan(total_travelers: int, days: int) -> Dict[str, Any]:
    """
    Recommends transport vehicle based on group size.
    """
    if total_travelers <= 2:
        recommended_vehicle = "Private Taxi / Sedan or Rental Bike"
        vehicle_capacity = 4
        category = "Compact Car / Bike"
    elif total_travelers <= 5:
        recommended_vehicle = "SUV (Innova Crysta / Ertiga 6-Seater)"
        vehicle_capacity = 6
        category = "SUV"
    elif total_travelers <= 12:
        recommended_vehicle = "Tempo Traveller (12-Seater AC Pushback)"
        vehicle_capacity = 12
        category = "Tempo Traveller"
    elif total_travelers <= 25:
        recommended_vehicle = "Mini Bus / Tourist Coach (25-Seater)"
        vehicle_capacity = 25
        category = "Mini Bus"
    else:
        recommended_vehicle = "Volvo Luxury Tourist Bus (45-Seater) / IRCTC Group Train"
        vehicle_capacity = 45
        category = "Luxury Bus / Train"

    est_daily_transport = 3500.0 if total_travelers <= 5 else (7000.0 if total_travelers <= 12 else 12000.0)
    est_transport_cost = round(est_daily_transport * days, 2)

    return {
        "recommended_vehicle": recommended_vehicle,
        "vehicle_capacity": vehicle_capacity,
        "category": category,
        "est_transport_cost": est_transport_cost,
        "est_daily_transport": est_daily_transport
    }


def get_emergency_directory(destination: str) -> Dict[str, Any]:
    """
    Returns emergency contacts, hospitals, ATMs, fuel stations for destination.
    """
    return {
        "emergency_contacts": [
            {"service": "National Emergency Helpline", "number": "112"},
            {"service": "Medical Ambulance", "number": "108"},
            {"service": "Police Assistance", "number": "100 / 112"},
            {"service": "Tourist Helpline India", "number": "1363 / 1800-11-1363"},
        ],
        "hospitals": [
            f"Apollo / Manipal Emergency Hospital {destination}",
            f"Government District Civil Hospital {destination}",
            f"24/7 Trauma & Urgent Care Center {destination}"
        ],
        "atms": [
            "State Bank of India (SBI) 24/7 ATM",
            "HDFC Bank & ICICI Bank ATM Kiosks",
            "Axis Bank Cash Deposit & ATM Center"
        ],
        "fuel_stations": [
            "Indian Oil Petrol & Diesel Pump (24 Hours)",
            "Bharat Petroleum (BPCL) Highway Station",
            "HPCL EV Fast Charging Station & Fuel Hub"
        ],
        "parking": [
            f"Municipal Tourist Bus & Car Parking Ground ({destination})",
            f"Central Railway / Bus Station Paid Parking ({destination})"
        ]
    }


def calculate_expense_split(total_budget: float, adults: int, children: int, seniors: int, members: List[Dict[str, Any]], split_method: str = "Equal Split") -> List[Dict[str, Any]]:
    """
    Calculates individual shares and contribution balances.
    """
    total_travelers = max(1, adults + children + seniors)
    
    if split_method == "Adults Only":
        paying_count = max(1, adults)
        per_paying_share = round(total_budget / paying_count, 2)
    else:  # Equal Split or default
        per_paying_share = round(total_budget / total_travelers, 2)

    split_list = []
    
    if members and len(members) > 0:
        for m in members:
            name = m.get("name", "Member")
            is_child = m.get("age", 25) < 12
            
            if split_method == "Adults Only" and is_child:
                share = 0.0
            else:
                share = per_paying_share
                
            contrib = float(m.get("contribution_amount", 0.0))
            pending = round(max(0.0, share - contrib), 2)
            extra = round(max(0.0, contrib - share), 2)
            
            split_list.append({
                "name": name,
                "role": m.get("role", "Member"),
                "share": share,
                "contribution": contrib,
                "pending": pending,
                "extra": extra,
                "refund": extra
            })
    else:
        # Default placeholder breakdown
        for i in range(1, total_travelers + 1):
            split_list.append({
                "name": f"Traveler #{i}",
                "role": "Organizer" if i == 1 else "Member",
                "share": per_paying_share,
                "contribution": per_paying_share if i == 1 else 0.0,
                "pending": 0.0 if i == 1 else per_paying_share,
                "extra": 0.0,
                "refund": 0.0
            })

    return split_list
