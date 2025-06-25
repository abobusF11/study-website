from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union, Literal
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

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            name=obj.name,
            hours=obj.hours,
            fields=[field.key for field in obj.course_fields]
        )

# Схема для ошибок
class ErrorResponse(BaseModel):
    detail: str