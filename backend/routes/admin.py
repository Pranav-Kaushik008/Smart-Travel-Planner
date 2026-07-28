from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from database.db import get_db
from models.user import User
from models.support import SupportTicket
from schemas.support import SupportTicketResponse, SupportTicketUpdate
from services import support_service, email_service
from middleware.auth_middleware import get_current_user
from config import settings

router = APIRouter(tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that raises 403 if the logged-in user is not an admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    return current_user


@router.get("/admin/tickets", response_model=List[SupportTicketResponse])
async def admin_get_all_tickets(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    search: Optional[str] = Query(None),
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    [ADMIN ONLY] Returns ALL support tickets from every user.
    Supports filtering by status, priority, and keyword search.
    """
    tickets = await support_service.get_tickets(
        db,
        user_id=None,         # No user scoping — admin sees all
        user_email=None,
        status=status_filter,
        priority=priority_filter,
        search=search
    )
    return tickets


@router.patch("/admin/tickets/{ticket_number}", response_model=SupportTicketResponse)
async def admin_update_ticket(
    ticket_number: str,
    update_data: SupportTicketUpdate,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    [ADMIN ONLY] Update a ticket's status, admin reply, assigned agent, or priority.
    Sends a resolution email to the user if status changes to Resolved.
    """
    previous_ticket = await support_service.get_ticket_by_number(db, ticket_number)
    if not previous_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Support ticket #{ticket_number} not found."
        )

    was_resolved = previous_ticket.status == "Resolved"
    updated_ticket = await support_service.update_ticket(db, ticket_number, update_data)

    # Trigger resolution notification email
    if updated_ticket and updated_ticket.status == "Resolved" and not was_resolved:
        try:
            await email_service.send_ticket_resolved_user_notification(updated_ticket)
        except Exception as e:
            print(f"Warning: resolution email failed: {e}")

    return updated_ticket


@router.delete("/admin/tickets/{ticket_number}")
async def admin_delete_ticket(
    ticket_number: str,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """[ADMIN ONLY] Permanently delete a support ticket."""
    success = await support_service.delete_ticket(db, ticket_number)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Support ticket #{ticket_number} not found."
        )
    return {"message": f"Ticket #{ticket_number} permanently deleted."}


@router.post("/admin/promote")
async def promote_to_admin(
    x_admin_secret: str = Header(..., alias="X-Admin-Secret"),
    db: AsyncSession = Depends(get_db)
):
    """
    One-time setup endpoint: promotes the configured ADMIN_EMAIL user to is_admin=True.
    Requires the X-Admin-Secret header to match the JWT_SECRET_KEY for security.
    """
    # Only allow if the secret matches the JWT secret key (a simple security gate)
    if x_admin_secret != settings.JWT_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin secret key."
        )

    admin_email = settings.ADMIN_EMAIL
    if not admin_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No ADMIN_EMAIL configured in settings."
        )

    stmt = select(User).where(User.email == admin_email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No user found with email '{admin_email}'. Please register first."
        )

    user.is_admin = True
    await db.commit()
    await db.refresh(user)

    print(f"✅ User '{user.username}' ({user.email}) has been promoted to Admin.")
    return {
        "message": f"User '{user.username}' ({user.email}) promoted to Admin successfully.",
        "is_admin": True
    }
