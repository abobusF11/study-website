from datetime import date
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.exc import IntegrityError

from backend.models import TeachersGroup
from backend.models.group_model import Group, Client, CourseGroup
from .schemas import GroupCreate, GroupUpdate, GroupResponse, CourseResponse, ClientResponse, TeacherResponse
from .utils import COURSE_HOURS, calculate_end_date, _process_courses, _process_teachers


class GroupRepository:
    @staticmethod
    async def create_group(db: AsyncSession, group_data: GroupCreate) :
        group = Group(date=group_data.date, isOrder=group_data.isOrder)
        db.add(group)
        await db.flush()

        if group_data.teachers:
            for teacher_id in group_data.teachers:
                staff = TeachersGroup(teacher_id=teacher_id, group_id=group.id)
                db.add(staff)

        for course in group_data.courseGroups:
            course_group = CourseGroup(course_id=course.course_id, group_id=group.id)
            db.add(course_group)
            await db.flush()

            for client in course.clients:
                client_record = Client(
                    initials=client.initials,
                    inn=client.inn,
                    org=client.org,
                    safety=client.safety,
                    reg_num=client.reg_num,
                    course_group_id=course_group.id,
                    position=client.position,
                    org_inn=client.org_inn,
                    snils=client.snils
                )
                db.add(client_record)

        await db.commit()

        result = await db.execute(
            select(Group)
            .where(Group.id == group.id)
            .options(
                selectinload(Group.courses)
                .selectinload(CourseGroup.clients),
                selectinload(Group.courses)
                .selectinload(CourseGroup.course_info),
                selectinload(Group.teacher_groups)
                .selectinload(TeachersGroup.teacher)
            )
        )
        group = result.scalars().first()

        if not group:
            raise HTTPException(status_code=404, detail="Group not found after creation")

        return GroupResponse(
            id=group.id,
            date=group.date,
            isOrder=group.isOrder,
            courseGroups=[
                CourseResponse(
                    id=course.id,
                    course_id=course.course_id if hasattr(course, 'course_id') else None,
                    clients=sorted([
                        ClientResponse(
                            id=client.id,
                            initials=client.initials,
                            inn=client.inn,
                            org=client.org,
                            safety=client.safety,
                            reg_num=client.reg_num,
                            position=client.position,
                            org_inn=client.org_inn,
                            snils=client.snils
                        )
                        for client in course.clients
                    ], key=lambda x: x.initials)
                )
                for course in group.courses
            ],
            teachers=[
                TeacherResponse(
                    id=teacher_group.teacher.id,
                    initials=teacher_group.teacher.initials,
                    status=teacher_group.teacher.status
                )
                for teacher_group in group.teacher_groups
                if teacher_group.teacher
            ]
        )

    @staticmethod
    async def get_groups(
            db: AsyncSession,
            date_filter: str = "active"
    ):
        query = select(Group)

        if date_filter == "from-user":
            query = select(Group).where(Group.isOrder == True)
        elif date_filter == "active":
            query = select(Group).where(Group.isOrder == False)
        elif date_filter == "archive":
            query = select(Group).where(Group.isOrder == False)

        query = query.options(
            joinedload(Group.courses)
            .joinedload(CourseGroup.clients),
            joinedload(Group.teacher_groups)
            .joinedload(TeachersGroup.teacher)
        )

        query = query.order_by(Group.date.desc())

        result = await db.execute(query)
        groups = result.unique().scalars().all()

        # Если фильтр "from-user", сразу возвращаем результаты без проверки дат
        if date_filter == "from-user":
            return [
                GroupResponse(
                    id=group.id,
                    date=group.date,
                    isOrder=group.isOrder,
                    courseGroups=[
                        CourseResponse(
                            id=course.id,
                            course_id=course.course_id if hasattr(course, 'course_id') else None,
                            clients=sorted([
                                ClientResponse(
                                    id=client.id,
                                    initials=client.initials,
                                    inn=client.inn,
                                    org=client.org,
                                    safety=client.safety,
                                    reg_num=client.reg_num,
                                    position=client.position,
                                    org_inn=client.org_inn,
                                    snils=client.snils
                                )
                                for client in course.clients
                            ], key=lambda x: x.initials)
                        )
                        for course in group.courses
                    ],
                    teachers=[
                        TeacherResponse(
                            id=teacher_group.teacher.id,
                            initials=teacher_group.teacher.initials,
                            status=teacher_group.teacher.status
                        )
                        for teacher_group in group.teacher_groups
                        if teacher_group.teacher
                    ]
                )
                for group in groups
            ]

        current_date = date.today()
        filtered_groups = []

        for group in groups:
            max_hours_course = max(
                group.courses,
                key=lambda c: COURSE_HOURS.get(c.course_id, 0),
                default=None
            )

            if max_hours_course:
                end_date = calculate_end_date(group.date, max_hours_course.course_id)
                if not date_filter:
                    filtered_groups.append(group)
                elif date_filter == "active" and end_date >= current_date:
                    filtered_groups.append(group)
                elif date_filter == "archive" and end_date < current_date:
                    filtered_groups.append(group)

        return [
            GroupResponse(
                id=group.id,
                date=group.date,
                isOrder=group.isOrder,
                courseGroups=[
                    CourseResponse(
                        id=course.id,
                        course_id=course.course_id if hasattr(course, 'course_id') else None,
                        clients=sorted([
                            ClientResponse(
                                id=client.id,
                                initials=client.initials,
                                inn=client.inn,
                                org=client.org,
                                safety=client.safety,
                                reg_num=client.reg_num,
                                position=client.position,
                                org_inn=client.org_inn,
                                snils=client.snils
                            )
                            for client in course.clients
                        ], key=lambda x: x.initials)
                    )
                    for course in group.courses
                ],
                teachers=[
                    TeacherResponse(
                        id=teacher_group.teacher.id,
                        initials=teacher_group.teacher.initials,
                        status=teacher_group.teacher.status
                    )
                    for teacher_group in group.teacher_groups
                    if teacher_group.teacher
                ]
            )
            for group in filtered_groups
        ]

    @staticmethod
    async def update_group(db: AsyncSession, group_update: GroupUpdate):
        try:
            group = await db.execute(
                select(Group)
                .where(Group.id == group_update.id)
                .options(
                    joinedload(Group.courses)
                    .joinedload(CourseGroup.clients),
                    joinedload(Group.teacher_groups)
                )
            )
            group = group.scalars().first()

            if not group:
                raise ValueError("Group not found")

            group.date = group_update.date
            group.isOrder = group_update.isOrder
            await _process_courses(db, group, group_update.courseGroups)
            await _process_teachers(db, group, group_update.teachers)

            await db.commit()
            await db.refresh(group)

            return GroupResponse(
                id=group.id,
                date=group.date,
                isOrder=group.isOrder,
                courseGroups=[
                    CourseResponse(
                        id=course.id,
                        course_id=course.course_id if hasattr(course, 'course_id') else None,
                        clients=sorted([
                            ClientResponse(
                                id=client.id,
                                initials=client.initials,
                                inn=client.inn,
                                org=client.org,
                                safety=client.safety,
                                reg_num=client.reg_num,
                                position=client.position,
                                org_inn=client.org_inn,
                                snils=client.snils
                            )
                            for client in course.clients
                        ], key=lambda x: x.initials)
                    )
                    for course in group.courses
                ],
                teachers=[
                    TeacherResponse(
                        id=teacher_group.teacher.id,
                        initials=teacher_group.teacher.initials,
                        status=teacher_group.teacher.status
                    )
                    for teacher_group in group.teacher_groups
                    if teacher_group.teacher
                ]
            )

        except IntegrityError as e:
            if "unique constraint" in str(e).lower():
                raise ValueError("Duplicate data violation")
            raise ValueError("Database integrity error")

    @staticmethod
    async def delete_group(db: AsyncSession, group_id: int) -> dict:
        group = await db.execute(select(Group).where(Group.id == group_id))
        group = group.scalar_one_or_none()

        if not group:
            raise ValueError("Group not found")

        await db.delete(group)
        await db.commit()

        return {"message": f"Group {group_id} and all its clients were deleted"}