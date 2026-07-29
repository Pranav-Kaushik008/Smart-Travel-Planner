import asyncio
from database.db import AsyncSessionLocal
from sqlalchemy import text

async def main():
    async with AsyncSessionLocal() as s:
        r = await s.execute(text("SELECT id, username, email, is_admin FROM users ORDER BY id;"))
        users = r.fetchall()
        print("\n=== USER ADMIN STATUS SUMMARY ===")
        for u in users:
            role = "ADMIN" if u[3] else "USER"
            print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]} | Role: {role}")

asyncio.run(main())
