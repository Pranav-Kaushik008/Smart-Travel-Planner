import asyncio
import sys

async def run():
    try:
        from services.recommendation_service import recommendation_engine
        
        # Test ML prediction
        dest = recommendation_engine.predict(
            budget=20000, days=4, travel_type="Historical", season="All"
        )
        print(f"ML PREDICTION OK: {dest}")
        
        # Test weather service
        from services.weather_service import get_weather
        weather = await get_weather(dest)
        print(f"WEATHER OK: {weather}")
        
        # Test budget service
        from services.budget_service import estimate_budget
        budget = estimate_budget(
            destination=dest, days=4, travel_type="Historical", total_budget=20000
        )
        print(f"BUDGET OK: {budget}")
        
        # Test hotel service
        from database.db import AsyncSessionLocal
        from services.hotel_service import get_hotels_by_destination
        async with AsyncSessionLocal() as session:
            hotels = await get_hotels_by_destination(dest, session)
            print(f"HOTELS OK: {hotels}")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        sys.exit(1)

asyncio.run(run())
