from pydantic import BaseModel


class MethodistCreate(BaseModel):
    login: str
    password: str

class MethodistResponse(BaseModel):
    id: int
    login: str

    class Config:
        orm_mode = True

class MethodistUpdateRequest(BaseModel):
    id: str
    login: str
    password: str