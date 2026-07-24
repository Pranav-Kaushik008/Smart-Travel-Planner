from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class SupportTicketCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="User full name")
    email: EmailStr = Field(..., description="Valid contact email address")
    subject: str = Field(..., min_length=3, max_length=200, description="Ticket summary subject")
    category: str = Field(default="General Inquiry", description="Ticket classification category")
    priority: str = Field(default="Medium", description="Ticket priority: Low, Medium, High, Urgent")
    message: str = Field(..., min_length=5, description="Detailed problem statement or message")


class SupportTicketUpdate(BaseModel):
    status: Optional[str] = Field(default=None, description="Ticket status: Open, In Progress, Resolved, Closed")
    admin_reply: Optional[str] = Field(default=None, description="Administrator response message")
    assigned_to: Optional[str] = Field(default=None, description="Support agent assigned to ticket")
    priority: Optional[str] = Field(default=None, description="Ticket priority level")
    category: Optional[str] = Field(default=None, description="Ticket category")


class SupportTicketResponse(BaseModel):
    id: int
    ticket_number: str
    user_id: Optional[int] = None
    name: str
    email: str
    subject: str
    category: str
    priority: str
    message: str
    status: str
    admin_reply: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
