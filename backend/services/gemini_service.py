from google import genai
from config import settings
import json

def get_mock_itinerary(destination: str, days: int, travel_type: str) -> str:
    # Heuristic mock generator for local dev when no Gemini key is provided
    itinerary = f"### AI Travel Itinerary: {days} Days in {destination} ({travel_type})\n\n"
    itinerary += "*(Note: This is a simulated itinerary. Configure a valid GEMINI_API_KEY for custom AI planning.)*\n\n"
    
    attractions = {
        "Goa": ["Calangute Beach", "Fort Aguada", "Basilica of Bom Jesus", "Anjuna Flea Market", "Dudhsagar Falls", "Panaji Latin Quarter"],
        "Manali": ["Hadimba Temple", "Solang Valley", "Rohtang Pass", "Jogini Waterfalls", "Old Manali Cafes", "Mall Road"],
        "Ladakh": ["Pangong Lake", "Nubra Valley", "Khardung La", "Shanti Stupa", "Magnetic Hill", "Leh Palace"],
        "Kerala": ["Munnar Tea Gardens", "Alleppey Houseboat Cruise", "Wayanad Forests", "Kochi Fort", "Varkala Beach", "Thekkady Wildlife Sanctuary"],
        "Andaman": ["Radhanagar Beach", "Cellular Jail", "Havelock Island Snorkeling", "Baratang Caves", "Ross Island", "Chidiya Tapu"],
        "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Chokhi Dhani", "Nahargarh Fort"],
        "Varanasi": ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath", "Assi Ghat", "Ganga Aarti", "Banarasi Saree Market"],
        "Rishikesh": ["Laxman Jhula", "Triveni Ghat", "Parmarth Niketan", "Neer Garh Waterfall", "Beatles Ashram", "Shivpuri Rafting"],
        "Coorg": ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Tala Kaveri", "Golden Temple (Bylakuppe)", "Mandalpatti Peak"],
        "Ooty": ["Ooty Botanical Gardens", "Doddabetta Peak", "Ooty Lake", "Rose Garden", "Toy Train Ride", "Pykara Waterfalls"],
        "Tirupati": [
        "Sri Venkateswara Temple",
        "Akasa Ganga",
        "Silathoranam",
        "Kapila Theertham",
        "Sri Padmavathi Temple",
        "Japali Hanuman Temple"
        ],

    "Haridwar": [
        "Har Ki Pauri",
        "Mansa Devi Temple",
        "Chandi Devi Temple",
        "Bharat Mata Mandir",
        "Daksha Mahadev Temple",
        "Evening Ganga Aarti"
    ],

    "Ayodhya": [
        "Ram Mandir",
        "Hanuman Garhi",
        "Kanak Bhawan",
        "Ram Ki Paidi",
        "Saryu River Ghat",
        "Nageshwarnath Temple"
    ],

    "Ujjain": [
        "Mahakaleshwar Jyotirlinga",
        "Kal Bhairav Temple",
        "Harsiddhi Temple",
        "Ram Ghat",
        "Mangalnath Temple",
        "Sandipani Ashram"
    ],

    "Puri": [
        "Jagannath Temple",
        "Golden Beach",
        "Gundicha Temple",
        "Konark Sun Temple",
        "Chilika Lake",
        "Narendra Tank"
    ],

    "Rameswaram": [
        "Ramanathaswamy Temple",
        "Agni Theertham",
        "Dhanushkodi",
        "Pamban Bridge",
        "Kothandaramaswamy Temple",
        "Five Faced Hanuman Temple"
    ],

    "Kedarnath": [
        "Kedarnath Temple",
        "Bhairavnath Temple",
        "Vasuki Tal",
        "Adi Shankaracharya Samadhi",
        "Gandhi Sarovar",
        "Chorabari Tal"
    ],

    "Badrinath": [
        "Badrinath Temple",
        "Tapt Kund",
        "Mana Village",
        "Vyas Gufa",
        "Bheem Pul",
        "Charan Paduka"
    ],

    "Amritsar": [
        "Golden Temple",
        "Akal Takht",
        "Jallianwala Bagh",
        "Wagah Border",
        "Durgiana Temple",
        "Partition Museum"
    ],

    "Madurai": [
        "Meenakshi Amman Temple",
        "Thirumalai Nayakkar Palace",
        "Alagar Kovil",
        "Gandhi Memorial Museum",
        "Koodal Azhagar Temple",
        "Vandiyur Mariamman Teppakulam"
    ],

    "Dwarka": [
        "Dwarkadhish Temple",
        "Bet Dwarka",
        "Nageshwar Jyotirlinga",
        "Rukmini Temple",
        "Gomti Ghat",
        "Sudama Setu"
    ]
}

    
    dest_attractions = attractions.get(destination, ["Local Landmarks", "Cultural Markets", "Nature Viewpoints", "Scenic Parks", "Historical Buildings", "Popular Cafes"])
    
    for day in range(1, days + 1):
        itinerary += f"#### Day {day}: Exploring the Highlights\n"
        attr1 = dest_attractions[(day * 2 - 2) % len(dest_attractions)]
        attr2 = dest_attractions[(day * 2 - 1) % len(dest_attractions)]
        
        itinerary += f"- **Morning**: Visit {attr1} for scenic views and exploration.\n"
        itinerary += f"- **Afternoon**: Enjoy lunch at a highly-rated local restaurant and head to {attr2}.\n"
        itinerary += f"- **Evening**: Stroll around the local markets, buy souvenirs, and experience the local nightlife.\n"
        itinerary += f"- **Dining Suggestion**: Try authentic regional cuisine at a local bistro.\n\n"
        
    itinerary += "#### 💡 Essential Travel Tips\n"
    itinerary += "1. **Local Transport**: Renting a scooter or using local cabs is highly recommended.\n"
    itinerary += "2. **Best Time**: Plan outdoor activities early in the morning to beat the rush/heat.\n"
    itinerary += "3. **Cultural Etiquette**: Dress respectfully when visiting temples or sacred historical sites.\n"
    
    return itinerary

async def generate_itinerary(destination: str, days: int, travel_type: str, budget: float) -> str:
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        return get_mock_itinerary(destination, days, travel_type)
        
    try:
        # Using the new google-genai library client structure
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"""
        Create a detailed and professional day-wise travel itinerary for {destination}.
        Trip Details:
        - Duration: {days} Days
        - Travel Style: {travel_type}
        - Total Estimated Budget: INR {budget}
        
        Please format the output in clean Markdown. Include:
        - Daily activities (Morning, Afternoon, Evening)
        - Specific popular local attractions
        - Recommended local restaurants or dining suggestions
        - Recommended travel tips (clothing, safety, local transport)
        """
        
        # Async call is supported in python standard libraries or synchronously with client.models.generate_content
        # Let's run this standard model generation call
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error in Gemini itinerary generation: {e}")
        return get_mock_itinerary(destination, days, travel_type)
