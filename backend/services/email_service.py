import logging
import httpx
from config import settings
from models.support import SupportTicket

logger = logging.getLogger(__name__)

RESEND_API_URL = "https://api.resend.com/emails"


async def send_new_ticket_admin_notification(ticket: SupportTicket) -> bool:
    """
    Sends an email notification to the system administrator when a new support ticket is submitted.
    Uses Resend API if RESEND_API_KEY is configured. Fails gracefully without crashing.
    """
    api_key = settings.RESEND_API_KEY
    if not api_key:
        logger.info("RESEND_API_KEY is not configured. Skipping admin email notification.")
        return False

    admin_email = settings.ADMIN_EMAIL or "admin@smarttravelplanner.com"
    subject = f"[New Ticket #{ticket.ticket_number}] {ticket.subject}"
    html_content = f"""
    <h2>New Support Ticket Submitted</h2>
    <p><strong>Ticket Number:</strong> {ticket.ticket_number}</p>
    <p><strong>Name:</strong> {ticket.name}</p>
    <p><strong>Email:</strong> {ticket.email}</p>
    <p><strong>Category:</strong> {ticket.category}</p>
    <p><strong>Priority:</strong> {ticket.priority}</p>
    <p><strong>Subject:</strong> {ticket.subject}</p>
    <p><strong>Message:</strong></p>
    <blockquote style="background: #f4f4f5; padding: 12px; border-left: 4px solid #0ea5e9;">
        {ticket.message}
    </blockquote>
    <p><a href="http://localhost:5173/admin/support">Click here to manage tickets in Admin Console</a></p>
    """

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": "Smart Travel Planner <support@smarttravelplanner.com>",
        "to": [admin_email],
        "subject": subject,
        "html": html_content,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(RESEND_API_URL, json=payload, headers=headers)
            if response.status_code in (200, 201):
                logger.info(f"Admin email notification sent for ticket {ticket.ticket_number}")
                return True
            else:
                logger.warning(f"Resend API returned status {response.status_code}: {response.text}")
                return False
    except Exception as e:
        logger.warning(f"Failed to send admin email via Resend API: {e}")
        return False


async def send_ticket_resolved_user_notification(ticket: SupportTicket) -> bool:
    """
    Sends an email notification to the user when their support ticket is marked as Resolved.
    Uses Resend API if RESEND_API_KEY is configured. Fails gracefully without crashing.
    """
    api_key = settings.RESEND_API_KEY
    if not api_key:
        logger.info("RESEND_API_KEY is not configured. Skipping user email notification.")
        return False

    subject = f"[Resolved] Support Ticket #{ticket.ticket_number} - {ticket.subject}"
    admin_reply_text = ticket.admin_reply or "Your ticket has been reviewed and resolved by our support team."
    
    html_content = f"""
    <h2>Your Support Ticket Has Been Resolved!</h2>
    <p>Dear {ticket.name},</p>
    <p>Great news! Your support ticket <strong>#{ticket.ticket_number}</strong> has been marked as <strong>Resolved</strong>.</p>
    <br/>
    <p><strong>Subject:</strong> {ticket.subject}</p>
    <p><strong>Resolution / Support Reply:</strong></p>
    <blockquote style="background: #e0f2fe; padding: 12px; border-left: 4px solid #0284c7; color: #0369a1;">
        {admin_reply_text}
    </blockquote>
    <br/>
    <p>If you have any further questions, you can reopen your ticket anytime from your <a href="http://localhost:5173/support-history">Support History page</a>.</p>
    <p>Best regards,<br/>Smart Travel Planner Support Team</p>
    """

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": "Smart Travel Planner Support <support@smarttravelplanner.com>",
        "to": [ticket.email],
        "subject": subject,
        "html": html_content,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(RESEND_API_URL, json=payload, headers=headers)
            if response.status_code in (200, 201):
                logger.info(f"User resolution email sent to {ticket.email} for ticket {ticket.ticket_number}")
                return True
            else:
                logger.warning(f"Resend API returned status {response.status_code}: {response.text}")
                return False
    except Exception as e:
        logger.warning(f"Failed to send user resolution email via Resend API: {e}")
        return False
