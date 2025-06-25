from sqlalchemy import Column, Integer, String, SmallInteger, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)  # Общая дата для группы
    isOrder = Column(Boolean, index=True) # Заявки ли от пользователя или нет

    courses = relationship("CourseGroup", back_populates="group", cascade="all, delete-orphan")
    teacher_groups = relationship("TeachersGroup", back_populates="group", cascade="all, delete-orphan")

class CourseGroup(Base):
    __tablename__ = "courses_groups"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('courses.id'), index=True)  # Ссылка на таблицу курсов
    group_id = Column(Integer, ForeignKey('groups.id'), index=True)

    # Связи
    group = relationship("Group", back_populates="courses")
    course_info = relationship("Courses", back_populates="course_groups")
    clients = relationship("Client", back_populates="course_group", cascade="all, delete-orphan")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String, index=True, nullable=True)
    inn = Column(String, index=True, nullable=True)
    org = Column(String, index=True, nullable=True)
    safety = Column(Integer, index=True, nullable=True)
    reg_num = Column(Integer, index=True, nullable=True)
    position = Column(String, index=True, nullable=True)
    org_inn = Column(String, index=True, nullable=True)
    snils = Column(String, index=True, nullable=True)

    course_group_id = Column(Integer, ForeignKey('courses_groups.id'), index=True)

    course_group = relationship("CourseGroup", back_populates="clients")