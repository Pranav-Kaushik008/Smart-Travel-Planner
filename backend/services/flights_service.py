import httpx
import random
from datetime import datetime, timedelta
from config import settings

# IATA codes for popular Indian cities
CITY_IATA = {
    "Goa": "GOI",
    "Jaipur": "JAI",
    "Kochi": "COK",
    "Cochin": "COK",
    "Kerala": "COK",
    "Varanasi": "VNS",
    "Ladakh": "IXL",
    "Andaman": "IXZ",
    "Mysore": "MYQ",
    "Darjeeling": "IXB",
    "Tirupati": "TIR",
    "Amritsar": "ATQ",
    "Udaipur": "UDR",
    "Mumbai": "BOM",
    "Delhi": "DEL",
    "Bengaluru": "BLR",
    "Bangalore": "BLR",
    "Chennai": "MAA",
    "Kolkata": "CCU",
    "Hyderabad": "HYD",
    "Pune": "PNQ",
    "Ahmedabad": "AMD",
    "Kaziranga": "JRH",
    "Mangaluru": "IXE",
    "Mangalore": "IXE",
}

# Destinations that don't have their own airport — mapped to nearest airport city
NEAREST_AIRPORT = {
    "Munnar": {
        "airport": "COK",
        "city": "Cochin International Airport",
        "distance": "110 km from Munnar",
    },
    "Kolad": {
        "airport": "BOM",
        "city": "Mumbai (Chhatrapati Shivaji Maharaj)",
        "distance": "115 km from Kolad",
    },
    "Nagarhole": {
        "airport": "MYQ",
        "city": "Mysore (Mandakalli)",
        "distance": "95 km from Nagarhole",
    },
    "Sundarbans": {
        "airport": "CCU",
        "city": "Kolkata (Netaji Subhash Chandra Bose)",
        "distance": "110 km from Sundarbans",
    },
    "Coorg": {
        "airport": "MYQ",
        "city": "Mysore (Mandakalli)",
        "distance": "120 km from Coorg",
    },
    "Manali": {
        "airport": "KUU",
        "city": "Bhuntar (Kullu)",
        "distance": "50 km from Manali",
    },
    "Ooty": {"airport": "CJB", "city": "Coimbatore", "distance": "88 km from Ooty"},
    "Rishikesh": {
        "airport": "DED",
        "city": "Dehradun (Jolly Grant)",
        "distance": "35 km from Rishikesh",
    },
    "Kedarnath": {
        "airport": "DED",
        "city": "Dehradun (Jolly Grant)",
        "distance": "250 km from Kedarnath",
    },
    "Ayodhya": {"airport": "LKO", "city": "Lucknow", "distance": "135 km from Ayodhya"},
    "Shimla": {
        "airport": "SLV",
        "city": "Shimla (Jubbarhatti)",
        "distance": "23 km from Shimla",
    },
    "Hampi": {"airport": "HBX", "city": "Hubli", "distance": "143 km from Hampi"},
    "Jim Corbett": {
        "airport": "PGH",
        "city": "Pantnagar",
        "distance": "80 km from Jim Corbett",
    },
}

# Destinations with absolutely no air connectivity (hill treks, remote)
NO_FLIGHTS = []

AIRLINE_LOGOS = {
    "IndiGo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png",
    "Air India": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Air_India_Logo.svg/200px-Air_India_Logo.svg.png",
    "SpiceJet": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/SpiceJet_logo.svg/200px-SpiceJet_logo.svg.png",
    "Vistara": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vistara_Logo.svg/200px-Vistara_Logo.svg.png",
    "AirAsia India": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png",
    "AirAsia": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png",
    "Akasa Air": "",
}


def _build_booking_url(
    origin_iata: str, dest_iata: str, date: str = None
) -> str:
    from datetime import datetime, timedelta
    formatted_date = "15/08/2026"
    if date:
        try:
            dt = datetime.strptime(date, "%Y-%m-%d")
            formatted_date = dt.strftime("%d/%m/%Y")
        except Exception:
            try:
                dt = datetime.strptime(date, "%d/%m/%Y")
                formatted_date = dt.strftime("%d/%m/%Y")
            except Exception:
                pass
    else:
        formatted_date = (datetime.now() + timedelta(days=15)).strftime("%d/%m/%Y")
    
    return f"https://www.makemytrip.com/flight/search?tripType=O&itinerary={origin_iata}-{dest_iata}-{formatted_date}&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&lang=eng"


