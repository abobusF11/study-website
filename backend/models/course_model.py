from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

class Courses(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    hours = Column(Integer)
    
    # Связь с группами
    course_groups = relationship("CourseGroup", back_populates="course_info")
    course_fields = relationship("CourseFields", back_populates="course", cascade="all, delete-orphan")

class CourseFields(Base):
    __tablename__ = "course_fields"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), index=True)
    key = Column(String, index=True)

    # Связь с группами
    course = relationship("Courses", back_populates="course_fields")