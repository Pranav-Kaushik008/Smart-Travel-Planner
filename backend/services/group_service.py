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


def calculate_transport_plan(total_travelers: int, days: int, destination: str = "") -> Dict[str, Any]:
    """
    Recommends transport vehicle based on group size and destination type (island vs road).
    """
    is_island = "andaman" in destination.lower() or "lakshadweep" in destination.lower() or "port blair" in destination.lower()
    
    if is_island:
        recommended_vehicle = "Flight to Port Blair (IXZ) + Island Speedboat / Ferry & Local Taxi"
        category = "Flight + Marine Ferry"
        vehicle_capacity = total_travelers
    elif total_travelers <= 2:
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

    est_daily_transport = 4500.0 if is_island else (3500.0 if total_travelers <= 5 else (7000.0 if total_travelers <= 12 else 12000.0))
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


def calculate_expense_split(total_budget: float, adults: int, children: int, seniors: int, members: List[Dict[str, Any]] = None, split_method: str = "Equal Split") -> List[Dict[str, Any]]:
    """
    Calculates individual shares and contribution balances.
    When split_method contains 'adult', children pay 0.0 and only adults (+ seniors) share the total budget.
    """
    total_travelers = max(1, adults + children + seniors)
    paying_travelers = max(1, adults + seniors)
    
    method_str = str(split_method).lower()
    is_adults_only = "adult" in method_str or "child" in method_str or "free" in method_str
    
    if is_adults_only:
        per_paying_share = round(total_budget / paying_travelers, 2)
    else:
        per_paying_share = round(total_budget / total_travelers, 2)

    split_list = []
    
    if members and len(members) > 0:
        for m in members:
            name = m.get("name", "Member")
            age = int(m.get("age", 25))
            role = str(m.get("role", "")).strip()
            
            is_child = (age < 18) or (role.lower() in ["child", "kid", "infant"])
            
            if is_adults_only and is_child:
                share = 0.0
            else:
                share = per_paying_share
                
            contrib = float(m.get("contribution_amount", 0.0))
            pending = round(max(0.0, share - contrib), 2)
            extra = round(max(0.0, contrib - share), 2)
            
            split_list.append({
                "name": name,
                "role": m.get("role", "Child" if is_child else "Member"),
                "share": share,
                "contribution": contrib,
                "pending": pending,
                "extra": extra,
                "refund": extra
            })
    else:
        # Generate default member roster according to adults, children, seniors composition
        idx = 1
        # Adults
        for a in range(1, adults + 1):
            role_label = "Organizer" if idx == 1 else "Adult Traveler"
            split_list.append({
                "name": f"Adult #{a}",
                "role": role_label,
                "share": per_paying_share,
                "contribution": total_budget if idx == 1 else 0.0,
                "pending": 0.0 if idx == 1 else per_paying_share,
                "extra": max(0.0, total_budget - per_paying_share) if idx == 1 else 0.0,
                "refund": max(0.0, total_budget - per_paying_share) if idx == 1 else 0.0
            })
            idx += 1
        # Seniors
        for s in range(1, seniors + 1):
            share = per_paying_share
            split_list.append({
                "name": f"Senior #{s}",
                "role": "Senior Traveler",
                "share": share,
                "contribution": 0.0,
                "pending": share,
                "extra": 0.0,
                "refund": 0.0
            })
            idx += 1
        # Children
        for c in range(1, children + 1):
            share = 0.0 if is_adults_only else per_paying_share
            split_list.append({
                "name": f"Child #{c}",
                "role": "Child",
                "share": share,
                "contribution": 0.0,
                "pending": share,
                "extra": 0.0,
                "refund": 0.0
            })
            idx += 1

    return split_list
