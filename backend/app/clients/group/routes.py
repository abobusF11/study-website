from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend.app.auth.utils import require_lvl
from backend.app.template.group.schemas import GroupCreateResponse, ErrorResponse, GroupCreate, GroupResponse, \
    CourseResponse, ClientResponse
from backend.database import get_db
from backend.models.user_group_model import UserGroup, UserCourseGroup, UserClient

router = APIRouter(tags=["Groups"])
@router.post("/create",
             response_model=GroupCreateResponse,
             dependencies=[],
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def create_group(
        group_data: GroupCreate,
        db: AsyncSession = Depends(get_db)
):
    # 1. Создаем группу
    group = UserGroup(date=group_data.date)
    db.add(group)
    await db.flush()  # Получаем ID группы

    # 2. Создаем курсы для этой группы
    for course in group_data.courses:
        course_group = UserCourseGroup(
            course_id=course.course_id,
            group_id=group.id  # Используем ID только что созданной группы
        )
        db.add(course_group)
        await db.flush()  # Получаем ID course_group

        # 3. Создаем клиентов для этого курса
        for client in course.clients:
            client_record = UserClient(
                initials=client.initials,
                inn=client.inn,
                org=client.org,
                safety=client.safety,
                reg_num=client.reg_num,
                course_group_id=course_group.id
            )
            db.add(client_record)

    await db.commit()

    return {
        "id": group.id
    }

@router.get(
    "/show",
    response_model=List[GroupResponse],
    responses={401: {"model": ErrorResponse}, 404: {"model": ErrorResponse}}
)
async def show_groups(
        db: AsyncSession = Depends(get_db),
        _ = Depends(require_lvl(1))
):
    # Загружаем группы с их курсами и клиентами
    result = await db.execute(
        select(UserGroup)
        .options(
            joinedload(UserGroup.user_courses)
            .joinedload(UserCourseGroup.user_clients)
        )
        .order_by(UserGroup.date.desc())  # Сортировка по дате (новые сначала)
    )

    groups = result.unique().scalars().all()

    if not groups:
        raise HTTPException(status_code=404, detail="Нет групп")

    return [
        GroupResponse(
            id=group.id,
            date=group.date,
            courses=[
                CourseResponse(
                    id=course.id,
                    course_id=course.course_id,
                    group_id=course.group_id,
                    clients=sorted([
                        ClientResponse(
                            id=client.id,
                            initials=client.initials,
                            inn=client.inn,
                            org=client.org,
                            safety=client.safety,
                            reg_num=client.reg_num
                        )
                        for client in course.user_clients
                    ], key=lambda x: x.initials)
                )
                for course in group.user_courses
            ]
        )
        for group in groups
    ]

@router.delete(
    "/delete",
    responses={401: {"model": ErrorResponse}, 404: {"model": ErrorResponse}}
)
async def delete_group(
        group_id: int = Query(..., description="ID группы для удаления"),
        db: AsyncSession = Depends(get_db),
        _=Depends(require_lvl(1))
):
    result = await db.execute(
        select(UserGroup)
        .where(UserGroup.id == group_id)
    )
    group = result.scalar_one_or_none()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    await db.delete(group)
    await db.commit()

    return {"message": f"Group {group_id} and all its clients were deleted"}