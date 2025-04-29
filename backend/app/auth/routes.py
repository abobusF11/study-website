import logging

from fastapi import *
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import schemas
from backend.models.auth_model import *
from .utils import *
from ...database import get_db

router = APIRouter(tags=["auth"])

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
        select(Metodists).where(Metodists.login == login)
    )
    user = result.scalars().first()
    if user is None:
        raise credentials_exception

    return user

@router.get("/me", response_model=schemas.UserResponse)
def read_user_me(current_user: Metodists = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db), isLogin = require_lvl(0)):
    result = await db.execute(
        select(Metodists).where(Metodists.login == user.login)
    )
    db_user = result.scalars().first()

    logging.INFO(isLogin)

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login already registered"
        )

    # Хешируем пароль
    hashed_password = get_password_hash(user.password)

    # Создаем нового пользователя
    db_user = Metodists(
        login=user.login,
        hashed_password=hashed_password,
        lvl=0
    )

    # Добавляем и сохраняем пользователя
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.post("/login", response_model=schemas.UserResponse)
async def login(
        response: Response,
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(get_db)
):
    # Ищем пользователя в базе
    result = await db.execute(
        select(Metodists).where(Metodists.login == form_data.username)
    )
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    # Проверяем пароль
    if not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.login, "lvl": db_user.lvl},
        expires_delta=access_token_expires
    )

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,
        samesite="lax"
    )

    return db_user


@router.post("/logout")
async def logout():
    response = Response(content="Успешный выход")
    response.delete_cookie("token")
    return response