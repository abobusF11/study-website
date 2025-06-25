from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Client:
    id: int
    initials: str
    inn: Optional[str]
    org: str
    safety: Optional[int]
    reg_num: Optional[str]
    position: str


@dataclass
class CourseGroup:
    id: int
    course_id: int
    clients: List[Client]


@dataclass
class Group:
    id: int
    date: str
    isOrder: bool
    courseGroups: CourseGroup
    teachers: List[int]


@dataclass
class Course:
    id: int
    name: str
    hours: int
    fields: List[str]


@dataclass
class PrintData:
    group: Group
    course: Course