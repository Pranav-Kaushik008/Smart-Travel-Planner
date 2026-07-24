from google import genai
from config import settings
import json

def get_mock_itinerary(destination: str, days: int, travel_type: str) -> str:
    # Heuristic mock generator for local dev when no Gemini key is provided
    itinerary = f"### AI Travel Itinerary: {days} Days in {destination} ({travel_type})\n\n"
    
    attractions = {
        "Goa": [
            "Baga Beach & Water Sports", "Fort Aguada & Lighthouse", "Basilica of Bom Jesus", 
            "Anjuna Flea Market & Sunset", "Dudhsagar Waterfalls Trek", "Panaji Latin Quarter (Fontainhas)"
        ],
        "Manali": [
            "Hadimba Temple & Cedar Forest", "Solang Valley Adventure Sports", "Rohtang Pass Snow View", 
            "Jogini Waterfalls Trek", "Old Manali Cafes & Music", "Vashisht Hot Springs"
        ],
        "Ladakh": [
            "Pangong Tso Lake", "Nubra Valley & Diskit Monastery", "Khardung La Pass (5,359m)", 
            "Shanti Stupa & Sunset", "Magnetic Hill & Indus Sangam", "Leh Palace & Local Bazaar"
        ],
        "Kerala": [
            "Munnar Tea Gardens", "Alleppey Houseboat Cruise", "Wayanad Forest Safari", 
            "Fort Kochi & Chinese Nets", "Varkala Cliff Beach", "Periyar Wildlife Sanctuary"
        ],
        "Andaman": [
            "Radhanagar Beach Sunset", "Cellular Jail Light & Sound Show", "Havelock Island Scuba Diving", 
            "Elephant Beach Snorkeling", "Ross Island Ruins", "Chidiya Tapu Birdwatching"
        ],
        "Jaipur": [
            "Amber Fort & Sheesh Mahal", "Hawa Mahal (Palace of Winds)", "City Palace & Museum", 
            "Jantar Mantar Royal Observatory", "Nahargarh Fort Sunset View", "Chokhi Dhani Cultural Village"
        ],
        "Varanasi": [
            "Kashi Vishwanath Temple", "Dashashwamedh Ghat Evening Aarti", "Sarnath Buddhist Stupa", 
            "Assi Ghat Sunrise Yoga & Boat Ride", "Manikarnika Ghat Heritage Walk", "Banarasi Weaving Village"
        ],
        "Rishikesh": [
            "Laxman Jhula & Ram Jhula", "White Water Rafting at Shivpuri", "Triveni Ghat Evening Aarti", 
            "Beatles Ashram (Chaurasi Kutia)", "Neer Garh Waterfall Trek", "Parmarth Niketan Yoga Session"
        ],
        "Coorg": [
            "Abbey Waterfalls", "Raja's Seat Sunset Viewpoint", "Dubare Elephant Camp", 
            "Talakaveri Source of Cauvery", "Namdroling Golden Temple (Bylakuppe)", "Mandalpatti 4x4 Jeep Safari"
        ],
        "Ooty": [
            "Ooty Government Botanical Gardens", "Doddabetta Peak Viewpoint", "Nilgiri Mountain Toy Train", 
            "Ooty Lake Boating", "Rose Garden & Tea Factory", "Pykara Lake & Waterfalls"
        ],
        "Tirupati": [
            "Sri Venkateswara Swamy Temple (Tirumala)", "Padmavathi Ammavari Temple", "Akasa Ganga & Papavanasam", 
            "Silathoranam Natural Arch", "Kapila Theertham Waterfalls", "Japali Hanuman Temple Trek"
        ],
        "Haridwar": [
            "Har Ki Pauri Ganga Aarti", "Mansa Devi Temple Cable Car", "Chandi Devi Temple", 
            "Bharat Mata Mandir", "Daksha Mahadev Temple", "Sapt Rishi Ashram"
        ],
        "Ayodhya": [
            "Ram Janmabhoomi Mandir", "Hanuman Garhi Temple", "Kanak Bhawan Palace", 
            "Saryu River Aarti at Ram Ki Paidi", "Nageshwarnath Temple", "Dashrath Mahal"
        ],
        "Ujjain": [
            "Mahakaleshwar Jyotirlinga (Bhasma Aarti)", "Kal Bhairav Temple", "Harsiddhi Mata Temple", 
            "Ram Ghat Shipra Aarti", "Mangalnath Temple", "Sandipani Ashram"
        ],
        "Puri": [
            "Jagannath Temple", "Puri Golden Beach", "Gundicha Temple", 
            "Konark Sun Temple", "Chilika Lake Dolphin Safari", "Raghurajpur Heritage Craft Village"
        ],
        "Rameswaram": [
            "Ramanathaswamy Temple (22 Holy Well Baths)", "Agni Theertham Beach", "Dhanushkodi Ghost Town", 
            "Pamban Sea Bridge Viewpoint", "Kothandaramaswamy Temple", "Dr. APJ Abdul Kalam Memorial"
        ],
        "Kedarnath": [
            "Kedarnath Jyotirlinga Temple", "Bhairavnath Temple Hilltop View", "Vasuki Tal Glacial Lake Trek", 
            "Shankaracharya Samadhi", "Gandhi Sarovar Walk", "Gaurikund Hot Springs"
        ],
        "Badrinath": [
            "Badrinath Temple", "Tapt Kund Hot Springs", "Mana Village (First Village of India)", 
            "Vyas Gufa & Ganesh Gufa", "Bheem Pul Natural Stone Bridge", "Vasudhara Falls Trek"
        ],
        "Amritsar": [
            "Golden Temple (Harmandir Sahib)", "Wagah Border Flag Ceremony", "Jallianwala Bagh Memorial", 
            "Akal Takht & Sarovar Walk", "Durgiana Temple", "Partition Museum"
        ],
        "Madurai": [
            "Meenakshi Amman Temple Complex", "Thirumalai Nayakkar Palace", "Alagar Kovil Temple", 
            "Gandhi Memorial Museum", "Koodal Azhagar Temple", "Vandiyur Teppakulam Lake"
        ],
        "Dwarka": [
            "Dwarkadhish Temple", "Bet Dwarka Island Boat Trip", "Nageshwar Jyotirlinga", 
            "Rukmini Devi Temple", "Gomti Ghat Sunset", "Sudama Setu Suspension Bridge"
        ],
        "Mangaluru": [
            "Panambur Beach Sunset & Jet Skiing", "Tannirbhavi Beach & Pine Forest", "Kadri Manjunath Temple", 
            "St. Aloysius Chapel Frescoes", "Sammilan Shetty's Butterfly Park", "Pilikula Biological Park"
        ],
        "Munnar": [
            "Tea Gardens & Tata Tea Museum", "Eravikulam National Park (Nilgiri Tahr)", "Mattupetty Dam Boating", 
            "Anamudi Peak Viewpoint", "Kundala Lake Speedboating", "Attukad Waterfalls Trek"
        ],
        "Kolad": [
            "Kundalika River White Water Rafting", "Tamhini Ghat Waterfall Views", "Bhira Dam Camping Ground", 
            "Devkund Waterfall Trek", "Ghosala Fort", "Kuda Buddhist Caves"
        ],
        "Nagarhole": [
            "Kabini River Boat Safari", "Nagarhole Tiger Reserve Jeep Safari", "Iruppu Waterfalls Trek", 
            "Kuruva Dweep Bamboo Rafting", "Brahmagiri Wildlife Sanctuary", "Balthora Jungle Trail"
        ],
        "Udaipur": [
            "City Palace & Museum", "Lake Pichola Sunset Boat Cruise", "Jag Mandir Island Palace", 
            "Saheliyon Ki Bari Gardens", "Sajjangarh Monsoon Palace", "Bagore Ki Haveli Cultural Show"
        ],
        "Darjeeling": [
            "Tiger Hill Sunrise over Kanchenjunga", "Darjeeling Himalayan Toy Train", "Batasia Loop & War Memorial", 
            "Happy Valley Tea Estate", "Padmaja Naidu Himalayan Zoo", "Peace Pagoda & Japanese Temple"
        ],
        "Shimla": [
            "The Ridge & Mall Road Promenade", "Jakhoo Temple & Giant Hanuman Statue", "Kufri Snow & Nature Park", 
            "Christ Church Shimla", "Viceregal Lodge (Indian Institute of Advanced Study)", "Annandale Ground & Museum"
        ],
        "Hampi": [
            "Virupaksha Temple", "Vittala Temple Stone Chariot & Musical Pillars", "Matanga Hill Sunrise Point", 
            "Lotus Mahal & Elephant Stables", "Anegundi Village & Tungabhadra River Coracle Ride", "Coracle Ride at Sanapur Lake"
        ],
        "Jim Corbett": [
            "Dhikala Zone Jungle Safari", "Garjia Devi Temple in Kosi River", "Corbett Waterfall & Nature Walk", 
            "Bijrani Safari Zone", "Corbett Museum at Kaladhungi", "Sitabani Buffer Zone Trail"
        ],
        "Kaziranga": [
            "Kaziranga Elephant Safari (Central Range)", "Kohora & Bagori Jeep Safari", "Orchid & Biodiversity Park", 
            "Kakochang Waterfall Trek", "Brahmaputra River Boat Cruise", "Tea Garden Estate Walk"
        ]
    }
    
    dest_attractions = attractions.get(
        destination, 
        [f"{destination} Heritage Walk", f"{destination} Scenic Viewpoint", f"{destination} Cultural Market", f"{destination} Historic Temple", f"{destination} Nature Trail", f"{destination} Local Crafts Center"]
    )

    dining_suggestions = {
        "Goa": ["Britto's Beach Shack (Seafood Thali)", "Fisherman's Wharf (Goan Fish Curry)", "Vinayak Family Restaurant (Authentic Xacuti)"],
        "Manali": ["Cafe 1947 (Riverside Italian)", "Johnson's Cafe (Trout Speciality)", "Chopsticks (Tibetan Thukpa)"],
        "Jaipur": ["Chokhi Dhani (Traditional Rajasthani Thali)", "Lassiwala (Classic Kulhad Lassi)", "1135 AD at Amber Fort (Royal Dining)"],
        "Varanasi": ["Kashi Chat Bhandar (Tamatar Chat & Tikki)", "Blue Lassi Shop (Famous Fruit Lassi)", "Dolphin Restaurant (Ghatside View)"],
        "Kerala": ["Kuttanad Duck Curry at Local Shack", "Fort House Restaurant (Seafood Karimeen)", "Saravana Bhavan (South Indian Feast)"],
        "Ladakh": ["Tibetan Kitchen (Momos & Thukpa)", "Bon Appetit (Leh Valley View)", "Gesmo Restaurant (Bakery & Yak Cheese)"],
        "Coorg": ["Raintree Restaurant (Pandi Curry & Akki Roti)", "Coorg Cuisine (Kodava Delicacies)", "Fallsview Restaurant"],
        "Ooty": ["Nahar's Sidewalk Cafe (Wood-fired Pizza)", "Place To Bee (Organic Honey Crepes)", "Shinkows (Chinese Legacy)"],
        "Mangaluru": ["Giri Manja's (Seafood Fry & Curry)", "Ideal Ice Cream Parlour (Gadbad Special)", "Shetty Lunch Home (Anjal Tawa Fry)"],
        "Munnar": ["Saravana Bhavan (Traditional Banana Leaf Meal)", "Rapsy Restaurant (Kerala Parotta & Beef/Chicken)", "Tea County Restaurant"],
        "Hampi": ["Mango Tree Restaurant (Riverside Thali)", "Zorba the Buddha Cafe (Continental & Israeli)", "Laughing Buddha Cafe"],
        "Udaipur": ["Ambrai (Lakeside City Palace View)", "Udai Kothi Rooftop", "Natraj Dining Hall (Rajasthani Unlimited Thali)"]
    }
    
    city_dining = dining_suggestions.get(destination, [
        f"Authentic {destination} Thali House", 
        f"Top-rated {destination} Bistro & Grill", 
        f"Popular Local Street Food Hub in {destination}"
    ])
    
    for day in range(1, days + 1):
        itinerary += f"#### Day {day}: Highlights of {destination}\n"
        attr1 = dest_attractions[(day * 2 - 2) % len(dest_attractions)]
        attr2 = dest_attractions[(day * 2 - 1) % len(dest_attractions)]
        dine = city_dining[(day - 1) % len(city_dining)]
        
        itinerary += f"- **Morning**: Visit {attr1} for early morning exploration, photographs, and sightseeing.\n"
        itinerary += f"- **Afternoon**: Enjoy lunch at {dine} and continue to {attr2}.\n"
        itinerary += f"- **Evening**: Stroll through local markets, enjoy sunset viewpoints, and experience the evening vibe of {destination}.\n"
        itinerary += f"- **Dining Suggestion**: Taste regional specialties at {dine}.\n\n"
        
    itinerary += "#### 💡 Essential Travel Tips\n"
    itinerary += f"1. **Local Transport**: Auto-rickshaws, rented two-wheelers, or private cabs are recommended for easy commuting in {destination}.\n"
    itinerary += "2. **Best Time for Sights**: Start your morning visits early around 8:00 AM to beat crowds and summer heat.\n"
    itinerary += "3. **Cultural Respect**: Dress modestly when visiting religious temples, shrines, and sacred heritage monuments.\n"
    
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


