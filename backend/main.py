import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base
from config import settings
from sqlalchemy import text
from database.seed import seed_hotels
from routes import auth, planner, weather, trips, hotels, dashboard, profile
from services.recommendation_service import recommendation_engine


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print("Starting up application...")

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
         # Ensure user profile columns exist in the database (for PostgreSQL if table already existed)
        if engine.dialect.name == "postgresql":
            try:
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(30);"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(100);"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS dob VARCHAR(20);"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSON;"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_destinations JSON;"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS languages JSON;"))
                print("Ensured user profile columns exist (Postgres).")
            except Exception as e:
                print("Warning: failed to ensure additional user columns:", e)
            try:
                await conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_hotel FLOAT;"))
                await conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_food FLOAT;"))
                await conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_travel FLOAT;"))
                await conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_activities FLOAT;"))
                await conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_misc FLOAT;"))
                await conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS actual_total FLOAT;"))
                print("Ensured trip expense columns exist (Postgres).")
            except Exception as e:
                print("Warning: failed to ensure trip expense columns:", e)
    print("Database tables verified/created.")

    # Seed hotels
    await seed_hotels()

    # Reload recommendation model to ensure it's active
    recommendation_engine.load_model()

    yield
    # Shutdown actions
    print("Shutting down application...")
    await engine.dispose()


app = FastAPI(
    title="AI Smart Travel Planner API",
    description="Backend API for personalized travel recommendation, itinerary generation, weather updates and booking assistance.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite local development port
    "http://localhost:3000",  # Docker frontend port
    "http://localhost:80",
    "*",  # Allow all for development flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(planner.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(hotels.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(profile.router, prefix="/api")


@app.get("/")
def home():
    return {
        "message": "AI Smart Travel Planner API is running",
        "docs": "/docs",
        "status": "healthy",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ml_model": "loaded" if recommendation_engine.model_loaded else "fallback",
    }
