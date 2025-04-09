from sqlalchemy import Column, Integer, String, Boolean, SmallInteger

from backend.database import Base


class Metodists(Base):
    __tablename__ = "metodists"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, index=True)
    lvl = Column(SmallInteger)
    hashed_password = Column(String)