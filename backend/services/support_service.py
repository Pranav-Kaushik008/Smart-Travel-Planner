from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc
from models.support import SupportTicket
from schemas.support import SupportTicketCreate, SupportTicketUpdate
from datetime import datetime


async def generate_ticket_number(db: AsyncSession) -> str:
    """
    Generates incremental ticket numbers in format: STP-100001, STP-100002, etc.
    """
    query = select(func.max(SupportTicket.id))
    result = await db.execute(query)
    max_id = result.scalar() or 0
    next_id = max_id + 1
    return f"STP-{100000 + next_id}"


async def create_ticket(
    db: AsyncSession,
    ticket_in: SupportTicketCreate,
    user_id: int | None = None
) -> SupportTicket:
    """
    Creates a new support ticket in PostgreSQL database.
    """
    ticket_number = await generate_ticket_number(db)
    
    db_ticket = SupportTicket(
        ticket_number=ticket_number,
        user_id=user_id,
        name=ticket_in.name,
        email=ticket_in.email,
        subject=ticket_in.subject,
        category=ticket_in.category,
        priority=ticket_in.priority,
        message=ticket_in.message,
        status="Open",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_ticket)
    await db.commit()
    await db.refresh(db_ticket)
    return db_ticket


async def get_tickets(
    db: AsyncSession,
    user_id: int | None = None,
    user_email: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    search: str | None = None
) -> list[SupportTicket]:
    """
    Fetches list of tickets with optional search and filters.
    If user_id or user_email is passed, scopes results to that user.
    """
    query = select(SupportTicket)

    # Scoping for non-admin user
    if user_id or user_email:
        conditions = []
        if user_id:
            conditions.append(SupportTicket.user_id == user_id)
        if user_email:
            conditions.append(SupportTicket.email.ilike(user_email))
        query = query.where(or_(*conditions))

    # Status filter
    if status and status != "All":
        query = query.where(SupportTicket.status == status)

    # Priority filter
    if priority and priority != "All":
        query = query.where(SupportTicket.priority == priority)

    # Search filter
    if search:
        search_term = f"%{search.strip()}%"
        query = query.where(
            or_(
                SupportTicket.ticket_number.ilike(search_term),
                SupportTicket.subject.ilike(search_term),
                SupportTicket.name.ilike(search_term),
                SupportTicket.email.ilike(search_term),
                SupportTicket.category.ilike(search_term),
                SupportTicket.message.ilike(search_term)
            )
        )

    query = query.order_by(desc(SupportTicket.created_at))
    result = await db.execute(query)
    return result.scalars().all()


async def get_ticket_by_number(db: AsyncSession, ticket_number: str) -> SupportTicket | None:
    """
    Retrieves a single support ticket by its unique ticket number (e.g., STP-100001).
    """
    query = select(SupportTicket).where(SupportTicket.ticket_number == ticket_number)
    result = await db.execute(query)
    return result.scalars().first()


async def update_ticket(
    db: AsyncSession,
    ticket_number: str,
    update_data: SupportTicketUpdate
) -> SupportTicket | None:
    """
    Updates an existing support ticket fields (status, admin_reply, assigned_to, etc.).
    """
    ticket = await get_ticket_by_number(db, ticket_number)
    if not ticket:
        return None

    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        return ticket

    for key, value in update_dict.items():
        if value is not None:
            setattr(ticket, key, value)

    ticket.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(ticket)
    return ticket


async def delete_ticket(db: AsyncSession, ticket_number: str) -> bool:
    """
    Deletes a support ticket by ticket number.
    """
    ticket = await get_ticket_by_number(db, ticket_number)
    if not ticket:
        return False

    await db.delete(ticket)
    await db.commit()
    return True