async def generate_group_itinerary(
    destination: str,
    days: int,
    travel_type: str,
    total_budget: float,
    total_travelers: int,
    adults: int,
    children: int,
    seniors: int,
    relationship: str,
    special_requirements: list = None
) -> str:
    """
    Generates a group-oriented day-wise itinerary with rest breaks, senior/child friendly pacing, and group dining.
    """
    reqs_str = ", ".join(special_requirements) if special_requirements else "None"
    
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        base_itinerary = get_mock_itinerary(destination, days, travel_type)
        group_header = f"### 👥 Group Travel Itinerary: {total_travelers} Travelers ({adults} Adults, {children} Children, {seniors} Seniors)\n"
        group_header += f"**Group Type**: {relationship} | **Diet / Accessibility**: {reqs_str}\n\n"
        group_notes = "#### 👨‍👩‍👧‍👦 Group Comfort & Rest Breaks\n"
        group_notes += "1. **Scheduled Rest Break**: Afternoon 2:00 PM – 3:30 PM reserved for relaxation, tea, and senior/child rest.\n"
        group_notes += "2. **Group Dining**: Pre-booked group thali tables recommended at major stops.\n\n"
        return group_header + group_notes + base_itinerary

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"""
        Create a detailed, well-paced day-wise GROUP travel itinerary for {destination}.
        
        Group Trip Specifications:
        - Destination: {destination}
        - Duration: {days} Days
        - Travel Style: {travel_type}
        - Total Group Budget: INR {total_budget}
        - Group Composition: {total_travelers} Total Travelers ({adults} Adults, {children} Children, {seniors} Senior Citizens)
        - Group Type: {relationship}
        - Special Preferences & Needs: {reqs_str}
        
        Guidelines:
        1. Avoid overly hectic schedules. Include 1.5-hour afternoon rest breaks for seniors & children.
        2. Recommend family and group-friendly restaurants with ample seating and dietary options.
        3. Highlight attractions with wheelchair / easy walking access if senior citizens or infants are traveling.
        4. Format in clean Markdown with Morning, Afternoon, Evening, Group Dining, and Essential Group Tips.
        """
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error in Gemini group itinerary generation: {e}")
        return get_mock_itinerary(destination, days, travel_type)

