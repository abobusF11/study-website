from pydantic import BaseModel
from datetime import date
from typing import List

from backend.app.template.group.schemas import Client


class ProtocolCreate(BaseModel):
    start_date: date
    end_date: date
    group_ids: List[int]

class ProtocolResponse(BaseModel):
    id: int
    start_date: date
    end_date: date
    group_ids: List[int]

    class Config:
        orm_mode = True

class GroupShort(BaseModel):
    id: int
    course: int

class GroupInProtocol(BaseModel):
    id: int
    course_id: int
    clients: List[Client]

    class Config:
        from_attributes = True

class ProtocolsResponse(BaseModel):
    id: int
    start_date: date
    end_date: date
    groups: List[GroupInProtocol]