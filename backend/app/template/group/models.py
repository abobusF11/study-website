from sqlalchemy import Column, Integer, String, Boolean, SmallInteger

from backend.database import Base


class Groups(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(SmallInteger, index=True)

class Clients(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String, index=True)
    inn = Column(String, index=True)
    group = Column(Integer, index=True)