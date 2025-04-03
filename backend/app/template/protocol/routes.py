from sqlalchemy import *
from backend.app.template.group.models import Groups, Clients
from backend.app.template.protocol.models import Protocol, ProtocolGroup
from backend.app.template.protocol.schemas import *
from backend.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

router = APIRouter(prefix="/template/protocol", tags=["Protocols"])

@router.get("/group-for-select", response_model=List[GroupShort])
async def get_groups_for_select(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Groups))
    return result.scalars().all()

@router.post("/create",
             response_model=ProtocolResponse,
             status_code=status.HTTP_201_CREATED)
async def create_protocol(
        protocol_data: ProtocolCreate,
        db: AsyncSession = Depends(get_db)
):
    # Создаем протокол
    protocol = Protocol(
        start_date=protocol_data.start_date,
        end_date=protocol_data.end_date
    )
    db.add(protocol)
    await db.flush()  # Получаем ID протокола

    # Добавляем связи с группами
    for group_id in protocol_data.group_ids:
        # Проверяем существование группы
        group = await db.get(Groups, group_id)
        if not group:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group with id {group_id} not found"
            )

        db.add(ProtocolGroup(
            protocol_id=protocol.id,
            group_id=group_id
        ))

    await db.commit()
    await db.refresh(protocol)

    # Формируем ответ
    return {
        "id": protocol.id,
        "start_date": protocol.start_date,
        "end_date": protocol.end_date,
        "group_ids": protocol_data.group_ids
    }

@router.get("/show",
            response_model=List[ProtocolsResponse],
            status_code=status.HTTP_200_OK)
async def show_protocols_with_clients(
        db: AsyncSession = Depends(get_db)
):
    """
    Получает протоколы с группами и клиентами (оптимизированная версия)
    """
    # 1. Сначала получаем все протоколы
    protocols = (await db.execute(select(Protocol))).scalars().all()

    if not protocols:
        return []

    result = []

    # 2. Для каждого протокола получаем группы и клиентов
    for protocol in protocols:
        # Получаем связи протокола с группами
        protocol_groups = (await db.execute(
            select(ProtocolGroup)
            .where(ProtocolGroup.protocol_id == protocol.id)
        )).scalars().all()

        groups_with_clients = []

        for pg in protocol_groups:
            # Получаем информацию о группе
            group = await db.get(Groups, pg.group_id)
            if not group:
                continue

            # Получаем клиентов этой группы
            clients = (await db.execute(
                select(Clients)
                .where(Clients.group == group.id)
            )).scalars().all()

            # Формируем данные группы с клиентами
            groups_with_clients.append({
                "id": group.id,
                "course_id": group.course,
                "clients": [
                    {
                        "id": client.id,
                        "initials": client.initials,
                        "inn": client.inn
                    }
                    for client in clients
                ]
            })
            print("UUUU", groups_with_clients)

        # Добавляем протокол с группами в результат
        result.append({
            "id": protocol.id,
            "start_date": protocol.start_date,
            "end_date": protocol.end_date,
            "groups": groups_with_clients
        })

    return result