from sqlalchemy import Column, Integer, String, Boolean, SmallInteger

from backend.database import Base


class Teachers(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String, index=True)
    status = Column(String, index=True)