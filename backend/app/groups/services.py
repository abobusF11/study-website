from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .repositories import GroupRepository
from .schemas import GroupCreate, GroupResponse
from backend.database import get_db

class GroupService:
    def __init__(self, db: AsyncSession = Depends(get_db), repository: GroupRepository = Depends()):
        self.db = db
        self.repository = repository
        
    async def create_group(self, group_data: GroupCreate):
        # Бизнес-логика создания группы
        group = await self.repository.create_group(group_data)
        return {"id": group.id}