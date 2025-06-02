from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend.models.course_model import Courses, CourseFields
from .schemas import CourseCreate

class CourseRepository:
    @staticmethod
    async def get_all_courses(db: AsyncSession) -> List[Courses]:
        """Получить все курсы"""
        result = await db.execute(
            select(Courses).options(
                joinedload(Courses.course_fields)
            ).order_by(Courses.id)
        )
        return result.unique().scalars().all()
    
    @staticmethod
    async def get_course_by_id(db: AsyncSession, course_id: int) -> Optional[Courses]:
        """Получить курс по ID"""
        result = await db.execute(select(Courses).where(Courses.id == course_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_course(db: AsyncSession, course_data: CourseCreate) -> Courses:
        """Создать новый курс с полями"""
        try:
            # Создаем курс (без полей)
            course = Courses(
                name=course_data.name,
                hours=course_data.hours,
            )
            db.add(course)
            await db.flush()

            # Создаем и привязываем поля
            for field in course_data.fields:
                course_field = CourseFields(
                    course_id=course.id,
                    key=field,
                )
                db.add(course_field)

            await db.commit()
            await db.refresh(course)
            return course

        except Exception as e:
            await db.rollback()  # Откатываем в случае ошибки
            raise e
    
    @staticmethod
    async def update_course(db: AsyncSession, course_id: int, course_data: CourseCreate) -> Optional[Courses]:
        """Обновить существующий курс"""
        course = await CourseRepository.get_course_by_id(db, course_id)
        if not course:
            return None
        
        # Проверяем, что все поля имеют корректные типы
        for field in course_data.fields:
            if field.type == "select" and not field.options:
                raise ValueError(f"Поле {field.name} типа select должно иметь опции")
        
        course.name = course_data.name
        course.hours = course_data.hours
        course.fields = [field.dict() for field in course_data.fields]
        
        await db.commit()
        return course
    
    @staticmethod
    async def delete_course(db: AsyncSession, course_id: int) -> bool:
        """Удалить курс"""
        course = await CourseRepository.get_course_by_id(db, course_id)
        if not course:
            return False
        
        await db.delete(course)
        await db.commit()
        return True