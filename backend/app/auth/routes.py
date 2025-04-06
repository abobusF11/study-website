import json

from fastapi import *
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from . import models, schemas, utils
from .models import Metodists
from .utils import SECRET_KEY, ALGORITHM
from ...database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

async def get_current_user(
        request: Request,  # Добавляем запрос для доступа к кукам
        db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )

    # Получаем токен из куки
    token = request.cookies.get("token")  # Имя куки должно совпадать с фронтендом
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Проверка пользователя в БД
    result = await db.execute(
        select(models.Metodists).where(models.Metodists.login == login)
    )
    user = result.scalars().first()
    if user is None:
        raise credentials_exception

    return user

@router.get("/me", response_model=schemas.UserResponse)
def read_user_me(current_user: Metodists = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверяем существование пользователя с таким логином
    result = await db.execute(
        select(models.Metodists).where(models.Metodists.login == user.login)
    )
    db_user = result.scalars().first()

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login already registered"
        )

    # Хешируем пароль
    hashed_password = utils.get_password_hash(user.password)

    # Создаем нового пользователя
    db_user = models.Metodists(
        login=user.login,
        hashed_password=hashed_password,
    )

    # Добавляем и сохраняем пользователя
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(get_db)
):
    # Асинхронный запрос к базе данных
    result = await db.execute(
        select(models.Metodists).where(models.Metodists.login == form_data.username)
    )
    user = result.scalars().first()

    # Проверка пользователя и пароля
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    # Создание токена
    access_token = utils.create_access_token(data={"sub": user.login})

    response = Response(
        content=json.dumps({
            "message": "Login successful",
            "token_type": "bearer"
        }),
        media_type="application/json"
    )

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600,
        path="/",
    )

    return response

@router.post("/logout")
async def logout():
    response = Response(content="Успешный выход")
    response.delete_cookie("token")
    return response