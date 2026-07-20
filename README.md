# AI Smart Travel Planner

AI Smart Travel Planner is a full-stack, container-friendly web application that combines machine learning recommendations and generative AI to help users plan personalized travel itineraries, compare transport options, and save trips.

This README covers development, Docker deployment, configuration, and useful troubleshooting tips so you can run the project locally or in containers.

**Repository:** [README.md](README.md#L1)

---

**Highlights**
- Destination recommendation using a Random Forest model
- Google Gemini integration for AI-generated day-by-day itineraries (optional)
- Real-time weather lookup, hotel suggestions, and transport comparisons
- Full authentication, trip persistence, and profile management
- Containerized with Docker Compose

---

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios
- Backend: FastAPI, SQLAlchemy (async), Pydantic
- Database: PostgreSQL (Docker volume)
- ML: scikit-learn (train with `backend/ml/train.py`)
- Dev tooling: Docker, docker-compose, uvicorn

---

## Files of Interest
- `backend/` — FastAPI app, services, ML training, database models
- `frontend/` — React app (Vite) and UI components
- `docker-compose.yml` — Start DB, backend, and frontend together
- `backend/requirements.txt` — Python dependencies
- `frontend/package.json` — Frontend dependencies and scripts

---

## Quick Start (Docker, recommended)

1. Copy the environment template and set keys in `.env` at the repo root:

```bash
copy .env.example .env
# Edit .env and set values for:
# OPENWEATHER_API_KEY, GEMINI_API_KEY (optional), JWT_SECRET_KEY
```

2. Build and start everything:

```bash
docker-compose up --build -d
```

3. Open the apps:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

Note: The frontend container serves the static build on port 3000 per the Compose file.

---

## Local Development (Backend)

1. Create a virtual environment and install dependencies:

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# or: source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

2. Create `.env` by copying `.env.example` and set required keys.

3. (Optional) Train the ML model used for recommendations:

```bash
python ml/train.py
```

4. Run the backend app locally:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs (Swagger): http://127.0.0.1:8000/docs

---

## Local Development (Frontend)

1. Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

2. Development proxy: Vite proxy forwards `/api` requests to `http://localhost:8000` (see `vite.config.js`).

Visit the app at: http://localhost:5173

---

## Environment Variables

Create a `.env` file with values for the variables below (this is an example — keys in your environment may vary):

```
DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/travelplanner
OPENWEATHER_API_KEY=your_openweather_key
GEMINI_API_KEY=your_gemini_key  # optional - used for AI itinerary
JWT_SECRET_KEY=change_this_to_secure_value
AVIATIONSTACK_API_KEY=optional_aviationstack_key
OPENROUTE_API_KEY=optional_openrouteservice_key
```

Notes:
- If you run with Docker Compose, the `DATABASE_URL` environment in the Compose file already points to the `db` service.
- The app includes graceful fallbacks where external API keys are not provided.

---

## How the Flights booking links work

- The backend maps cities to IATA codes and, for destinations without airports (e.g., Coorg), provides the nearest airport and distance.
- Booking links ("Book Now") open Makemytrip using the resolved origin and destination IATA codes so users arrive at the nearest-airport search results (e.g. BLR → MYQ).

---

## Running Tests

- Frontend tests (Vitest): `cd frontend && npm run test`
- Backend: no automated tests included; you can run ad-hoc scripts or add pytest-based tests.

---

## Troubleshooting

- Database connection issues: ensure Docker db is running or `DATABASE_URL` points to a valid Postgres instance.
- Missing API keys: the app uses fallbacks for weather and Gemini where appropriate — log messages show which services failed.
- Ports in use: backend defaults to 8000, frontend dev to 5173, frontend container to 3000 — adjust if needed.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-change`
3. Make changes, run local tests and linters.
4. Open a pull request with a clear description.

---

## License & Attribution

This project is provided as-is for development and educational purposes. Add a license file (e.g., MIT) if you intend to release it publicly.

---

If you want I can also:
- add a `.env.example` file to the repo if it’s missing,
- generate a short QuickStart script for Windows and macOS,
- or update the frontend to display a clearer airport note only in the flights tab header.
