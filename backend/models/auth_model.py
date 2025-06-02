from sqlalchemy import Column, Integer, String

from backend.database import Base


class Metodists(Base):
    __tablename__ = "metodists"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, index=True)
    hashed_password = Column(String)