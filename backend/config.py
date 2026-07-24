import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=[
            os.path.join(os.path.dirname(__file__), ".env"),  
            os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),  
        ],
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@db:5432/travelplanner"
    
    # Keys
    OPENWEATHER_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENROUTE_API_KEY: str = ""
    AVIATIONSTACK_API_KEY: str = ""
    RAPIDAPI_KEY: str = ""
    RESEND_API_KEY: str = ""
    ADMIN_EMAIL: str = "admin@smarttravelplanner.com"
    
    # JWT Settings
    JWT_SECRET_KEY: str = "supersecretkeychangeinproduction12345!"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24  # 1 day

settings = Settings()
