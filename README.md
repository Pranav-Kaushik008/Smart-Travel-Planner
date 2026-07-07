# AI Smart Travel Planner

AI Smart Travel Planner is a production-ready, containerized full-stack web application that leverages machine learning and generative AI to create custom, personalized holiday itineraries.

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, React Router DOM, Axios, Recharts
- **Backend**: FastAPI (Python 3.12+), SQLAlchemy 2.0 (Async), Pydantic
- **Database**: PostgreSQL (persisted via Docker volumes)
- **Machine Learning**: Scikit-Learn Random Forest Classifier Recommendation Model
- **AI Integrations**: OpenWeather API (real-time weather) & Google Gemini API (AI itinerary generation)
- **Containerization**: Docker & Docker Compose

---

## 📂 Project Structure

```
Smart Travel Planner/
├── backend/
│   ├── data/
│   │   └── destinations.csv     # 100+ destination records for ML model
│   ├── database/
│   │   ├── db.py                # Async engine & session setup
│   │   └── seed.py              # Seeds 30+ default hotels
│   ├── middleware/
│   │   └── auth_middleware.py   # JWT user verification dependency
│   ├── ml/
│   │   ├── train.py             # Random Forest training script
│   │   └── recommendation_model.pkl # Trained serialized model
│   ├── models/
│   │   ├── user.py              # SQLAlchemy user schemas
│   │   ├── trip.py              # SQLAlchemy trip history schema
│   │   └── hotel.py             # SQLAlchemy hotels schema
│   ├── routes/
│   │   ├── auth.py              # Registration, login, & self routes
│   │   ├── planner.py           # ML recommendation & Gemini AI itinerary
│   │   ├── weather.py           # Weather endpoint
│   │   ├── trips.py             # Protected history routes
│   │   ├── hotels.py            # Local hotel recommend
│   │   ├── dashboard.py         # Stats & interactive Recharts summary data
│   │   └── profile.py           # User detail updates
│   ├── schemas/
│   │   └── ...                  # Pydantic schemas for typed API payloads
│   ├── services/
│   │   ├── auth_service.py      # Password hashing & token signing
│   │   ├── weather_service.py   # Async Weather client
│   │   ├── gemini_service.py    # Google Gemini client (with offline fallback)
│   │   ├── recommendation_service.py # Model loading & inference
│   │   ├── budget_service.py    # Multiplier heuristic budget estimation
│   │   └── hotel_service.py     # Hotel querying
│   ├── main.py                  # App entrypoint, CORS configuration
│   └── requirements.txt         # Backend Python packages
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # API client with token interceptor
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx # Route guarding checks
│   │   │   ├── Navbar.jsx       # Header & theme switches
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── StatsCard.jsx    # Dashboard numbers
│   │   │   ├── WeatherCard.jsx  # Weather details
│   │   │   ├── HotelCard.jsx    # Ratings & pricing
│   │   │   ├── BudgetBreakdown.jsx # Recharts Pie Chart visualizer
│   │   │   └── ItineraryTimeline.jsx # Day-by-day roadmap
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global login state manager
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero layout & features
│   │   │   ├── LoginPage.jsx    # Login screen
│   │   │   ├── RegisterPage.jsx # Registration form
│   │   │   ├── Dashboard.jsx    # Recharts metrics
│   │   │   ├── TravelPlanner.jsx # Preferences wizard & results
│   │   │   ├── TripHistory.jsx  # Saved plans modal manager
│   │   │   └── ProfilePage.jsx  # Settings editor
│   │   ├── App.jsx              # Main routes setup
│   │   ├── index.css            # Tailwind directive & animations
│   │   └── main.jsx             # React entrypoint
│   ├── package.json             # NPM dependencies
│   └── vite.config.js           # Vite + Tailwind compilation rules
├── docker-compose.yml           # Unified environment orchestration
└── .env.example                 # Environment keys template
```

---

## 🛠️ Local Development Setup

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file:
   ```bash
   copy .env.example .env
   # Edit .env and paste your GEMINI_API_KEY
   ```
5. Retrain the machine learning model:
   ```bash
   python ml/train.py
   ```
6. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The interactive API documentation is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit the web app at [http://localhost:5173](http://localhost:5173).

---

## 🐳 Docker Deployment (Production-Ready)

Orchestrate the entire stack (PostgreSQL + FastAPI + React frontend) with a single command:

1. Create a `.env` file in the root directory:
   ```bash
   copy .env.example .env
   # Edit .env and supply your GEMINI_API_KEY
   ```
2. Start the services:
   ```bash
   docker-compose up --build -d
   ```
3. Verify running containers:
   ```bash
   docker-compose ps
   ```
4. Access the applications:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **API docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔐 Key API Endpoints Reference

| Endpoint | Method | Authentication | Description |
|---|---|---|---|
| `/api/register` | `POST` | Public | Create new user, returns JWT token |
| `/api/login` | `POST` | Public | Verify credentials, returns JWT token |
| `/api/me` | `GET` | Protected | Fetch current logged-in user profile details |
| `/api/recommend` | `POST` | Protected | Predict destination, returns weather + hotels + budget |
| `/api/generate-itinerary`| `POST` | Protected | Generates Gemini AI day-wise itinerary roadmap |
| `/api/save-trip` | `POST` | Protected | Saves all plan variables (ORM, injection-safe) |
| `/api/trip-history` | `GET` | Protected | List saved plans by date |
| `/api/dashboard/analytics`| `GET` | Protected | Aggregates monthly totals & expense breakdowns |
| `/api/profile` | `PUT` | Protected | Edit user profile fields (email, full name) |
