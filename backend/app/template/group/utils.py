from datetime import datetime, timedelta
from typing import List

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.template.group.schemas import ClientUpdate, CourseUpdate
from backend.app.template.teachers.schemas import Teacher
from backend.models import Group, CourseGroup, Client, TeachersGroup, Teachers


async def _process_courses(db: AsyncSession, group: Group, updated_courses: list[CourseUpdate]):
    """Обрабатывает обновление курсов и клиентов"""
    existing_courses = {course.id: course for course in group.courses}
    updated_course_ids = {course.id for course in updated_courses}

    for course in list(group.courses):
        if course.id not in updated_course_ids:
            await db.delete(course)

    for course_data in updated_courses:
        if course_data.id in existing_courses:
            course = existing_courses[course_data.id]
            course.course_id = course_data.course_id
            await _process_clients(db, course, course_data.clients)
        else:
            new_course = CourseGroup(
                course_id=course_data.course_id,
                group_id=group.id
            )
            db.add(new_course)
            await _process_clients(db, new_course, course_data.clients)


async def _process_clients(db: AsyncSession, course: CourseGroup, updated_clients: list[ClientUpdate]):
    existing_clients = {client.id: client for client in course.clients}
    updated_client_ids = {client.id for client in updated_clients}

    # Удаляем клиентов, которых нет в обновленных данных
    for client in list(course.clients):
        if client.id not in updated_client_ids:
            await db.delete(client)

    # Обрабатываем каждого клиента
    for client_data in updated_clients:
        if client_data.id in existing_clients:
            client = existing_clients[client_data.id]
            client.initials = client_data.initials
            client.inn = client_data.inn
            client.org = client_data.org
            client.safety = client_data.safety
            client.reg_num = client_data.reg_num
        else:
            new_client = Client(
                initials=client_data.initials,
                inn=client_data.inn,
                org=client_data.org,
                safety=client_data.safety,
                course_group_id=course.id
            )
            db.add(new_client)


async def _process_teachers(db: AsyncSession, group: Group, teacher_ids: List[int]):
    """Обновляет связи группы с учителями"""
    current_ids = {tg.teacher_id for tg in group.teacher_groups}
    new_ids = set(teacher_ids)

    # Удаляем отсутствующих учителей
    for tg in list(group.teacher_groups):
        if tg.teacher_id not in new_ids:
            await db.delete(tg)

    # Добавляем новых учителей
    for teacher_id in new_ids - current_ids:
        # Проверяем существование учителя
        exists = await db.execute(select(Teachers).where(Teachers.id == teacher_id))
        if not exists.scalar():
            raise HTTPException(
                status_code=400,
                detail=f"Teacher with id {teacher_id} not found"
            )
        db.add(TeachersGroup(teacher_id=teacher_id, group_id=group.id))

COURSE_HOURS = {
    1: 40,
    2: 8,
    3: 16
}


def calculate_end_date(start_date: datetime, course_id: int) -> datetime:
    """Рассчитывает дату окончания курса"""
    hours = COURSE_HOURS.get(course_id, 0)
    days = hours // 8  # Каждый день равен 8 часам
    return start_date + timedelta(days=days)
