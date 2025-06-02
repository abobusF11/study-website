from pydantic import BaseModel

class UserCreate(BaseModel):
    login: str
    password: str

class UserResponse(BaseModel):
    id: int
    login: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
