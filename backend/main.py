from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from backend.app.auth.routes import router as auth_router
from backend.app.groups.routes import router as group_router
from backend.app.teachers.routes import router as teacher_router
from backend.app.courses.routes import router as courses_router
from backend.app.methodists.routes import router as methodists_router


app = FastAPI()

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

FRONTEND_URL = os.getenv("FRONTEND_URL")

# CORS с динамическим URL фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(auth_router, prefix="/api/auth")
app.include_router(group_router, prefix="/api/group")
app.include_router(teacher_router, prefix="/api/teacher")
app.include_router(courses_router, prefix="/api/courses")
app.include_router(methodists_router, prefix="/api/methodists")

# Тестовый эндпоинт
@app.get("/")
async def root():
    return {"message": "API is working"}