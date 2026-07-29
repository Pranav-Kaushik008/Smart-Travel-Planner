import asyncio
from database.db import AsyncSessionLocal
from sqlalchemy import text

async def main():
    async with AsyncSessionLocal() as s:
        # Set is_admin = True ONLY for pranavkaushikyr@gmail.com
        await s.execute(text("UPDATE users SET is_admin = (email = 'pranavkaushikyr@gmail.com');"))
        await s.commit()
        
        # Verify current admin accounts
        r = await s.execute(text("SELECT id, username, email, is_admin FROM users;"))
        users = r.fetchall()
        print("\n--- UPDATED USER ADMIN STATUS ---")
        for u in users:
            status = "✅ ADMIN" if u[3] else "👤 NORMAL USER"
            print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]} -> {status}")

asyncio.run(main())
