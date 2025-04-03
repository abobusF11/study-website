from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Protocol(Base):
    __tablename__ = "protocols"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date)
    end_date = Column(Date)

    protocol_groups = relationship("ProtocolGroup", back_populates="protocol")

class ProtocolGroup(Base):
    __tablename__ = "protocol_groups"

    protocol_id = Column(Integer, ForeignKey('protocols.id'), primary_key=True)
    group_id = Column(Integer, ForeignKey('groups.id'), primary_key=True)

    protocol = relationship("Protocol", back_populates="protocol_groups")
    group = relationship("Groups")