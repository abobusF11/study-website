from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.app.auth.utils import require_role
from .schemas import CourseCreate, CourseResponse, ErrorResponse
from .repositories import CourseRepository
from .services import CourseService

router = APIRouter(tags=["Courses"])

@router.get(
    "/",
    response_model=List[CourseResponse],
    responses={404: {"model": ErrorResponse}}
)
async def get_all_courses(db: AsyncSession = Depends(get_db)):
    """Получить все курсы"""
    courses = await CourseService.get_all_courses(db)
    if not courses:
        raise HTTPException(status_code=404, detail="Курсы не найдены")
    return courses

@router.get(
    "/{course_id}",
    response_model=CourseResponse,
    responses={404: {"model": ErrorResponse}}
)
async def get_course(course_id: int, db: AsyncSession = Depends(get_db)):
    """Получить курс по ID"""
    course = await CourseRepository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f"Курс с ID {course_id} не найден")
    return course

@router.post(
    "/",
    response_model=CourseResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    # dependencies=[Depends(require_role("methodist"))]
)
async def create_course(course_data: CourseCreate, db: AsyncSession = Depends(get_db)):
    """Создать новый курс"""
    try:
        return await CourseRepository.create_course(db, course_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put(
    "/{course_id}",
    response_model=CourseResponse,
    responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    dependencies=[Depends(require_role("methodist"))]
)
async def update_course(course_id: int, course_data: CourseCreate, db: AsyncSession = Depends(get_db)):
    """Обновить существующий курс"""
    try:
        course = await CourseRepository.update_course(course_id, course_data, db)
        if not course:
            raise HTTPException(status_code=404, detail=f"Курс с ID {course_id} не найден")
        return course
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete(
    "/{course_id}",
    responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    # dependencies=[Depends(require_role("methodist"))]
)
async def delete_course(course_id: int, db: AsyncSession = Depends(get_db)):
    """Удалить курс"""
    success = await CourseService.delete_course(course_id, db)
    if not success:
        raise HTTPException(status_code=404, detail=f"Курс с ID {course_id} не найден")
    return {"message": f"Курс с ID {course_id} успешно удален"}