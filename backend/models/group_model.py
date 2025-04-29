from sqlalchemy import Column, Integer, String, SmallInteger, Date

from backend.database import Base


from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)  # Общая дата для группы

    courses = relationship("CourseGroup", back_populates="group", cascade="all, delete-orphan")
    teacher_groups = relationship("TeachersGroup", back_populates="group", cascade="all, delete-orphan")

class CourseGroup(Base):  # Переименовано для единообразия
    __tablename__ = "courses_groups"  # Лучше использовать snake_case

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(SmallInteger, index=True)  # ID из справочника курсов
    group_id = Column(Integer, ForeignKey('groups.id'), index=True)
    # Связи
    group = relationship("Group", back_populates="courses")
    clients = relationship("Client", back_populates="course_group", cascade="all, delete-orphan")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String, index=True)
    inn = Column(String, index=True, nullable=True)
    org = Column(String, index=True)
    safety = Column(Integer, index=True, nullable=True)
    reg_num = Column(Integer, index=True, nullable=True)

    course_group_id = Column(Integer, ForeignKey('courses_groups.id'), index=True)

    course_group = relationship("CourseGroup", back_populates="clients")