async def search_flights(
    origin_city: str, dest_city: str, date: str = None, budget: float = None
) -> dict:
    """Search flights using Aviationstack API with fallback to realistic mock data."""

    # Check if destination has no air connectivity at all
    if dest_city in NO_FLIGHTS:
        return {"flights": [], "source": "no_airport"}

    # Check if destination needs nearest airport mapping
    nearest = NEAREST_AIRPORT.get(dest_city)
    if nearest:
        dest_iata = nearest["airport"]
        airport_note = f"Nearest airport: {nearest['city']} ({nearest['distance']})"
    else:
        dest_iata = CITY_IATA.get(dest_city, "GOI")
        airport_note = None

    origin_iata = CITY_IATA.get(origin_city, "BLR")
    origin_note = None
    if origin_city and origin_city.lower() == "bengaluru":
        origin_note = "Origin airport: Kempegowda International Airport (BLR)"

    airport_note_parts = []
    if origin_note:
        airport_note_parts.append(origin_note)
    if airport_note:
        airport_note_parts.append(airport_note)
    combined_airport_note = (
        " | ".join(airport_note_parts) if airport_note_parts else None
    )

    if settings.AVIATIONSTACK_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(
                    "http://api.aviationstack.com/v1/flights",
                    params={
                        "access_key": settings.AVIATIONSTACK_API_KEY,
                        "dep_iata": origin_iata,
                        "arr_iata": dest_iata,
                        "limit": 10,
                    },
                )
                if resp.status_code == 200:
                    data = resp.json().get("data", [])
                    flights = []
                    for item in data[:6]:
                        airline_name = item.get("airline", {}).get(
                            "name", "Unknown Airline"
                        )
                        flight_num = (
                            item.get("flight", {}).get("iata")
                            or f"{item.get('airline', {}).get('iata') or '6E'}-{item.get('flight', {}).get('number') or '100'}"
                        )

                        # Get scheduled departure and arrival times
                        dep_time_str = item.get("departure", {}).get("scheduled")
                        arr_time_str = item.get("arrival", {}).get("scheduled")

                        dep_time = (
                            dep_time_str.split("T")[1][:5]
                            if dep_time_str and "T" in dep_time_str
                            else "08:30"
                        )
                        arr_time = (
                            arr_time_str.split("T")[1][:5]
                            if arr_time_str and "T" in arr_time_str
                            else "10:45"
                        )

                        logo_url = AIRLINE_LOGOS.get(airline_name, "")

                        # Since Aviationstack does not return prices, we generate a realistic market price
                        price = float(random.randint(3200, 8500))

                        flights.append(
                            {
                                "airline": airline_name,
                                "flight_number": flight_num,
                                "departure": dep_time,
                                "arrival": arr_time,
                                "duration": "2h 15m",
                                "stops": 0,
                                "price": price,
                                "currency": "INR",
                                "logo_url": logo_url,
                                "booking_url": _build_booking_url(
                                    origin_iata, dest_iata, date
                                ),
                                "origin_iata": origin_iata,
                                "dest_iata": dest_iata,
                                "date": date or (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
                            }
                        )

                    if flights:
                        return {
                            "flights": flights,
                            "source": "aviationstack",
                            "airport_note": combined_airport_note,
                        }
        except Exception as e:
            print("Error in Aviationstack search:", e)

    # Fallback to realistic mock data
    return {
        "flights": _generate_mock_flights(
            origin_city, dest_city, origin_iata, dest_iata, budget, date
        ),
        "source": "fallback",
        "airport_note": combined_airport_note,
    }


def _generate_mock_flights(
    origin, dest, origin_iata, dest_iata, budget=None, date=None
) -> list:
    flights = []
    dep_times = ["06:15", "08:30", "10:45", "14:20", "17:05", "20:30"]
    arr_times = ["08:35", "10:50", "13:00", "16:40", "19:25", "22:50"]
    durations = ["2h 20m", "2h 20m", "2h 15m", "2h 20m", "2h 20m", "2h 20m"]

    mock_airlines = [
        {
            "name": "IndiGo",
            "code": "6E",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png",
        },
        {
            "name": "Air India",
            "code": "AI",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Air_India_Logo.svg/200px-Air_India_Logo.svg.png",
        },
        {
            "name": "SpiceJet",
            "code": "SG",
            "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/SpiceJet_logo.svg/200px-SpiceJet_logo.svg.png",
        },
        {
            "name": "Vistara",
            "code": "UK",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vistara_Logo.svg/200px-Vistara_Logo.svg.png",
        },
        {
            "name": "AirAsia India",
            "code": "I5",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png",
        },
        {"name": "Akasa Air", "code": "QP", "logo": ""},
    ]

    for i, airline in enumerate(mock_airlines):
        base_price = random.randint(2800, 8500)
        flights.append(
            {
                "airline": airline["name"],
                "flight_number": f"{airline['code']}-{random.randint(100, 999)}",
                "departure": dep_times[i % len(dep_times)],
                "arrival": arr_times[i % len(arr_times)],
                "duration": durations[i % len(durations)],
                "stops": random.choice([0, 0, 0, 1]),
                "price": float(base_price),
                "currency": "INR",
                "logo_url": airline["logo"],
                "booking_url": _build_booking_url(
                    origin_iata, dest_iata, date
                ),
                "origin_iata": origin_iata,
                "dest_iata": dest_iata,
                "date": date or (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
            }
        )

    flights.sort(key=lambda x: x["price"])
    return flights
