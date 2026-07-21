from pydantic import BaseModel
from typing import List, Optional

class RouteResponse(BaseModel):
    origin_city: str
    origin_state: str
    dest_city: str
    distance_km: float
    duration_text: str
    route_summary: str

class FlightOffer(BaseModel):
    airline: str
    flight_number: str
    departure: str
    arrival: str
    duration: str
    stops: int
    price: float
    currency: str = "INR"
    logo_url: Optional[str] = None
    booking_url: str
    origin_iata: Optional[str] = None
    dest_iata: Optional[str] = None
    date: Optional[str] = None

class FlightSearchResponse(BaseModel):
    flights: List[FlightOffer]
    source: str = "fallback"
    airport_note: Optional[str] = None

class TrainOffer(BaseModel):
    train_name: str
    train_number: str
    departure: str
    arrival: str
    duration: str
    classes: List[str]
    fare: float
    booking_url: str

class TrainSearchResponse(BaseModel):
    trains: List[TrainOffer]
    source: str = "fallback"
    transit_note: Optional[str] = None

class BusOffer(BaseModel):
    operator: str
    bus_type: str
    departure: str
    arrival: str
    duration: str
    amenities: List[str]
    seats_available: int
    price: float
    rating: float
    booking_url: str

class BusSearchResponse(BaseModel):
    buses: List[BusOffer]
    source: str = "fallback"
    transit_note: Optional[str] = None

class AttractionItem(BaseModel):
    name: str
    description: str
    image_url: str
    category: str
