from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
from fastapi import Depends, HTTPException, status, Request

# Секретный ключ и алгоритм
SECRET_KEY = os.getenv("SECRET_KEY", "d3b07384d113edec49eaa6238ad5ff00c1f169f3b7e9d5a5a5a5a5a5a5a5a5a5")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 240

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(request: Request):
    credentials_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not validate credentials"
    )

    # Получаем токен из куки
    token = request.cookies.get("token")
    if not token:
        raise credentials_exception

    try:
        # Декодируем JWT из куки
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        user_role: str = payload.get("role")
        if login is None or user_role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return {"login": login, "role": user_role}


# Зависимость для проверки уровня доступа
def require_role(role: str):
    def dependency(current_user: dict = Depends(get_current_user)):
        if role == "admin" and current_user["role"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires access level higher"
            )
        return current_user
    return dependency