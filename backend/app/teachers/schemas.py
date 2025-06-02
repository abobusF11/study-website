from pydantic import BaseModel

class Teacher(BaseModel):
    id: int
    initials: str
    status: int

class TeacherCreate(BaseModel):
    id: int | None
    initials: str
    status: int


class TeacherResponse(Teacher):
    id: int

    class Config:
        from_attributes = True  # вместо устаревшего orm_mode
