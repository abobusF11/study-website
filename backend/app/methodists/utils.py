from fastapi import Request

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.app.auth.routes import is_admin
from backend.database import get_db


def admin_required(request: Request):
    async def dependency(db: AsyncSession = Depends(get_db)):
        admin_check = await is_admin(request)
        if not admin_check:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        return True
    return Depends(dependency)