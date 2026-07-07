from sqlalchemy import String, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column
from database.db import Base

class Hotel(Base):
    __tablename__ = "hotels"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    price_per_night: Mapped[float] = mapped_column(Float, nullable=False)
    amenities: Mapped[str] = mapped_column(String(255), nullable=True)  # Comma separated amenities
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
