from typing import List
from fastapi import *
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import *
from backend.database import get_db
from .schemas import GroupCreateRequest, GroupCreateResponse, ErrorResponse, GroupResponse
from .models import Groups, Clients

router = APIRouter(prefix="/template/group", tags=["Groups"])

# Функция для проверки аутентификации по кукам
async def check_auth(request: Request):
    token = request.cookies.get("token")  # Или другое имя вашей куки
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/create",
             response_model=GroupCreateResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def create_group(
        group_data: GroupCreateRequest,
        db: AsyncSession = Depends(get_db),
        _ = Depends(check_auth)
):
    try:
        # Создаем группу
        group_insert = insert(Groups).values(course=group_data.course_id).returning(Groups.id)
        result = await db.execute(group_insert)
        group_id = result.scalar_one()

        # Добавляем клиентов
        if group_data.clients:
            clients_data = [
                {"initials": client.initials, "inn": client.inn, "group": group_id}
                for client in group_data.clients
            ]
            await db.execute(insert(Clients), clients_data)

        await db.commit()

        # Формируем ответ
        return {
            "id": group_id,
            "course_id": group_data.course_id,
            "clients": group_data.clients
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании группы: {str(e)}"
        )

@router.get(
    "/show",
    response_model=List[GroupResponse],
    responses={401: {"model": ErrorResponse}}
)
async def show_groups(
        db: AsyncSession = Depends(get_db),
        _ = Depends(check_auth)
):
    # Получаем все группы
    groups_result = await db.execute(select(Groups))
    groups = groups_result.scalars().all()

    if not groups:
        return []

    # Для каждой группы получаем клиентов
    groups_with_clients = []
    for group in groups:
        clients_result = await db.execute(
            select(Clients).where(Clients.group == group.id)
        )
        clients = clients_result.scalars().all()

        groups_with_clients.append({
            "id": group.id,
            "course_id": group.course,
            "clients": [
                {"id": client.id, "initials": client.initials, "inn": client.inn}
                for client in clients
            ]
        })

    return groups_with_clients