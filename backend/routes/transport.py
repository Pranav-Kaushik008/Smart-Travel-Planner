from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from schemas.transport import RouteResponse, FlightSearchResponse, TrainSearchResponse, BusSearchResponse, AttractionItem
from services.routes_service import get_route_info
from services.flights_service import search_flights
from services.trains_service import search_trains
from services.buses_service import search_buses
from services.attractions_service import get_attractions
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter(tags=["Transportation & Routes"])

def _clean_destination(dest: str) -> str:
    cleaned = dest.strip()
    if cleaned.lower() == "kerala":
        return "Kochi"
    return cleaned

@router.get("/routes/directions", response_model=RouteResponse)
async def get_directions(
    origin_lat: float = Query(..., description="Latitude of origin"),
    origin_lng: float = Query(..., description="Longitude of origin"),
    destination: str = Query(..., description="Destination city name"),
    current_user: User = Depends(get_current_user)
):
    try:
        destination = _clean_destination(destination)
        res = await get_route_info(origin_lat, origin_lng, destination)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch routes: {str(e)}")

@router.get("/flights", response_model=FlightSearchResponse)
async def get_flights(
    origin: str = Query(..., description="Origin city name"),
    destination: str = Query(..., description="Destination city name"),
    date: Optional[str] = Query(None, description="Departure date YYYY-MM-DD"),
    budget: Optional[float] = Query(None, description="Maximum budget threshold"),
    current_user: User = Depends(get_current_user)
):
    try:
        destination = _clean_destination(destination)
        res = await search_flights(origin, destination, date, budget)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch flights: {str(e)}")

@router.get("/trains", response_model=TrainSearchResponse)
async def get_trains(
    origin: str = Query(..., description="Origin city name"),
    destination: str = Query(..., description="Destination city name"),
    current_user: User = Depends(get_current_user)
):
    try:
        destination = _clean_destination(destination)
        res = await search_trains(origin, destination)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trains: {str(e)}")

@router.get("/buses", response_model=BusSearchResponse)
async def get_buses(
    origin: str = Query(..., description="Origin city name"),
    destination: str = Query(..., description="Destination city name"),
    distance_km: float = Query(500.0, description="Calculated route distance"),
    current_user: User = Depends(get_current_user)
):
    try:
        destination = _clean_destination(destination)
        res = search_buses(origin, destination, distance_km)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch buses: {str(e)}")

@router.get("/attractions/{destination}", response_model=List[AttractionItem])
async def get_attractions_route(
    destination: str,
    current_user: User = Depends(get_current_user)
):
    try:
        destination = _clean_destination(destination)
        res = get_attractions(destination)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch attractions: {str(e)}")
