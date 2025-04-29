from sqlalchemy import Column, Integer, String, SmallInteger, Date

from backend.database import Base


from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class UserGroup(Base):
    __tablename__ = "user_groups"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)  # Общая дата для группы

    # Связь один-ко-многим с курсами группы
    user_courses  = relationship("UserCourseGroup", back_populates="user_group", cascade="all, delete-orphan")

class UserCourseGroup(Base):  # Переименовано для единообразия
    __tablename__ = "user_courses_groups"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(SmallInteger, index=True)
    group_id = Column(Integer, ForeignKey('user_groups.id'), index=True)
    # Связи
    user_group = relationship("UserGroup", back_populates="user_courses")
    user_clients = relationship("UserClient", back_populates="user_course_group", cascade="all, delete-orphan")

class UserClient(Base):
    __tablename__ = "user_clients"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String, index=True)
    inn = Column(String, index=True, nullable=True)
    org = Column(String, index=True)
    safety = Column(Integer, index=True, nullable=True)
    reg_num = Column(Integer, index=True, nullable=True)

    course_group_id = Column(Integer, ForeignKey('user_courses_groups.id'), index=True)

    user_course_group = relationship("UserCourseGroup", back_populates="user_clients")