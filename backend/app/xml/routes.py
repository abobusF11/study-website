from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from datetime import date
from xml.etree import ElementTree as ET
from xml.dom import minidom

from backend.database import get_db
from backend.models import Group, CourseGroup, TeachersGroup

router = APIRouter(tags=["XML Export"])

def safe_xml_text(value, default=""):
    """Безопасное преобразование значения в текст для XML"""
    if value is None:
        return default
    return str(value).strip() or default

def prettify_xml(elem):
    """Возвращает красиво отформатированную XML строку"""
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

@router.get("/{group_id}", response_class=PlainTextResponse)
async def generate_registry_xml(
        group_id: int,
        db: Session = Depends(get_db)
):
    # Создаем корневой элемент XML
    registry_set = ET.Element("RegistrySet")

    # Получаем группу с связанными данными
    stmt = select(Group).where(Group.id == group_id).options(
        joinedload(Group.courses).joinedload(CourseGroup.clients),
        joinedload(Group.courses).joinedload(CourseGroup.course_info),
        joinedload(Group.teacher_groups).joinedload(TeachersGroup.teacher)
    )
    result = await db.execute(stmt)
    group = result.scalars().first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Для каждого курса в группе создаем отдельную запись
    for course_group in group.courses:
        if not course_group.course_info:
            continue  # Пропускаем если нет информации о курсе

        course = course_group.course_info

        for client in course_group.clients:
            # Создаем запись реестра
            record = ET.SubElement(registry_set, "RegistryRecord")

            # Добавляем информацию о работнике
            worker = ET.SubElement(record, "Worker")

            # Обработка ФИО
            initials = safe_xml_text(client.initials)
            initials_parts = initials.split(maxsplit=2) if initials else []
            last_name = initials_parts[0] if len(initials_parts) > 0 else ""
            first_name = initials_parts[1] if len(initials_parts) > 1 else ""
            middle_name = initials_parts[2] if len(initials_parts) > 2 else ""

            ET.SubElement(worker, "LastName").text = last_name
            ET.SubElement(worker, "FirstName").text = first_name
            ET.SubElement(worker, "MiddleName").text = middle_name
            ET.SubElement(worker, "Snils").text = safe_xml_text(client.snils)
            ET.SubElement(worker, "Position").text = safe_xml_text(client.position)
            ET.SubElement(worker, "EmployerInn").text = safe_xml_text(client.inn)
            ET.SubElement(worker, "EmployerTitle").text = safe_xml_text(client.org)

            # Добавляем информацию об организации
            organization = ET.SubElement(record, "Organization")
            ET.SubElement(organization, "Inn").text = safe_xml_text(client.org_inn)
            ET.SubElement(organization, "Title").text = "Ваш учебный центр"

            # Добавляем информацию о тесте/курсе
            test_attrs = {"isPassed": "true"}
            if course.id:
                test_attrs["learnProgramId"] = str(course.id)

            test = ET.SubElement(record, "Test", **test_attrs)

            test_date = group.date.isoformat() if group.date else date.today().isoformat()
            ET.SubElement(test, "Date").text = test_date

            protocol_num = safe_xml_text(client.reg_num, "1")
            ET.SubElement(test, "ProtocolNumber").text = protocol_num

            course_name = safe_xml_text(course.name)
            ET.SubElement(test, "LearnProgramTitle").text = course_name

    # Форматируем XML
    xml_str = prettify_xml(registry_set)

    return PlainTextResponse(content=xml_str, media_type="application/xml")