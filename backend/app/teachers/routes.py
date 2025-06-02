from typing import List
from fastapi import HTTPException, APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from .schemas import TeacherCreate, TeacherResponse
from .services import TeacherService

router = APIRouter(tags=["Teachers"])

@router.get("/show", response_model=List[TeacherResponse])
async def get_all_teachers(db: AsyncSession = Depends(get_db)):
    """Получить всех преподавателей"""
    teachers = await TeacherService.get_all_teachers(db)
    return teachers

@router.post("/create", response_model=TeacherResponse)
async def create_teacher(teacher: TeacherCreate, db: AsyncSession = Depends(get_db)):
    """Создать нового преподавателя"""
    return await TeacherService.create_teacher(db, teacher)

@router.put("/update", response_model=TeacherResponse)
async def update_teacher(teacher: TeacherCreate, db: AsyncSession = Depends(get_db)):
    """Обновить данные преподавателя"""
    if teacher.id is None:
        raise HTTPException(status_code=400, detail="ID преподавателя обязателен для обновления")
    return await TeacherService.update_teacher(db, teacher.id, teacher)

@router.delete("/delete", response_model=dict)
async def delete_teacher(teacher_id: int = Query(...), db: AsyncSession = Depends(get_db)):
    """Удалить преподавателя"""
    return await TeacherService.delete_teacher(db, teacher_id)

@router.post("/replace-all", response_model=List[TeacherResponse])
async def replace_all_teachers(new_teachers: List[TeacherCreate], db: AsyncSession = Depends(get_db)):
    """Заменить всех преподавателей на новый список"""
    return await TeacherService.replace_all_teachers(db, new_teachers)