from pydantic import BaseModel

class TeacherBase(BaseModel):
    initials: str

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(TeacherBase):
    pass

class TeacherResponse(TeacherBase):
    id: int

    class Config:
        orm_mode = True