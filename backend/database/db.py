from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from config import settings

DATABASE_URL = settings.DATABASE_URL

# Auto-detect database type and configure engine accordingly
is_sqlite = DATABASE_URL.startswith("sqlite")

from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

UNSUPPORTED_ASYNCPG_PARAMS = {
    "channel_binding", "sslmode", "gssencmode", "target_session_attrs",
    "krbsrvname", "service", "passfile", "sslrootcert", "sslcert", "sslkey"
}

if not is_sqlite:
    # Ensure PostgreSQL uses asyncpg driver (handles Render postgres:// or postgresql://)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

    # Clean query parameters incompatible with asyncpg
    parsed = urlparse(DATABASE_URL)
    if parsed.query:
        query_params = parse_qs(parsed.query)
        cleaned_params = {}
        for k, v in query_params.items():
            if k in UNSUPPORTED_ASYNCPG_PARAMS:
                if k == "sslmode" and "ssl" not in query_params:
                    cleaned_params["ssl"] = v
            else:
                cleaned_params[k] = v

        new_query = urlencode(cleaned_params, doseq=True)
        DATABASE_URL = urlunparse((
            parsed.scheme, parsed.netloc, parsed.path,
            parsed.params, new_query, parsed.fragment
        ))


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
