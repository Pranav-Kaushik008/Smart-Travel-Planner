from sqlalchemy import String, Integer, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from database.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Extra profile fields
    profile_pic: Mapped[str] = mapped_column(Text, nullable=True) # Base64 encoded or URL
    phone: Mapped[str] = mapped_column(String(30), nullable=True)
    location: Mapped[str] = mapped_column(String(100), nullable=True)
    dob: Mapped[str] = mapped_column(String(20), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    interests: Mapped[list] = mapped_column(JSON, nullable=True)
    favorite_destinations: Mapped[list] = mapped_column(JSON, nullable=True)
    languages: Mapped[list] = mapped_column(JSON, nullable=True)

    # Relationship to trips
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
