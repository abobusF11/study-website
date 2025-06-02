from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union, Literal

# Схемы для полей курса
class FieldOption(BaseModel):
    label: str
    value: Union[str, int]

class CourseField(BaseModel):
    name: str
    key: str
    type: Literal["string", "number", "select", "boolean"]
    required: bool = False
    options: Optional[List[FieldOption]] = None

# Схемы для курсов
class CourseCreate(BaseModel):
    name: str
    hours: int
    fields: List[str]

class CourseResponse(BaseModel):
    id: int
    name: str
    hours: int
    fields: List[str]

    class Config:
        orm_mode = True

# Схема для ошибок
class ErrorResponse(BaseModel):
    detail: str