import httpx
import random
from config import settings
from urllib.parse import quote

TRAINS_DATA = {
    "default": [
        {"name": "Shatabdi Express", "number": "12027", "classes": ["CC", "EC"], "base_fare": 1200},
        {"name": "Rajdhani Express", "number": "12301", "classes": ["3A", "2A", "1A"], "base_fare": 1800},
        {"name": "Duronto Express", "number": "12213", "classes": ["SL", "3A", "2A"], "base_fare": 900},
        {"name": "Garib Rath Express", "number": "12615", "classes": ["3A"], "base_fare": 650},
        {"name": "Jan Shatabdi Express", "number": "12051", "classes": ["CC", "2S"], "base_fare": 500},
        {"name": "Superfast Express", "number": "12431", "classes": ["SL", "3A", "2A", "1A"], "base_fare": 750},
        {"name": "Vande Bharat Express", "number": "22439", "classes": ["CC", "EC"], "base_fare": 1600},
    ]
}

TRAIN_TRANSIT_NOTES = {
    "Munnar": "Munnar has no railway station. Trains are routed to Aluva (AWY) or Ernakulam Junction (ERS), located approx. 110 km (3.5 hours by road) from Munnar.",
    "Kolad": "Kolad has a local Konkan Railway station (KOL). Major express train routes connect via Roha Junction (ROHA), located 12 km from Kolad.",
    "Nagarhole": "Nagarhole National Park has no railway station. Trains are routed to Mysore Junction (MYS), located 90 km (approx. 2 hours by road) away.",
    "Sundarbans": "Sundarbans National Park has no direct railway station. Trains route to Sealdah/Howrah (HWH/SDAH) or Canning (CG) station, followed by a 3-hour boat journey from Godkhali Port.",
    "Coorg": "Coorg has no direct railway station. Trains are routed to Mysore Junction (MYS), located 120 km (approx. 2.5 hours by taxi/bus) from Coorg.",
    "Manali": "Manali has no direct railway station. Trains are routed to Una Himachal (UNA) or Chandigarh (CDG). A local bus/taxi is required to reach Manali (5-8 hours).",
    "Ooty": "Ooty is connected via a scenic Toy Train from Mettupalayam (MTP). Major railway connections route to Coimbatore Junction (CBE), 88 km away.",
    "Kedarnath": "Kedarnath has no railway station. Trains are routed to Rishikesh (RKSH) or Haridwar (HW), followed by a 210 km road trip to Sonprayag and a 16 km mountain trek.",
    "Ladakh": "Ladakh has no railway connectivity. Nearest major railhead is Jammu Tawi (JAT), located 680 km away, requiring a 2-day road journey.",
    "Andaman": "Andaman Islands are only accessible by flight or ship. There is no railway network available.",
    "Jim Corbett": "The nearest railway station is Ramnagar (RMR), located 12 km from Jim Corbett National Park. Express trains link directly to Delhi.",
    "Rishikesh": "Rishikesh station (RKSH) has limited train connectivity. Haridwar Junction (HW), 25 km away, offers better country-wide connections."
}

async def search_trains(origin_city: str, dest_city: str) -> dict:
    """Search trains via IRCTC RapidAPI with fallback to realistic mock data."""
    transit_note = None
    for k, v in TRAIN_TRANSIT_NOTES.items():
        if k.lower() in dest_city.lower():
            transit_note = v
            break

    # Try IRCTC RapidAPI
    if settings.RAPIDAPI_KEY:
        try:
            async with httpx.AsyncClient(timeout=12) as client:
                resp = await client.get(
                    "https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations",
                    headers={
                        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
                        "X-RapidAPI-Host": "irctc1.p.rapidapi.com"
                    },
                    params={"fromStationCode": _get_station(origin_city), "toStationCode": _get_station(dest_city)}
                )
                if resp.status_code == 200:
                    data = resp.json().get("data", [])
                    trains = []
                    for t in data[:7]:
                        trains.append({
                            "train_name": t.get("train_name", "Express"),
                            "train_number": t.get("train_number", "00000"),
                            "departure": t.get("from_std", "06:00"),
                            "arrival": t.get("to_std", "14:00"),
                            "duration": t.get("duration", "8h 0m"),
                            "classes": t.get("class_type", ["SL", "3A"]),
                            "fare": 850.0,
                            "booking_url": f"https://www.irctc.co.in/nget/train-search"
                        })
                    if trains:
                        return {"trains": trains, "source": "irctc", "transit_note": transit_note}
        except Exception:
            pass
    
    # Fallback: Generate realistic trains
    return {"trains": _generate_mock_trains(origin_city, dest_city), "source": "fallback", "transit_note": transit_note}

def _generate_mock_trains(origin: str, dest: str) -> list:
    trains = []
    dep_times = ["05:30", "06:45", "08:15", "12:30", "16:00", "20:45", "22:15"]
    arr_times = ["13:45", "14:30", "16:10", "20:45", "00:15", "06:30", "08:20"]
    durations = ["8h 15m", "7h 45m", "7h 55m", "8h 15m", "8h 15m", "9h 45m", "10h 05m"]
    
    for i, train in enumerate(TRAINS_DATA["default"]):
        fare_multiplier = random.uniform(0.85, 1.35)
        trains.append({
            "train_name": train["name"],
            "train_number": train["number"],
            "departure": dep_times[i],
            "arrival": arr_times[i],
            "duration": durations[i],
            "classes": train["classes"],
            "fare": round(train["base_fare"] * fare_multiplier, 0),
            "booking_url": "https://www.irctc.co.in/nget/train-search"
        })
    
    return trains

STATION_CODES = {
    "Goa": "MAO", "Manali": "UNA", "Jaipur": "JP", "Kerala": "ERS",
    "Ooty": "UAM", "Rishikesh": "RKSH", "Varanasi": "BSB", "Ladakh": "SVDK",
    "Kedarnath": "RKSH", "Ayodhya": "AY", "Mysore": "MYS", "Shimla": "SML",
    "Darjeeling": "NJP", "Tirupati": "TPTY", "Amritsar": "ASR", "Udaipur": "UDZ",
    "Mumbai": "CSTM", "Delhi": "NDLS", "Bengaluru": "SBC", "Chennai": "MAS",
    "Kolkata": "HWH", "Hyderabad": "SC", "Pune": "PUNE", "Ahmedabad": "ADI",
    "Coorg": "MYS", "Hampi": "HPT", "Jim Corbett": "RMR", "Andaman": "MAS",
    "Mangaluru": "MAJN", "Mangalore": "MAJN", "Munnar": "AWY", "Kolad": "ROHA", "Nagarhole": "MYS", "Sundarbans": "HWH",
}

def _get_station(city: str) -> str:
    return STATION_CODES.get(city, "NDLS")
