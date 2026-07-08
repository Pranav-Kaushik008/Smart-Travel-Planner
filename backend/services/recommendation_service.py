import os
import pickle
import numpy as np
from typing import Tuple

class RecommendationEngine:
    def __init__(self):
        self.model = None
        self.le_type = None
        self.le_season = None
        self.le_destination = None
        self.model_loaded = False
        self.load_model()
        
    def load_model(self):
        current_dir = os.path.dirname(os.path.dirname(__file__))
        model_path = os.path.join(current_dir, "models", "recommendation_model.pkl")
        
        # If it doesn't exist, search in other paths
        if not os.path.exists(model_path):
            model_path = os.path.join(os.getcwd(), "models", "recommendation_model.pkl")
            
        try:
            if os.path.exists(model_path):
                with open(model_path, "rb") as f:
                    loaded = pickle.load(f)
                    # Handle both versions of model structures (old: 4 items, new: 2 items / dict, etc.)
                    if isinstance(loaded, tuple) and len(loaded) == 4:
                        self.model, self.le_type, self.le_season, self.le_destination = loaded
                        self.model_loaded = True
                        print("ML recommendation model loaded successfully (4 encoders).")
                    elif isinstance(loaded, tuple) and len(loaded) == 2:
                        self.model, encoders = loaded
                        self.le_type = encoders.get("travel_type", encoders.get("type"))
                        self.le_season = encoders.get("season")
                        self.le_destination = encoders.get("destination")
                        self.model_loaded = True
                        print("ML recommendation model loaded successfully (2 item tuple).")
            else:
                print(f"ML Model file not found at: {model_path}. Fallback engine will be used.")
        except Exception as e:
            print(f"Error loading recommendation model: {e}. Fallback engine will be used.")
            
    def predict(self, budget: float, days: int, travel_type: str, season: str) -> str:
        # Standard fallback recommendations
        fallbacks = {
            ("Beach", "Summer"): "Goa",
            ("Beach", "Winter"): "Andaman",
            ("Beach", "Monsoon"): "Kerala",
            ("Mountain", "Winter"): "Manali",
            ("Mountain", "Summer"): "Ladakh",
            ("Nature", "Monsoon"): "Coorg",
            ("Nature", "Winter"): "Ooty",
            ("Adventure", "Summer"): "Ladakh",
            ("Adventure", "Winter"): "Rishikesh",
            ("Historical", "Winter"): "Jaipur",
            ("Historical", "All"): "Mysore",
            ("Wildlife", "Winter"): "Jim Corbett",
            ("Wildlife", "Monsoon"): "Kaziranga",
            ("Spiritual & Religious", "Summer"): "Kedarnath",
            ("Spiritual & Religious", "Monsoon"): "Tirupati",
            ("Spiritual & Religious", "All"): "Ayodhya",
            ("Spiritual & Religious", "Winter"): "Varanasi"
                    
        }
        
        default_fallback = "Goa"
        
        if not self.model_loaded:
            return fallbacks.get((travel_type, season), fallbacks.get((travel_type, "Summer"), default_fallback))
            
        try:
            # Check values are in the encoders. If not, map to nearest or default.
            type_classes = list(self.le_type.classes_)
            if travel_type not in type_classes:
                # Find matching or fallback
                travel_type = type_classes[0]
                
            season_classes = list(self.le_season.classes_)
            if season not in season_classes:
                season = season_classes[0]
                
            type_encoded = self.le_type.transform([travel_type])[0]
            season_encoded = self.le_season.transform([season])[0]
            
            # Predict
            features = np.array([[budget, days, type_encoded, season_encoded]])
            prediction = self.model.predict(features)
            
            destination = self.le_destination.inverse_transform(prediction)[0]
            return destination
        except Exception as e:
            print(f"Error during ML prediction: {e}. Using fallback.")
            return fallbacks.get((travel_type, season), default_fallback)

# Singleton instance
recommendation_engine = RecommendationEngine()
