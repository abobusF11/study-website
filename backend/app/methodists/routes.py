import logging
from typing import List

from fastapi import APIRouter
from sqlalchemy import select

from .schemas import MethodistCreate, MethodistUpdateRequest, MethodistResponse
from .utils import *
from ..auth import schemas
from ..auth.utils import get_password_hash
from ...database import get_db
from ...models import Metodists

router = APIRouter(tags=["Methodists"])

@router.get("/", response_model=List[MethodistResponse])
async def get_methodists(
    db: AsyncSession = Depends(get_db),
    admin_check: bool = Depends(admin_required)
):
    result = await db.execute(select(Metodists))
    methodists = result.scalars().all()
    return methodists

@router.post("/")
async def create_methodist(
    methodist: MethodistCreate,
    db: AsyncSession = Depends(get_db),
    admin_check: bool = Depends(admin_required)
):
    result = await db.execute(
        select(Metodists).where(Metodists.login == methodist.login)
    )
    existing_methodist = result.scalars().first()
    
    if existing_methodist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Methodist with this login already exists"
        )
    
    hashed_password = get_password_hash(methodist.password)
    
    new_methodist = Metodists(
        login=methodist.login,
        hashed_password=hashed_password
    )
    
    db.add(new_methodist)
    await db.commit()
    await db.refresh(new_methodist)
    
    return new_methodist

@router.get("/{methodist_id}", response_model=schemas.UserResponse)
async def get_methodist(
    methodist_id: int,
    db: AsyncSession = Depends(get_db),
    admin_check: bool = Depends(admin_required)
):
    result = await db.execute(
        select(Metodists).where(Metodists.id == methodist_id)
    )
    methodist = result.scalars().first()
    
    if not methodist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Methodist not found"
        )
    
    return methodist

@router.put("/{methodist_id}")
async def update_methodist(
    new_methodist: MethodistUpdateRequest,
    db: AsyncSession = Depends(get_db),
    admin_check: bool = Depends(admin_required)
):
    # Находим методиста
    result = await db.execute(
        select(Metodists).where(Metodists.id == new_methodist.id)
    )
    methodist = result.scalars().first()
    
    if not methodist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Methodist not found"
        )

    if new_methodist.login is not None:
        if new_methodist.login != methodist.login:
            login_check = await db.execute(
                select(Metodists).where(Metodists.login == new_methodist.login)
            )
            if login_check.scalars().first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Login already in use"
                )
        methodist.login = new_methodist.login

    if new_methodist.password is not None and new_methodist.password != "":
        methodist.hashed_password = get_password_hash(new_methodist.password)

    await db.commit()
    await db.refresh(methodist)
    
    return methodist

@router.delete("/{methodist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_methodist(
    methodist_id: int,
    db: AsyncSession = Depends(get_db),
    admin_check: bool = Depends(admin_required)
):
    result = await db.execute(
        select(Metodists).where(Metodists.id == methodist_id)
    )
    methodist = result.scalars().first()
    
    if not methodist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Methodist not found"
        )

    await db.delete(methodist)
    await db.commit()
    
    return None