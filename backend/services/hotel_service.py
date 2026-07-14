from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.hotel import Hotel
from typing import List

async def get_hotels_by_destination(destination: str, db: AsyncSession) -> List[Hotel]:
    query = select(Hotel).where(Hotel.destination == destination)
    result = await db.execute(query)
    hotels = result.scalars().all()
    
    # If no hotels exist, we can return a default list for the destination
    if not hotels:
        # Generate some mock hotels and return them, wait, let's just make it a clean default list
        # based on destination
        default_hotels = [
            Hotel(
                id=1,
                name=f"{destination} Resort & Spa",
                destination=destination,
                rating=4.5,
                price_per_night=3500.0,
                amenities="Pool, Wi-Fi, Beach Access, Restaurant",
                image_url="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
            ),
            Hotel(
                id=2,
                name=f"Vista Inn {destination}",
                destination=destination,
                rating=4.0,
                price_per_night=2200.0,
                amenities="Breakfast, Wi-Fi, Parking",
                image_url="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500"
            ),
            Hotel(
                id=3,
                name=f"Backpackers Stay {destination}",
                destination=destination,
                rating=3.8,
                price_per_night=900.0,
                amenities="Free Wi-Fi, Shared Kitchen, Locker",
                image_url="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500"
            )
        ]
        return default_hotels
        
    return list(hotels)
