from sqlalchemy import Column, Integer, String, Boolean, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Teachers(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    initials = Column(String, index=True)
    status = Column(Integer, index=True)

    teacher_groups = relationship(
        "TeachersGroup",
        back_populates="teacher",
        cascade="all, delete-orphan",  # Удаляем только связи
        passive_deletes=True
    )


class TeachersGroup(Base):
    __tablename__ = "teachers_group"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey('teachers.id', ondelete="CASCADE"), index=True)
    group_id = Column(Integer, ForeignKey('groups.id'), index=True)

    group = relationship("Group", back_populates="teacher_groups")
    teacher = relationship("Teachers", back_populates="teacher_groups")