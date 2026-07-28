"""
Admin Promotion Script
======================
Run this script from the backend directory to promote any user to admin.

Usage:
    python make_admin.py                          # promotes pranavkaushikyr@gmail.com (default)
    python make_admin.py --email your@email.com   # promotes a specific email
    python make_admin.py --username pranav         # promotes by username
    python make_admin.py --list                   # lists all registered users

Example:
    cd "Smart Travel Planner/backend"
    python make_admin.py
"""

import asyncio
import argparse
import sys
import os

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

from sqlalchemy import select
from database.db import AsyncSessionLocal, engine, Base
from models.user import User
import models  # ensure all models are registered


async def list_users():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).order_by(User.id))
        users = result.scalars().all()
        if not users:
            print("❌ No users found in the database.")
            return
        print(f"\n{'ID':<5} {'Username':<20} {'Email':<35} {'Full Name':<20} {'Admin'}")
        print("-" * 90)
        for u in users:
            admin_badge = "✅ ADMIN" if u.is_admin else "—"
            print(f"{u.id:<5} {u.username:<20} {u.email:<35} {(u.full_name or ''):<20} {admin_badge}")
        print()


async def promote_user(email: str = None, username: str = None):
    from config import settings

    # Default to configured ADMIN_EMAIL
    if not email and not username:
        email = settings.ADMIN_EMAIL

    async with AsyncSessionLocal() as session:
        if email:
            result = await session.execute(select(User).where(User.email == email))
        else:
            result = await session.execute(select(User).where(User.username == username))

        user = result.scalars().first()

        if not user:
            target = email or username
            print(f"\n❌ No user found with {'email' if email else 'username'}: '{target}'")
            print("   Run: python make_admin.py --list  to see all registered users.\n")
            return

        if user.is_admin:
            print(f"\n✅ '{user.username}' ({user.email}) is already an Admin. Nothing to do.\n")
            return

        user.is_admin = True
        await session.commit()
        await session.refresh(user)

        print(f"\n✅ SUCCESS! '{user.username}' ({user.email}) has been promoted to Admin.")
        print("   👉 Restart the backend, then refresh the browser — 'Admin Support' will appear in the sidebar.\n")


async def main():
    parser = argparse.ArgumentParser(description="Promote a user to Admin in Smart Travel Planner")
    parser.add_argument("--email", type=str, help="Email of the user to promote")
    parser.add_argument("--username", type=str, help="Username of the user to promote")
    parser.add_argument("--list", action="store_true", help="List all registered users")
    args = parser.parse_args()

    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    if args.list:
        await list_users()
    else:
        await promote_user(email=args.email, username=args.username)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
