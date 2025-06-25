from pydantic import BaseModel, Field
from typing import List, Optional


class Client(BaseModel):
    id: int
    initials: Optional[str] = None
    inn: Optional[str] = None
    org: Optional[str] = None
    safety: Optional[int] = Field(default=None)
    reg_num: Optional[str] = None
    org_inn: Optional[str] = None
    snils: Optional[str] = None
    position: Optional[str] = None


class Teacher(BaseModel):
    id: int
    initials: Optional[str] = None
    status: Optional[int] = None


class CourseGroup(BaseModel):
    id: int
    course_id: int
    clients: List[Client]


class Group(BaseModel):
    id: int
    date: str
    isOrder: bool
    courseGroups: CourseGroup
    teachers: List[Teacher]


class Course(BaseModel):
    id: int
    name: str
    hours: int
    fields: List[str]


class PrintData(BaseModel):
    group: Group
    course: Course

class TemplateForCourse(BaseModel):
    course_id: int
    template_ids: List[str]

class DocumentRequest(BaseModel):
    group_id: int
    templates: List[TemplateForCourse]