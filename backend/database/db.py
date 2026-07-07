from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from config import settings

DATABASE_URL = settings.DATABASE_URL

# Auto-detect database type and configure engine accordingly
is_sqlite = DATABASE_URL.startswith("sqlite")

if not is_sqlite:
    # Ensure PostgreSQL uses asyncpg driver
    if "postgresql://" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    if not DATABASE_URL.startswith("postgresql+asyncpg://"):
        DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/travelplanner"

# Create engine with appropriate settings per database type
if is_sqlite:
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_async_engine(
        DATABASE_URL,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
        echo=False
    )

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
