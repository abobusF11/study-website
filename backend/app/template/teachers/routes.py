from typing import List
from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy import delete,select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.auth.utils import require_lvl
from backend.models.teachers_model import Teachers
from backend.app.template.teachers.schemas import *
from backend.database import get_db

router = APIRouter(tags=["Teachers"])

# Получить всех учителей
@router.get("/show", response_model=List[TeacherResponse])
async def get_all_teachers(
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Teachers))
    teachers = result.scalars().all()
    return teachers

@router.post("/replace-all", response_model=List[TeacherResponse])
async def replace_all_teachers(
        new_teachers: List[TeacherCreate],
        db: AsyncSession = Depends(get_db)
):
    try:
        # Получаем всех текущих учителей
        result = await db.execute(select(Teachers))
        existing_teachers = result.scalars().all()
        existing_dict = {t.id: t for t in existing_teachers}

        # Удаляем учителей, которых нет в новом списке
        new_ids = {t.id for t in new_teachers if t.id is not None}
        for teacher in existing_teachers:
            if teacher.id not in new_ids:
                await db.delete(teacher)

        # Обновляем существующих или добавляем новых
        updated_teachers = []
        for teacher_data in new_teachers:
            if teacher_data.id is not None:
                # Обновление существующего учителя
                teacher = existing_dict.get(teacher_data.id)
                if not teacher:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Учитель с id={teacher_data.id} не найден для обновления"
                    )
                # Обновляем только изменившиеся поля
                if teacher.initials != teacher_data.initials:
                    teacher.initials = teacher_data.initials
                if teacher.status != teacher_data.status:
                    teacher.status = teacher_data.status
            else:
                # Добавление нового учителя
                teacher = Teachers(**teacher_data.dict())
                db.add(teacher)

            updated_teachers.append(teacher)

        await db.commit()

        # Обновляем ID для ответа (только для новых учителей)
        for teacher in updated_teachers:
            if teacher_data.id is None:
                await db.refresh(teacher)

        return updated_teachers

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))