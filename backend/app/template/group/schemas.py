from pydantic import BaseModel
from typing import List

# Схема для клиента
class ClientCreate(BaseModel):
    initials: str
    inn: str

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
    inn: str

class GroupResponse(BaseModel):
    id: int
    course_id: int
    clients: List[Client]

# Схема для ответа с ошибкой
class ErrorResponse(BaseModel):
    detail: str