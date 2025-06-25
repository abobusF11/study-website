from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from backend.app.auth.routes import router as auth_router
from backend.app.groups.routes import router as group_router
from backend.app.teachers.routes import router as teacher_router
from backend.app.courses.routes import router as courses_router
from backend.app.methodists.routes import router as methodists_router
from backend.app.templates.routes import router as templates_router
from backend.app.docs.routes import router as docs_router
from backend.app.xml.routes import router as xml_router


app = FastAPI()

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(group_router, prefix="/api/group")
app.include_router(teacher_router, prefix="/api/teachers")
app.include_router(courses_router, prefix="/api/courses")
app.include_router(methodists_router, prefix="/api/methodists")
app.include_router(templates_router, prefix="/api/templates")
app.include_router(templates_router, prefix="/api/templates")
app.include_router(docs_router, prefix="/api/docs")
app.include_router(xml_router, prefix="/api/xml")