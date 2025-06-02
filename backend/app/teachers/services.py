from typing import List, Dict
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .repositories import TeacherRepository
from .schemas import TeacherCreate
from backend.models.teachers_model import Teachers


class TeacherService:
    @staticmethod
    async def get_all_teachers(db: AsyncSession) -> List[Teachers]:
        """Получить всех преподавателей"""
        return await TeacherRepository.get_all_teachers(db)
    
    @staticmethod
    async def create_teacher(db: AsyncSession, teacher_data: TeacherCreate) -> Teachers:
        """Создать нового преподавателя"""
        try:
            teacher = await TeacherRepository.create_teacher(db, teacher_data)
            await db.commit()
            return teacher
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка при создании преподавателя: {str(e)}")
    
    @staticmethod
    async def update_teacher(db: AsyncSession, teacher_id: int, teacher_data: TeacherCreate) -> Teachers:
        """Обновить данные преподавателя"""
        try:
            teacher = await TeacherRepository.get_teacher_by_id(db, teacher_id)
            if not teacher:
                raise HTTPException(status_code=404, detail=f"Преподаватель с id={teacher_id} не найден")
            
            updated_teacher = await TeacherRepository.update_teacher(db, teacher, teacher_data)
            await db.commit()
            return updated_teacher
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка при обновлении преподавателя: {str(e)}")
    
    @staticmethod
    async def delete_teacher(db: AsyncSession, teacher_id: int) -> Dict[str, str]:
        """Удалить преподавателя"""
        try:
            teacher = await TeacherRepository.get_teacher_by_id(db, teacher_id)
            if not teacher:
                raise HTTPException(status_code=404, detail=f"Преподаватель с id={teacher_id} не найден")
            
            await TeacherRepository.delete_teacher(db, teacher)
            await db.commit()
            return {"message": f"Преподаватель с id={teacher_id} успешно удален"}
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка при удалении преподавателя: {str(e)}")
    
    @staticmethod
    async def replace_all_teachers(db: AsyncSession, new_teachers: List[TeacherCreate]) -> List[Teachers]:
        """Заменить всех преподавателей на новый список"""
        try:
            updated_teachers = await TeacherRepository.replace_all_teachers(db, new_teachers)
            await db.commit()
            return updated_teachers
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка при обновлении списка преподавателей: {str(e)}")