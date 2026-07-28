import asyncio
from database.db import AsyncSessionLocal
from sqlalchemy import text

async def main():
    async with AsyncSessionLocal() as s:
        r = await s.execute(text("SELECT username, email, is_admin FROM users"))
        users = r.fetchall()
        for u in users:
            print(f"Username: {u[0]}, Email: {u[1]}, IsAdmin: {u[2]}")

asyncio.run(main())
