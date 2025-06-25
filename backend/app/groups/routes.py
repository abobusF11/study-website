from typing import List
from fastapi import Depends, Query, HTTPException, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from .repositories import GroupRepository
from .schemas import GroupCreate, ErrorResponse, GroupUpdate, GroupResponse
from ..auth.utils import require_role

router = APIRouter(tags=["Groups"])


@router.post(
    "/",
    response_model=GroupResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def create_group(
        group_data: GroupCreate,
        db: AsyncSession = Depends(get_db),
        # _=Depends(require_role("methodist"))
):
    try:
        return await GroupRepository.create_group(db, group_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=List[GroupResponse],
    responses={
        200: {"description": "Возвращает список групп, возможно пустой"},
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse}
    }
)
async def show_groups(
        db: AsyncSession = Depends(get_db),
        date_filter: str = Query(
            'active',
            description="Фильтр по дате: 'active', 'archive', 'from-user'",
            regex="^(active|archive|from-user)$"
        )
):
    groups = await GroupRepository.get_groups(db, date_filter)
    return groups


@router.put(
    "/update",
    response_model=GroupResponse,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def update_group(
        group_update: GroupUpdate,
        db: AsyncSession = Depends(get_db),
        # _=Depends(require_role("methodist"))
):
    try:
        return await GroupRepository.update_group(db, group_update)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{group_id}",
    responses={401: {"model": ErrorResponse}, 404: {"model": ErrorResponse}}
)
async def delete_group(
        group_id: int,
        db: AsyncSession = Depends(get_db),
        # _=Depends(require_role("methodist"))
):
    try:
        return await GroupRepository.delete_group(db, group_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
