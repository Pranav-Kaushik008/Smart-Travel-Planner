ATTRACTIONS_DATA = {
    "Goa": [
        {
            "name": "Baga Beach",
            "description": "One of Goa's most famous beaches, famous for water sports, nightlife, and beach shacks.",
            "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
            "category": "Beach"
        },
        {
            "name": "Dudhsagar Falls",
            "description": "A magnificent four-tiered waterfall on the Mandovi River, surrounded by deciduous forests.",
            "image_url": "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600",
            "category": "Nature"
        },
        {
            "name": "Basilica of Bom Jesus",
            "description": "UNESCO World Heritage Site holding the mortal remains of St. Francis Xavier, stunning Baroque architecture.",
            "image_url": "https://images.unsplash.com/photo-1579621970795-87faff3f900a?w=600",
            "category": "Historical"
        }
    ],
    "Manali": [
        {
            "name": "Solang Valley",
            "description": "A side valley at the top of the Kullu Valley, renowned for adventure sports like paragliding and skiing.",
            "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
            "category": "Adventure"
        },
        {
            "name": "Hadimba Temple",
            "description": "An ancient wooden temple surrounded by dense cedar forests, dedicated to Hidimba Devi.",
            "image_url": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
            "category": "Temple"
        },
        {
            "name": "Rohtang Pass",
            "description": "High mountain pass offering spectacular panoramic views of the Himalayas and year-round snow.",
            "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
            "category": "Nature"
        }
    ],
    "Kedarnath": [
        {
            "name": "Kedarnath Temple",
            "description": "One of the most sacred Hindu temples dedicated to Lord Shiva, set against majestic snow-capped peaks.",
            "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600",
            "category": "Temple"
        },
        {
            "name": "Bhairav Temple",
            "description": "Located close to the main temple, offering incredible aerial views of the entire Kedarnath valley.",
            "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
            "category": "Temple"
        },
        {
            "name": "Vasuki Tal",
            "description": "A high-altitude glacial lake offering views of Chaukhamba peaks, perfect for a challenging trek.",
            "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
            "category": "Adventure"
        }
    ],
    "Ayodhya": [
        {
            "name": "Ram Janmabhoomi Temple",
            "description": "The monumental Hindu temple complex built at the birthplace of Lord Rama, showing exquisite architecture.",
            "image_url": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
            "category": "Temple"
        },
        {
            "name": "Kanak Bhawan",
            "description": "A beautiful palace-style temple dedicated to Lord Rama and Goddess Sita, famous for its gorgeous interiors.",
            "image_url": "https://images.unsplash.com/photo-1579621970795-87faff3f900a?w=600",
            "category": "Temple"
        },
        {
            "name": "Nageshwarnath Temple",
            "description": "An ancient temple dedicated to Lord Shiva, believed to have been established by Lord Rama's son, Kush.",
            "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
            "category": "Temple"
        }
    ],
    "Kochi": [
        {
            "name": "Kochi Backwaters",
            "description": "A beautiful chain of brackish lagoons and lakes lying parallel to the Arabian Sea coast.",
            "image_url": "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600",
            "category": "Nature"
        },
        {
            "name": "Fort Kochi & Chinese Fishing Nets",
            "description": "Historic seaside area famous for giant elegant Chinese fishing nets and colonial architecture.",
            "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
            "category": "Historical"
        },
        {
            "name": "Cherai Beach",
            "description": "A picturesque beach perfect for swimming and sunbathing, often spotted with dolphins.",
            "image_url": "https://images.unsplash.com/photo-1579621970795-87faff3f900a?w=600",
            "category": "Beach"
        }
    ]
}

def get_attractions(destination: str) -> list:
    """Returns top local attractions for the specified destination."""
    # Find matching key or use Goa as a default fallback
    key = next((k for k in ATTRACTIONS_DATA.keys() if k.lower() in destination.lower()), "Goa")
    return ATTRACTIONS_DATA[key]
