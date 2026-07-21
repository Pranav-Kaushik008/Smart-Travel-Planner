import random

OPERATORS = [
    "VRL Travels", "SRS Travels", "Orange Travels", "KPN Travels",
    "Neeta Travels", "KSRTC (State Transport)", "National Travels",
    "Jabbar Travels", "Zingbus", "IntrCity SmartBus"
]

BUS_TYPES = [
    "A/C Sleeper (2+1)", "A/C Seater (2+2)", "Scania Multi-Axle A/C Semi-Sleeper",
    "Volvo Multi-Axle A/C Sleeper", "Non-A/C Sleeper (2+1)", "Non-A/C Seater (2+2)"
]

ALL_AMENITIES = [
    "WiFi", "USB Charging Point", "Blanket", "Water Bottle", "Pillow",
    "Reading Light", "Emergency Exit", "CCTV", "Track My Bus"
]

def _clean_city_redbus(city: str) -> str:
    c = city.lower().strip()
    if c == "bengaluru":
        return "bangalore"
    if c == "kochi":
        return "cochin"
    return c.replace(" ", "-")

BUS_TRANSIT_NOTES = {
    "Kedarnath": "Kedarnath has no motorable road connection. Buses will take you to Sonprayag/Gaurikund hub. From there, you must complete the journey via a 16 km mountain trek, mule, or helicopter.",
    "Andaman": "Andaman Islands have no interstate bus connectivity from the Indian mainland. Local buses are available only for travel within Port Blair and Havelock Island.",
    "Ladakh": "Direct bus routes to Leh (Ladakh) are highly seasonal and only operate during summer (June to September) via the Manali-Leh or Srinagar-Leh highways.",
}

def search_buses(origin_city: str, dest_city: str, distance_km: float = 500.0) -> dict:
    """Generate realistic RedBus-style bus search results based on distance."""
    buses = []
    
    transit_note = None
    for k, v in BUS_TRANSIT_NOTES.items():
        if k.lower() in dest_city.lower():
            transit_note = v
            break
    
    dep_times = ["07:30", "09:00", "13:15", "18:30", "20:00", "21:30", "22:45"]
    arr_times = ["17:30", "19:00", "23:00", "04:30", "06:00", "07:30", "08:45"]
    
    # Calculate travel duration based on speed averaging ~55 km/h
    duration_mins = int((distance_km / 55) * 60)
    hrs = duration_mins // 60
    mins = duration_mins % 60
    duration_text = f"{hrs}h {mins}m"
    
    origin_clean = _clean_city_redbus(origin_city)
    dest_clean = _clean_city_redbus(dest_city)
    
    # Generate 5-8 bus operators
    num_buses = random.randint(5, 8)
    for i in range(num_buses):
        operator = OPERATORS[i % len(OPERATORS)]
        bus_type = BUS_TYPES[i % len(BUS_TYPES)]
        
        # Standard amenities, ensuring at least charging and water
        num_amenities = random.randint(3, 6)
        amenities = list(set(["USB Charging Point", "Water Bottle"] + random.sample(ALL_AMENITIES, num_amenities)))
        
        # Calculate price dynamically based on distance and bus type
        price_per_km = 0.95
        if "Volvo" in bus_type or "Scania" in bus_type:
            price_per_km = 2.1
        elif "A/C" in bus_type:
            price_per_km = 1.6
        
        price = round(distance_km * price_per_km, 0)
        # Ensure a reasonable minimum/maximum price
        price = max(450.0, min(price, 2800.0))
        
        # Random departure offset
        dep_time = dep_times[i % len(dep_times)]
        
        buses.append({
            "operator": operator,
            "bus_type": bus_type,
            "departure": dep_time,
            "arrival": arr_times[i % len(arr_times)],
            "duration": duration_text,
            "amenities": amenities,
            "seats_available": random.randint(2, 38),
            "price": price,
            "rating": round(random.uniform(3.4, 4.8), 1),
            "booking_url": f"https://www.redbus.in/bus-tickets/{origin_clean}-to-{dest_clean}"
        })
        
    buses.sort(key=lambda x: x["price"])
    return {"buses": buses, "source": "fallback", "transit_note": transit_note}
