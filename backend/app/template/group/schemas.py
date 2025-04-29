from pydantic import BaseModel
from typing import List
from datetime import date

from backend.app.template.teachers.schemas import TeacherResponse


# Создание группы
class ClientCreate(BaseModel):
    initials: str
    inn: str | None = None
    org: str
    safety: int | None = None
    reg_num: int | None = None

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    course_id: int
    clients: List[ClientCreate]


class GroupCreate(BaseModel):
    date: date
    courses: List[CourseCreate]
    teachers: List[int] | None = None


# Обновления
class GroupCreateResponse(BaseModel):
    id: int


class ClientResponse(BaseModel):
    id: int
    initials: str
    inn: str | None = None
    org: str
    safety: int | None = None
    reg_num: int | None = None

    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    id: int
    course_id: int
    group_id: int
    clients: List[ClientResponse]

class Config:
        from_attributes = True

class GroupResponse(BaseModel):
    id: int
    date: date
    courses: List[CourseResponse]
    teachers: List[TeacherResponse] | None = None

    class Config:
        from_attributes = True

#Обновления
class ClientUpdate(BaseModel):
    id: int
    initials: str
    inn: str | None = None
    org: str
    safety: int | None = None
    reg_num: int | None = None

    class Config:
        from_attributes = True

class CourseUpdate(BaseModel):
    id: int
    course_id: int
    clients: List[ClientUpdate]

    class Config:
        from_attributes = True


class GroupUpdate(BaseModel):
    id: int
    date: date
    courses: List[CourseUpdate]
    teachers: List[int]

    class Config:
        from_attributes = True

class GroupUpdateResponse(BaseModel):
    id: int


# Схема для ответа с ошибкой
class ErrorResponse(BaseModel):
    detail: str
