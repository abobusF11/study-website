import logging

from fastapi import *
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import schemas
from backend.models.auth_model import *
from .utils import *
from ...database import get_db
import logging
logging.basicConfig(level=logging.INFO)

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

    if login == ADMIN_LOGIN:
        return {"id": 0, "login": ADMIN_LOGIN, "role": "admin"}

    # Проверка пользователя в БД
    result = await db.execute(
        select(Metodists).where(Metodists.login == login)
    )
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user

@router.get("/me", response_model=schemas.UserResponse)
async def read_user_me(current_user: Metodists = Depends(get_current_user)):
    return current_user

ADMIN_LOGIN = "admin"
ADMIN_PASSWORD = get_password_hash("study_admin234")

# Обновленный метод is_admin
async def is_admin(request: Request):
    try:
        token = request.cookies.get("token")
        if not token:
            return False
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        return login == ADMIN_LOGIN
    except Exception:
        return False

# Обновленный метод login
@router.post("/login", response_model=schemas.UserResponse)
async def login(
        response: Response,
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(get_db)
):
    # Проверка админа
    if form_data.username == ADMIN_LOGIN:

        if not verify_password(form_data.password, ADMIN_PASSWORD):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        # Создаем токен для админа
        access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": ADMIN_LOGIN, "role": "admin"},
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
        # Возвращаем данные админа
        return {"id": 0, "login": ADMIN_LOGIN, "role": "admin"}

    # Для обычных методистов
    result = await db.execute(
        select(Metodists).where(Metodists.login == form_data.username)
    )
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.login, "role": "methodist"},
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

    return {"id": db_user.id, "login": db_user.login, "role": "metodist"}


@router.post("/logout")
async def logout():
    response = Response(content="Успешный выход")
    response.delete_cookie("token")
    return response