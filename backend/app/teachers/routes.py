from typing import List
from fastapi import HTTPException, APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from .schemas import TeacherCreate, TeacherResponse
from .services import TeacherService

router = APIRouter(tags=["Teachers"])

@router.get("/", response_model=List[TeacherResponse])
async def get_all_teachers(db: AsyncSession = Depends(get_db)):
    teachers = await TeacherService.get_all_teachers(db)
    return teachers

@router.post("/", response_model=TeacherResponse)
async def create_teacher(teacher: TeacherCreate, db: AsyncSession = Depends(get_db)):
    return await TeacherService.create_teacher(db, teacher)

@router.put("/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(teacher_id: int, teacher: TeacherCreate, db: AsyncSession = Depends(get_db)):
    return await TeacherService.update_teacher(db, teacher_id, teacher)

@router.delete("/{teacher_id}", response_model=dict)
async def delete_teacher(teacher_id: int, db: AsyncSession = Depends(get_db)):
    return await TeacherService.delete_teacher(db, teacher_id)