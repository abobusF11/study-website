from pydantic import BaseModel, Field
from typing import List
from datetime import date

from backend.app.teachers.schemas import TeacherResponse


# Создание группы
class ClientCreate(BaseModel):
    initials: str
    inn: str | None = None
    org: str
    safety: int | None = None
    reg_num: int | None = None
    position: str | None = None

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    course_id: int
    clients: List[ClientCreate]


class GroupCreate(BaseModel):
    date: date
    courseGroups: List[CourseCreate]
    teachers: List[int]
    isOrder: bool


class ClientResponse(BaseModel):
    id: int
    initials: str
    inn: str | None = None
    org: str
    safety: int | None = None
    reg_num: int | None = None
    position: str | None = None

    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    id: int
    course_id: int | None = None
    clients: List[ClientResponse]

    class Config:
        from_attributes = True


class GroupResponse(BaseModel):
    id: int
    date: date
    isOrder: bool
    courseGroups: List[CourseResponse] = Field(alias="courseGroups")
    teachers: List[TeacherResponse] | None = None

    class Config:
        from_attributes = True


# Обновления
class ClientUpdate(BaseModel):
    id: int
    initials: str
    inn: str | None = None
    org: str
    safety: int | None = None
    reg_num: int | None = None
    position: str | None = None

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
    isOrder: bool
    courseGroups: List[CourseUpdate]
    teachers: List[int]

    class Config:
        from_attributes = True


# Схема для ответа с ошибкой
class ErrorResponse(BaseModel):
    detail: str
