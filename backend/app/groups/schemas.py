from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from backend.app.teachers.schemas import TeacherResponse

# Базовые схемы
class ClientBase(BaseModel):
    initials: Optional[str] = None
    inn: Optional[str] = None
    org: Optional[str] = None
    safety: Optional[int] = None
    reg_num: Optional[int] = None
    position: Optional[str] = None
    org_inn: Optional[str] = None
    snils: Optional[str] = None

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    course_id: Optional[int] = None

class GroupBase(BaseModel):
    date: date
    isOrder: bool

# Создание
class ClientCreate(ClientBase):
    pass

class CourseCreate(CourseBase):
    clients: List[ClientCreate]

class GroupCreate(GroupBase):
    courseGroups: List[CourseCreate]
    teachers: List[int]

# Ответ
class ClientResponse(ClientBase):
    id: int

class CourseResponse(CourseBase):
    id: int
    clients: List[ClientResponse]

class GroupResponse(GroupBase):
    id: int
    courseGroups: List[CourseResponse] = Field(alias="courseGroups")
    teachers: Optional[List[TeacherResponse]] = None

# Обновление
class ClientUpdate(ClientBase):
    id: int

class CourseUpdate(CourseBase):
    id: int
    clients: List[ClientUpdate]

class GroupUpdate(GroupBase):
    id: int
    courseGroups: List[CourseUpdate]
    teachers: List[int]

# Ошибка
class ErrorResponse(BaseModel):
    detail: str