from fastapi import FastAPI
from backend.app.auth.routes import router as auth_router
from backend.app.template.group.routes import router as group_router
from backend.app.template.protocol.routes import router as protocol_router
from backend.app.template.teachers.routes import router as teacher_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Укажите адрес фронтенда
    allow_credentials=True,  # Разрешить куки
    allow_methods=["*"],  # или конкретные методы ["GET", "POST"]
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(group_router)
app.include_router(protocol_router)
app.include_router(teacher_router)