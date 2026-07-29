import asyncio
from services.gemini_service import generate_group_itinerary

async def test():
    print("Testing generate_group_itinerary...")
    res = await generate_group_itinerary(
        destination="Goa",
        days=3,
        travel_type="Beach",
        total_budget=40000,
        total_travelers=3,
        adults=2,
        children=1,
        seniors=0,
        relationship="Family",
        special_requirements=["Vegetarian"]
    )
    print("RESULT SNIPPET:\n", res[:300])

asyncio.run(test())
