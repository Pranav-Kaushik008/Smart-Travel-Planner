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

async def search_trains(origin_city: str, dest_city: str) -> dict:
    """Search trains via IRCTC RapidAPI with fallback to realistic mock data."""
    
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
                        return {"trains": trains, "source": "irctc"}
        except Exception:
            pass
    
    # Fallback: Generate realistic trains
    return {"trains": _generate_mock_trains(origin_city, dest_city), "source": "fallback"}

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
}

def _get_station(city: str) -> str:
    return STATION_CODES.get(city, "NDLS")
