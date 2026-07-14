from sqlalchemy import String, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from database.db import Base

class Trip(Base):
    __tablename__ = "trips"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), nullable=False)
    budget: Mapped[float] = mapped_column(Float, nullable=False)
    days: Mapped[int] = mapped_column(Integer, nullable=False)
    travel_type: Mapped[str] = mapped_column(String(50), nullable=False)
    season: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Weather
    weather_temp: Mapped[float] = mapped_column(Float, nullable=True)
    weather_desc: Mapped[str] = mapped_column(String(255), nullable=True)
    weather_humidity: Mapped[int] = mapped_column(Integer, nullable=True)
    weather_wind_speed: Mapped[float] = mapped_column(Float, nullable=True)
    
    # Itinerary (AI generated day-wise content stored as JSON or detailed text)
    itinerary: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Budget breakdown (AI estimated)
    hotel_cost: Mapped[float] = mapped_column(Float, default=0.0)
    food_cost: Mapped[float] = mapped_column(Float, default=0.0)
    travel_cost: Mapped[float] = mapped_column(Float, default=0.0)
    activity_cost: Mapped[float] = mapped_column(Float, default=0.0)
    total_cost: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Actual expenses (user-reported)
    actual_hotel: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    actual_food: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    actual_travel: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    actual_activities: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    actual_misc: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    actual_total: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="trips")
