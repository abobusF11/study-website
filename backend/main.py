from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Изменённые импорты (используйте относительные пути)
from .app.auth.routes import router as auth_router
from .app.template.group.routes import router as group_router
from .app.template.protocol.routes import router as protocol_router
from .app.template.teachers.routes import router as teacher_router

app = FastAPI()

# Получаем настройки из переменных окружения
FRONTEND_URL = os.getenv("FRONTEND_URL")
PORT = int(os.getenv("PORT", 8000))

# CORS с динамическим URL фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(auth_router)
app.include_router(group_router)
app.include_router(protocol_router)
app.include_router(teacher_router)

# Тестовый эндпоинт
@app.get("/")
async def root():
    return {"message": "API is working"}