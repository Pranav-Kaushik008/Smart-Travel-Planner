from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from database.db import get_db
from models.user import User
from schemas.support import SupportTicketCreate, SupportTicketUpdate, SupportTicketResponse
from services import support_service, email_service
from middleware.auth_middleware import oauth2_scheme
from services.auth_service import decode_token
from sqlalchemy import select

router = APIRouter(tags=["Support Ticket Management"])


async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Optional[User]:
    """
    Optional authentication dependency. Returns User if valid token is provided, else None.
    """
    if not token:
        return None
    try:
        payload = decode_token(token)
        if not payload:
            return None
        username: str = payload.get("sub")
        if not username:
            return None
        query = select(User).where(User.username == username)
        result = await db.execute(query)
        return result.scalars().first()
    except Exception:
        return None


@router.post("/support", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
async def create_support_ticket(
    ticket_in: SupportTicketCreate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new support ticket (STP-100001 format).
    Triggers Resend API email notification to administrator if API key is set.
    """
    user_id = current_user.id if current_user else None
    
    # Create ticket in DB
    ticket = await support_service.create_ticket(db, ticket_in, user_id=user_id)
    
    # Trigger non-blocking admin notification email
    try:
        await email_service.send_new_ticket_admin_notification(ticket)
    except Exception as e:
        print(f"Warning: email notification failed: {e}")

    return ticket


@router.get("/support", response_model=List[SupportTicketResponse])
async def list_support_tickets(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    search: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get support tickets.
    If authenticated user is logged in, fetches user's tickets (or all tickets if requested/admin).
    Supports status, priority, and search keyword filters.
    """
    user_id = None
    user_email = None

    if current_user:
        # Check if current user is admin via the is_admin field
        if not current_user.is_admin:
            user_id = current_user.id
            user_email = current_user.email

    tickets = await support_service.get_tickets(
        db,
        user_id=user_id,
        user_email=user_email,
        status=status_filter,
        priority=priority_filter,
        search=search
    )
    return tickets


@router.get("/support/{ticket_number}", response_model=SupportTicketResponse)
async def get_support_ticket(
    ticket_number: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get details of a single support ticket by its ticket_number (e.g., STP-100001).
    """
    ticket = await support_service.get_ticket_by_number(db, ticket_number)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Support ticket #{ticket_number} not found."
        )
    return ticket


@router.patch("/support/{ticket_number}", response_model=SupportTicketResponse)
async def update_support_ticket(
    ticket_number: str,
    update_data: SupportTicketUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update ticket status, admin reply, assigned agent, or priority.
    If status changes to 'Resolved', triggers email notification to the user via Resend API.
    """
    previous_ticket = await support_service.get_ticket_by_number(db, ticket_number)
    if not previous_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Support ticket #{ticket_number} not found."
        )

    was_resolved = previous_ticket.status == "Resolved"
    
    updated_ticket = await support_service.update_ticket(db, ticket_number, update_data)
    
    # If newly marked as Resolved, send resolution email to user
    if updated_ticket and updated_ticket.status == "Resolved" and not was_resolved:
        try:
            await email_service.send_ticket_resolved_user_notification(updated_ticket)
        except Exception as e:
            print(f"Warning: resolution email failed: {e}")

    return updated_ticket


@router.delete("/support/{ticket_number}")
async def delete_support_ticket(
    ticket_number: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a support ticket by ticket number.
    """
    success = await support_service.delete_ticket(db, ticket_number)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Support ticket #{ticket_number} not found."
        )
    return {"message": f"Ticket #{ticket_number} successfully deleted."}
