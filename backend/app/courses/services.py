from typing import List, Optional
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from .repositories import CourseRepository
from .schemas import CourseCreate, CourseResponse

class CourseService:
    @staticmethod
    async def get_all_courses(db: AsyncSession = Depends(get_db)) -> List[CourseResponse]:
        """Получить все курсы"""
        courses = await CourseRepository.get_all_courses(db)
        return [
            CourseResponse(
                id=course.id,
                name=course.name,
                hours=course.hours,
                fields=[group.key for group in course.course_fields]
            )
            for course in courses
        ]
    
    @staticmethod
    async def get_course_by_id(course_id: int, db: AsyncSession = Depends(get_db)) -> Optional[CourseResponse]:
        """Получить курс по ID"""
        course = await CourseRepository.get_course_by_id(db, course_id)
        if not course:
            return None
        return CourseResponse.from_orm(course)
    
    @staticmethod
    async def create_course(course_data: CourseCreate, db: AsyncSession = Depends(get_db)) -> CourseResponse:
        """Создать новый курс"""
        course = await CourseRepository.create_course(db, course_data)
        return CourseResponse.from_orm(course)
    
    @staticmethod
    async def update_course(course_id: int, course_data: CourseCreate, db: AsyncSession = Depends(get_db)) -> Optional[CourseResponse]:
        """Обновить существующий курс"""
        course = await CourseRepository.update_course(db, course_id, course_data)
        if not course:
            return None
        return CourseResponse.from_orm(course)
    
    @staticmethod
    async def delete_course(course_id: int, db: AsyncSession = Depends(get_db)) -> bool:
        """Удалить курс"""
        return await CourseRepository.delete_course(db, course_id)