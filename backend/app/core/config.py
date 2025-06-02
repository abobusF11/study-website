import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost/study")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 240
    
    class Config:
        env_file = ".env"

settings = Settings()