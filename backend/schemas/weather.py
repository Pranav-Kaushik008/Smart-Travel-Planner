from pydantic import BaseModel
from typing import Optional

class WeatherResponse(BaseModel):
    temp: float
    description: str
    humidity: int
    wind_speed: float
    icon: Optional[str] = None
    feels_like: Optional[float] = None
