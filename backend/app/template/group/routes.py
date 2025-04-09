import datetime
from typing import List
from fastapi import *
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import *
from sqlalchemy.orm import joinedload

from backend.database import get_db
from .schemas import GroupCreateRequest, GroupCreateResponse, ErrorResponse, GroupResponse
from backend.models.group import Groups, Clients
from ...auth.utils import require_lvl

router = APIRouter(tags=["Groups"])

@router.post("/create",
             response_model=GroupCreateResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def create_group(
        group_data: GroupCreateRequest,
        db: AsyncSession = Depends(get_db),
        _ = Depends(require_lvl(1))
):
    # 1. Создаем группу
    group = Groups(course_id=group_data.course_id, date = datetime.date(2025, 4, 9))
    db.add(group)
    await db.flush()  # Получаем ID группы

    # 2. Создаем клиентов и привязываем к группе
    clients = [
        Clients(
            initials=client.initials,
            inn=client.inn,
            org=client.org,
            group=group.id,
            reason_check = client.reason_check,
            safety = client.safety,
            result_check = client.result_check
        )
        for client in group_data.clients
    ]

    db.add_all(clients)
    await db.commit()
    return {
        "group_id": group.id,
        "clients_count": len(clients)
    }

@router.get(
    "/show",
    response_model=List[GroupResponse],
    responses={401: {"model": ErrorResponse}}
)
async def show_groups(
        db: AsyncSession = Depends(get_db),
        _ = Depends(require_lvl(2))
):
    result = await db.execute(
        select(Groups)
        .options(joinedload(Groups.clients))
    )

    group = result.scalar_one_or_none()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    return {
        "id": group.id,
        "course_id": group.course_id,
        "clients": [
            {
                "id": client.id,
                "initials": client.initials,
                "inn": client.inn
            }
            for client in group.clients
        ]
    }
    #
    #
    #
    # # Получаем все группы
    # groups_result = await db.execute(select(Groups))
    # groups = groups_result.scalars().all()
    #
    # if not groups:
    #     return []
    #
    # # Для каждой группы получаем клиентов
    # groups_with_clients = []
    # for group in groups:
    #     clients_result = await db.execute(
    #         select(Clients).where(Clients.group == group.id)
    #     )
    #     clients = clients_result.scalars().all()
    #
    #     groups_with_clients.append({
    #         "id": group.id,
    #         "course_id": group.course,
    #         "clients": [
    #             {"id": client.id, "initials": client.initials, "inn": client.inn}
    #             for client in clients
    #         ]
    #     })
    #
    # return groups_with_clients