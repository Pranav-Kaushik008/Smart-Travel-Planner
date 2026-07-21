import httpx
from config import settings

# Coordinates for popular Indian destinations
DESTINATION_COORDS = {
    "Goa": (15.2993, 74.1240), "Manali": (32.2396, 77.1887),
    "Jaipur": (26.9124, 75.7873), "Kerala": (10.8505, 76.2711),
    "Ooty": (11.4102, 76.6950), "Rishikesh": (30.0869, 78.2676),
    "Varanasi": (25.3176, 82.9739), "Ladakh": (34.1526, 77.5771),
    "Andaman": (11.7401, 92.6586), "Kedarnath": (30.7346, 79.0669),
    "Ayodhya": (26.7922, 82.1998), "Mysore": (12.2958, 76.6394),
    "Coorg": (12.3375, 75.8069), "Hampi": (15.3350, 76.4600),
    "Shimla": (31.1048, 77.1734), "Darjeeling": (27.0360, 88.2627),
    "Tirupati": (13.6288, 79.4192), "Amritsar": (31.6340, 74.8723),
    "Jim Corbett": (29.5300, 78.7747), "Udaipur": (24.5854, 73.7125),
    "Mumbai": (19.0760, 72.8777), "Delhi": (28.7041, 77.1025),
    "Bengaluru": (12.9716, 77.5946), "Chennai": (13.0827, 80.2707),
    "Kolkata": (22.5726, 88.3639), "Hyderabad": (17.3850, 78.4867),
    "Pune": (18.5204, 73.8567), "Ahmedabad": (23.0225, 72.5714),
    "Mangaluru": (12.9141, 74.8560), "Munnar": (10.0889, 77.0595),
    "Kolad": (18.4239, 73.2205), "Nagarhole": (11.9967, 76.1264),
}

async def get_route_info(origin_lat: float, origin_lng: float, destination: str) -> dict:
    """Get route info from origin coordinates to destination city."""
    dest_coords = DESTINATION_COORDS.get(destination)
    
    # Reverse geocode the origin
    origin_city, origin_state = await _reverse_geocode(origin_lat, origin_lng)
    dest_city = destination
    
    if dest_coords and settings.OPENROUTE_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Get directions
                resp = await client.post(
                    "https://api.openrouteservice.org/v2/directions/driving-car",
                    headers={"Authorization": settings.OPENROUTE_API_KEY, "Content-Type": "application/json"},
                    json={"coordinates": [[origin_lng, origin_lat], [dest_coords[1], dest_coords[0]]]}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    seg = data["routes"][0]["summary"]
                    dist_km = round(seg["distance"] / 1000, 1)
                    dur_secs = seg["duration"]
                    hrs = int(dur_secs // 3600)
                    mins = int((dur_secs % 3600) // 60)
                    return {
                        "origin_city": origin_city, "origin_state": origin_state,
                        "dest_city": dest_city, "distance_km": dist_km,
                        "duration_text": f"{hrs}h {mins}m",
                        "route_summary": f"Drive via national highway from {origin_city} to {dest_city}"
                    }
        except Exception:
            pass
    
    # Fallback: estimate distance using haversine
    dist_km = _haversine(origin_lat, origin_lng, dest_coords[0], dest_coords[1]) if dest_coords else 500.0
    hrs = int(dist_km // 60)
    mins = int((dist_km % 60))
    return {
        "origin_city": origin_city, "origin_state": origin_state,
        "dest_city": dest_city, "distance_km": round(dist_km, 1),
        "duration_text": f"{hrs}h {mins}m",
        "route_summary": f"Estimated route from {origin_city} to {dest_city} via highway"
    }

async def _reverse_geocode(lat: float, lng: float) -> tuple:
    """Reverse geocode coordinates to city, state. Falls back to coordinate-based lookup."""
    if settings.OPENROUTE_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=8) as client:
                resp = await client.get(
                    "https://api.openrouteservice.org/geocode/reverse",
                    params={"api_key": settings.OPENROUTE_API_KEY, "point.lon": lng, "point.lat": lat, "size": 1}
                )
                if resp.status_code == 200:
                    feat = resp.json()["features"][0]["properties"]
                    return feat.get("locality", feat.get("name", "Unknown")), feat.get("region", "India")
        except Exception:
            pass
    
    # Fallback: find nearest known city
    best, best_d = ("Unknown", "India"), 99999
    for city, (clat, clng) in DESTINATION_COORDS.items():
        d = _haversine(lat, lng, clat, clng)
        if d < best_d:
            best_d = d
            best = (city, "India")
    return best

import math
def _haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
