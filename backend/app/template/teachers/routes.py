from typing import List
from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy import delete,select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.template.teachers.models import Teachers
from backend.app.template.teachers.schemas import *
from backend.database import get_db

router = APIRouter(prefix="/template/teacher", tags=["Teachers"])

# Получить всех учителей
@router.get("/show", response_model=List[TeacherResponse])
async def get_all_teachers(db: AsyncSession = Depends(get_db)):
    """Получить список всех учителей (асинхронно)"""
    result = await db.execute(select(Teachers))
    teachers = result.scalars().all()
    return teachers

@router.post("/replace-all", response_model=List[TeacherResponse])
async def replace_all_teachers(
        new_teachers: List[TeacherCreate],
        db: AsyncSession = Depends(get_db)
):
    """Полностью заменить всех учителей в базе (асинхронная версия)"""
    try:
        # Удаляем всех существующих учителей
        await db.execute(delete(Teachers))

        # Добавляем новых учителей
        teachers_to_add = [Teachers(**teacher.dict()) for teacher in new_teachers]
        db.add_all(teachers_to_add)

        await db.commit()

        # Обновляем объекты чтобы получить их с ID
        for teacher in teachers_to_add:
            await db.refresh(teacher)

        return teachers_to_add

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))