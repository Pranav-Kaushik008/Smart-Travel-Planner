import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import engine, AsyncSessionLocal, Base
from models.hotel import Hotel

HOTELS_DATA = [
    # Goa
    {"name": "Taj Exotica Resort & Spa", "destination": "Goa", "rating": 4.8, "price_per_night": 15000.0, "amenities": "Pool, Beachfront, Spa, Fine Dining, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"},
    {"name": "Calangute Beach Stay", "destination": "Goa", "rating": 4.1, "price_per_night": 3200.0, "amenities": "Pool, Close to Beach, Free Wi-Fi, Air Conditioning", "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"},
    {"name": "Zostel Hostel Goa", "destination": "Goa", "rating": 4.3, "price_per_night": 950.0, "amenities": "Shared Lounge, Free Wi-Fi, Cafe, Locker", "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"},
    # Manali
    {"name": "Span Resort & Spa", "destination": "Manali", "rating": 4.7, "price_per_night": 9800.0, "amenities": "Mountain View, Riverfront, Spa, Restaurant, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"},
    {"name": "Snow Valley Resorts", "destination": "Manali", "rating": 4.2, "price_per_night": 4500.0, "amenities": "Scenic Balcony, Wi-Fi, Restaurant, Activity Room", "image_url": "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=600"},
    {"name": "Old Manali Cozy Cottage", "destination": "Manali", "rating": 4.0, "price_per_night": 1800.0, "amenities": "Garden, Fireplace, Mountain View, Kitchen", "image_url": "https://images.unsplash.com/photo-1611891487122-2075b962442f?w=600"},
    # Ladakh
    {"name": "The Grand Dragon Ladakh", "destination": "Ladakh", "rating": 4.9, "price_per_night": 11500.0, "amenities": "Mountain View, Central Heating, Restaurant, Wi-Fi, Gym", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"},
    {"name": "Hotel Singge Palace", "destination": "Ladakh", "rating": 4.3, "price_per_night": 5200.0, "amenities": "Wi-Fi, Garden, Restaurant, Room Service", "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600"},
    {"name": "Leh Backpackers Camp", "destination": "Ladakh", "rating": 3.9, "price_per_night": 1200.0, "amenities": "Campfire, Tent Stay, Free Wi-Fi, Guide Service", "image_url": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600"},
    # Kerala
    {"name": "Kumarakom Lake Resort", "destination": "Kerala", "rating": 4.8, "price_per_night": 16500.0, "amenities": "Infinity Pool, Backwater View, Spa, Houseboat Cruise", "image_url": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600"},
    {"name": "Munnar Tea Hills Resort", "destination": "Kerala", "rating": 4.4, "price_per_night": 4800.0, "amenities": "Tea Garden View, Restaurant, Wi-Fi, Bicycle Rental", "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600"},
    {"name": "Alleppey Houseboats Premium", "destination": "Kerala", "rating": 4.6, "price_per_night": 8000.0, "amenities": "All Meals Included, Cruise, Air Conditioning, Sun Deck", "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600"},
    # Andaman
    {"name": "Barefoot at Havelock", "destination": "Andaman", "rating": 4.7, "price_per_night": 14000.0, "amenities": "Private Beach, Eco-Villas, Scuba Diving, Restaurant", "image_url": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600"},
    {"name": "Havelock Island Beach Resort", "destination": "Andaman", "rating": 4.2, "price_per_night": 6500.0, "amenities": "Pool, Beachfront, Bar, Free Wi-Fi, Tour Desk", "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"},
    {"name": "Port Blair Homestay", "destination": "Andaman", "rating": 4.0, "price_per_night": 2000.0, "amenities": "Free Wi-Fi, Kitchenette, Sea View Terrace", "image_url": "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600"},
    # Jaipur
    {"name": "Rambagh Palace (Taj)", "destination": "Jaipur", "rating": 4.9, "price_per_night": 22000.0, "amenities": "Heritage Property, Royal Gardens, Luxury Spa, Indoor Pool", "image_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600"},
    {"name": "Hotel Kalyan", "destination": "Jaipur", "rating": 4.0, "price_per_night": 2300.0, "amenities": "Rooftop Restaurant, City View, Wi-Fi, Airport Pick-up", "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"},
    # Varanasi
    {"name": "Brijrama Palace (Ganga Ghats)", "destination": "Varanasi", "rating": 4.8, "price_per_night": 13500.0, "amenities": "Heritage hotel, River view, Yoga classes, Fine Dining", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"},
    {"name": "Ghat Hostel Varanasi", "destination": "Varanasi", "rating": 4.2, "price_per_night": 850.0, "amenities": "Rooftop Cafe, Ganga view, Free Wi-Fi, Walking tours", "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"},
    # Rishikesh
    {"name": "Aloha On The Ganges", "destination": "Rishikesh", "rating": 4.6, "price_per_night": 8500.0, "amenities": "Infinity Pool, Riverfront, Spa, Yoga classes, Restaurant", "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"},
    {"name": "Zostel Rishikesh", "destination": "Rishikesh", "rating": 4.4, "price_per_night": 900.0, "amenities": "Social spaces, Free Wi-Fi, Locker, Rafting bookings", "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600"},
    # Coorg
    {"name": "The Tamara Coorg", "destination": "Coorg", "rating": 4.8, "price_per_night": 16000.0, "amenities": "Infinity Pool, Forest View, Spa, Plantation Walk", "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"},
    {"name": "Coorg Cliff Resort", "destination": "Coorg", "rating": 4.1, "price_per_night": 4600.0, "amenities": "Mountain Edge Pool, Coffee Plantation View, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600"},
    # Ooty
    {"name": "Savoy - IHCL SeleQtions", "destination": "Ooty", "rating": 4.7, "price_per_night": 11000.0, "amenities": "Colonial Architecture, Fireplace, Garden, Spa, Restaurant", "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"},
    {"name": "Ooty Meadows Inn", "destination": "Ooty", "rating": 3.9, "price_per_night": 2200.0, "amenities": "Wi-Fi, Restaurant, Near lake, Hot water", "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"},
    # Tirupati
{"name": "Marasa Sarovar Premiere", "destination": "Tirupati", "rating": 4.7, "price_per_night": 8500.0, "amenities": "Temple View, Spa, Restaurant, Wi-Fi, Pool", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"},
{"name": "Fortune Select Grand Ridge", "destination": "Tirupati", "rating": 4.4, "price_per_night": 4500.0, "amenities": "Restaurant, Gym, Wi-Fi, Parking", "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"},
{"name": "Bhimas Deluxe Hotel", "destination": "Tirupati", "rating": 4.0, "price_per_night": 1800.0, "amenities": "Restaurant, Free Wi-Fi, Family Rooms", "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600"},

# Haridwar
{"name": "Ganga Lahari", "destination": "Haridwar", "rating": 4.8, "price_per_night": 7200.0, "amenities": "Ganga View, Yoga, Ayurvedic Spa, Restaurant", "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"},
{"name": "Haveli Hari Ganga", "destination": "Haridwar", "rating": 4.6, "price_per_night": 6000.0, "amenities": "Heritage Stay, River View, Restaurant, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"},
{"name": "Hotel Alpana", "destination": "Haridwar", "rating": 4.0, "price_per_night": 1700.0, "amenities": "Family Rooms, Wi-Fi, Restaurant", "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"},

# Ayodhya
{"name": "The Ramayana Hotel", "destination": "Ayodhya", "rating": 4.5, "price_per_night": 5000.0, "amenities": "Temple Access, Restaurant, Wi-Fi, Parking", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"},
{"name": "Ayodhya Residency", "destination": "Ayodhya", "rating": 4.2, "price_per_night": 2800.0, "amenities": "Free Breakfast, Wi-Fi, Family Rooms", "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"},
{"name": "Shri Ram Guest House", "destination": "Ayodhya", "rating": 3.9, "price_per_night": 1200.0, "amenities": "Budget Stay, Temple Shuttle, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"},

# Shirdi
{"name": "Sun-n-Sand Shirdi", "destination": "Shirdi", "rating": 4.6, "price_per_night": 6500.0, "amenities": "Pool, Spa, Temple Shuttle, Restaurant", "image_url": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600"},
{"name": "St Laurn The Spiritual Resort", "destination": "Shirdi", "rating": 4.4, "price_per_night": 4200.0, "amenities": "Pool, Meditation Hall, Wi-Fi, Restaurant", "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600"},
{"name": "Sai Leela Hotel", "destination": "Shirdi", "rating": 4.0, "price_per_night": 1800.0, "amenities": "Temple Shuttle, Wi-Fi, Family Rooms", "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"},

# Rameswaram
{"name": "Hyatt Place Rameswaram", "destination": "Rameswaram", "rating": 4.7, "price_per_night": 7500.0, "amenities": "Pool, Spa, Temple Access, Restaurant", "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"},
{"name": "Daiwik Hotels", "destination": "Rameswaram", "rating": 4.3, "price_per_night": 3800.0, "amenities": "Temple Shuttle, Wi-Fi, Restaurant", "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"},
{"name": "Hotel Ashoka", "destination": "Rameswaram", "rating": 3.9, "price_per_night": 1500.0, "amenities": "Budget Rooms, Wi-Fi, Parking", "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600"},

# Dwarka
{"name": "Lemon Tree Premier", "destination": "Dwarka", "rating": 4.6, "price_per_night": 6200.0, "amenities": "Pool, Gym, Temple Access, Restaurant", "image_url": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600"},
{"name": "The Fern Sattva Resort", "destination": "Dwarka", "rating": 4.4, "price_per_night": 4500.0, "amenities": "Pool, Spa, Wi-Fi, Garden", "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600"},
{"name": "Hotel Guruprerna", "destination": "Dwarka", "rating": 4.0, "price_per_night": 1800.0, "amenities": "Temple Shuttle, Restaurant, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"},

# Ujjain
{"name": "Anjushree Resort", "destination": "Ujjain", "rating": 4.5, "price_per_night": 5500.0, "amenities": "Pool, Spa, Restaurant, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"},
{"name": "Hotel Imperial Grand", "destination": "Ujjain", "rating": 4.1, "price_per_night": 2800.0, "amenities": "Wi-Fi, Restaurant, Parking", "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"},
{"name": "Mahakal Guest House", "destination": "Ujjain", "rating": 3.8, "price_per_night": 1000.0, "amenities": "Temple Access, Wi-Fi, Budget Rooms", "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"},

# Kedarnath
{"name": "Kedar River Retreat", "destination": "Kedarnath", "rating": 4.3, "price_per_night": 3500.0, "amenities": "Mountain View, Trek Assistance, Restaurant", "image_url": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600"},
{"name": "GMVN Kedarnath Camp", "destination": "Kedarnath", "rating": 4.0, "price_per_night": 2200.0, "amenities": "Dormitory, Hot Water, Trek Support", "image_url": "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=600"},

# Badrinath
{"name": "Sarovar Portico Badrinath", "destination": "Badrinath", "rating": 4.4, "price_per_night": 4800.0, "amenities": "Mountain View, Restaurant, Wi-Fi", "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"},
{"name": "Snow Crest Hotel", "destination": "Badrinath", "rating": 4.1, "price_per_night": 2600.0, "amenities": "Temple Access, Parking, Restaurant", "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600"}

]

async def seed_hotels():
    # Make sure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as session:
        # Check if hotels already exist
        query = select(Hotel).limit(1)
        result = await session.execute(query)
        if result.scalars().first():
            print("Database already has hotels. Skipping seeding.")
            return
            
        print("Seeding hotel data...")
        for data in HOTELS_DATA:
            hotel = Hotel(**data)
            session.add(hotel)
        await session.commit()
        print("Hotels seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_hotels())
