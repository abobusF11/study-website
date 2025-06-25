from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.teachers_model import Teachers
from .schemas import TeacherCreate


class TeacherRepository:
    @staticmethod
    async def get_all_teachers(db: AsyncSession) -> List[Teachers]:
        result = await db.execute(select(Teachers))
        return result.scalars().all()
    
    @staticmethod
    async def get_teacher_by_id(db: AsyncSession, teacher_id: int) -> Optional[Teachers]:
        result = await db.execute(select(Teachers).where(Teachers.id == teacher_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_teacher(db: AsyncSession, teacher_data: TeacherCreate) -> Teachers:
        """Создать нового преподавателя"""
        teacher = Teachers(**teacher_data.dict(exclude_unset=True, exclude={"id"}))
        db.add(teacher)
        await db.flush()
        return teacher
    
    @staticmethod
    async def update_teacher(db: AsyncSession, teacher: Teachers, teacher_data: TeacherCreate) -> Teachers:
        """Обновить данные преподавателя"""
        if teacher_data.initials is not None:
            teacher.initials = teacher_data.initials
        if teacher_data.status is not None:
            teacher.status = teacher_data.status
        await db.flush()
        return teacher
    
    @staticmethod
    async def delete_teacher(db: AsyncSession, teacher: Teachers) -> None:
        """Удалить преподавателя"""
        await db.delete(teacher)
        await db.flush()
    
    @staticmethod
    async def replace_all_teachers(db: AsyncSession, new_teachers: List[TeacherCreate]) -> List[Teachers]:
        """Заменить всех преподавателей на новый список"""
        # Получаем всех текущих преподавателей
        result = await db.execute(select(Teachers))
        existing_teachers = result.scalars().all()
        existing_dict = {t.id: t for t in existing_teachers}
        
        # Удаляем преподавателей, которых нет в новом списке
        new_ids = {t.id for t in new_teachers if t.id is not None}
        for teacher in existing_teachers:
            if teacher.id not in new_ids:
                await db.delete(teacher)
        
        # Обновляем существующих или добавляем новых
        updated_teachers = []
        for teacher_data in new_teachers:
            if teacher_data.id is not None:
                # Обновление существующего преподавателя
                teacher = existing_dict.get(teacher_data.id)
                if teacher:
                    if teacher.initials != teacher_data.initials:
                        teacher.initials = teacher_data.initials
                    if teacher.status != teacher_data.status:
                        teacher.status = teacher_data.status
                    updated_teachers.append(teacher)
            else:
                # Добавление нового преподавателя
                teacher = Teachers(**teacher_data.dict(exclude_unset=True, exclude={"id"}))
                db.add(teacher)
                updated_teachers.append(teacher)
        
        await db.flush()
        return updated_teachers