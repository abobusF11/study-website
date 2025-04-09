from pydantic import BaseModel
from typing import List, Optional



class ClientCreate(BaseModel):
    initials: str
    inn: str| None = None
    group: int
    org: int
    reason_check: int | None = None
    safety: int | None = None
    result_check: int | None = None

    class Config:
        from_attributes = True

# Схема для создания группы (прием от клиента)
class GroupCreateRequest(BaseModel):
    course_id: int
    clients: List[ClientCreate]

# Схема ответа с созданной группой
class GroupCreateResponse(BaseModel):
    id: int
    course_id: int
    clients: List[ClientCreate]

class Client(BaseModel):
    id: int
    initials: str
    inn: str | None = None
    group: int
    org: str
    reason_check: int | None = None
    safety: int | None = None
    result_check: int | None = None

class GroupResponse(BaseModel):
    id: int
    course_id: int
    clients: List[Client]

# Схема для ответа с ошибкой
class ErrorResponse(BaseModel):
    detail: str