from sqlalchemy import String, Integer, Float, ForeignKey, Text, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from database.db import Base


class GroupTrip(Base):
    __tablename__ = "group_trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    group_name: Mapped[str] = mapped_column(String(100), nullable=False)
    organizer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(50), nullable=False, default="Friends")
    
    # Composition
    adults_count: Mapped[int] = mapped_column(Integer, default=1)
    children_count: Mapped[int] = mapped_column(Integer, default=0)
    seniors_count: Mapped[int] = mapped_column(Integer, default=0)
    total_travelers: Mapped[int] = mapped_column(Integer, default=1)
    
    # Destination & Core details
    destination: Mapped[str] = mapped_column(String(100), nullable=False)
    days: Mapped[int] = mapped_column(Integer, nullable=False)
    travel_type: Mapped[str] = mapped_column(String(50), nullable=False)
    season: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Budget Breakdown
    total_budget: Mapped[float] = mapped_column(Float, nullable=False)
    accommodation_budget: Mapped[float] = mapped_column(Float, default=0.0)
    food_budget: Mapped[float] = mapped_column(Float, default=0.0)
    transport_budget: Mapped[float] = mapped_column(Float, default=0.0)
    activities_budget: Mapped[float] = mapped_column(Float, default=0.0)
    shopping_budget: Mapped[float] = mapped_column(Float, default=0.0)
    emergency_fund: Mapped[float] = mapped_column(Float, default=0.0)
    misc_budget: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Split Method
    split_method: Mapped[str] = mapped_column(String(50), default="Equal Split")
    
    # Requirements & Specs
    special_requirements: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    # Room & Transport Heuristics JSON
    room_plan: Mapped[dict] = mapped_column(JSON, nullable=True)
    transport_plan: Mapped[dict] = mapped_column(JSON, nullable=True)
    emergency_directory: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    itinerary: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    members = relationship("GroupMember", back_populates="group_trip", cascade="all, delete-orphan")
    expenses = relationship("GroupExpense", back_populates="group_trip", cascade="all, delete-orphan")


class GroupMember(Base):
    __tablename__ = "group_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    group_trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("group_trips.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(Integer, default=25)
    gender: Mapped[str] = mapped_column(String(20), default="Other")
    role: Mapped[str] = mapped_column(String(50), default="Member")  # Organizer, Treasurer, Driver, Member
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    emergency_contact: Mapped[str | None] = mapped_column(String(100), nullable=True)
    food_preference: Mapped[str | None] = mapped_column(String(50), default="No Preference")
    special_needs: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contribution_amount: Mapped[float] = mapped_column(Float, default=0.0)

    group_trip = relationship("GroupTrip", back_populates="members")


class GroupExpense(Base):
    __tablename__ = "group_expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    group_trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("group_trips.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="Miscellaneous")  # Accommodation, Food, Transport, Activities, Shopping, Misc
    paid_by: Mapped[str] = mapped_column(String(100), nullable=False)
    split_between: Mapped[str] = mapped_column(String(255), default="All Members")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    group_trip = relationship("GroupTrip", back_populates="expenses")
