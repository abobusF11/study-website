import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# URL для подключения к PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")
# Создаем асинхронный движок
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=20,         # Максимум соединений в пуле
    max_overflow=10,      # Дополнительные соединения, если пул переполнен
    pool_timeout=30,      # Ожидание свободного соединения (сек)
    pool_recycle=3600     # Пересоздавать соединения каждые N секунд
)

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:  # Создаём новую сессию
        try:
            yield session  # Отдаём сессию в route
        finally:
            await session.close()

Base = declarative_base()