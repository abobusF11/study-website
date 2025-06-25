from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from backend.models.course_model import Courses, CourseFields
from .schemas import CourseCreate, CourseResponse


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
    async def create_course(db: AsyncSession, course_data: CourseCreate) -> CourseResponse:
        try:
            course = Courses(
                name=course_data.name,
                hours=course_data.hours,
            )
            db.add(course)
            await db.flush()

            fields = []
            for field in course_data.fields:
                course_field = CourseFields(
                    course_id=course.id,
                    key=field,
                )
                db.add(course_field)
                fields.append(field)

            await db.commit()

            return CourseResponse(
                id=course.id,
                name=course.name,
                hours=course.hours,
                fields=fields
            )

        except Exception as e:
            await db.rollback()
            raise e

    @staticmethod
    async def update_course(db: AsyncSession, course_id: int, course_data: CourseCreate) -> Optional[Courses]:
        # Получаем курс вместе с привязанными полями
        stmt = select(Courses).options(selectinload(Courses.course_fields)).where(Courses.id == course_id)
        result = await db.execute(stmt)
        course = result.scalars().first()

        if not course:
            return None

        try:
            # Обновляем основные атрибуты курса
            course.name = course_data.name
            course.hours = course_data.hours

            # Очищаем существующие поля
            course.course_fields.clear()
            await db.flush()

            # Добавляем новые поля
            course.course_fields.extend(
                CourseFields(key=field) for field in course_data.fields
            )

            await db.commit()
            await db.refresh(course)
            return course
        except Exception as e:
            await db.rollback()
            raise ValueError(f"Ошибка при обновлении курса: {str(e)}")
    
    @staticmethod
    async def delete_course(db: AsyncSession, course_id: int) -> bool:
        """Удалить курс"""
        course = await CourseRepository.get_course_by_id(db, course_id)
        if not course:
            return False
        
        await db.delete(course)
        await db.commit()
        return True