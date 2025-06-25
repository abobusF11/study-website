import os
import uuid
import logging
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from docx import Document

from backend.app.docs.cell_configs import *
from backend.app.docs.docs_utils import *
from backend.app.docs.models import PrintData, Course as CourseSchema, Group as GroupSchema, CourseGroup as CourseGroupSchema, Client as ClientSchema
from backend.app.docs.table_preparer import prepare_dict_data
from backend.database import get_db
from backend.models.course_model import Courses, CourseFields
from backend.models.group_model import Group, CourseGroup, Client
from backend.models.teachers_model import TeachersGroup

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["documents"])

# Папки для шаблонов и выходных файлов
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("output")

# Маппинг шаблонов и их конфигураций
TEMPLATE_CONFIGS = {
    "template1": {
        "required_fields": ["initials", "org", "position", "safety"],
        "cell_config": cell_config_1
    },
    "template2": {
        "required_fields": ["initials", "org", "position"],
        "cell_config": cell_config_2
    },
    "template3": {
        "required_fields": ["initials", "org", "position", "reg_num"],
        "cell_config": cell_config_3
    }
}

# Создание директории для выходных файлов
async def ensure_output_dir():
    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Ошибка при создании директории: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при создании директории: {str(e)}")

# Схема для запроса
class DocumentRequest(BaseModel):
    templateId: str
    groupId: int

@router.post("/generate-document", response_class=FileResponse)
async def generate_document(request: DocumentRequest, db: AsyncSession = Depends(get_db)):
    output_file_created = False
    output_path = None
    try:
        logger.info(f"Генерация документа для templateId={request.templateId}, groupId={request.groupId}")

        # Проверка существования шаблона
        if request.templateId not in TEMPLATE_CONFIGS:
            raise HTTPException(status_code=400, detail="Недопустимый ID шаблона")

        template_config = TEMPLATE_CONFIGS[request.templateId]
        template_filename = f"slot{request.templateId.replace('template', '')}.docx"
        template_path = UPLOAD_DIR / template_filename

        if not template_path.exists():
            raise HTTPException(status_code=404, detail=f"Шаблон {template_filename} не найден в папке uploads")

        # Получение данных из базы
        logger.debug("Запрос группы")
        group_result = await db.execute(select(Group).filter(Group.id == request.groupId))
        group = group_result.scalars().first()
        if not group:
            raise HTTPException(status_code=404, detail="Группа не найдена")

        logger.debug("Запрос CourseGroup")
        course_group_result = await db.execute(select(CourseGroup).filter(CourseGroup.group_id == request.groupId))
        course_group = course_group_result.scalars().first()
        if not course_group:
            raise HTTPException(status_code=404, detail="CourseGroup не найдена")

        logger.debug("Запрос курса")
        course_result = await db.execute(select(Courses).filter(Courses.id == course_group.course_id))
        course = course_result.scalars().first()
        if not course:
            raise HTTPException(status_code=404, detail="Курс не найден")

        logger.debug("Запрос полей курса")
        course_fields_result = await db.execute(select(CourseFields).filter(CourseFields.course_id == course.id))
        course_fields = [field.key for field in course_fields_result.scalars().all()]

        # Проверка полей
        required_fields = template_config["required_fields"]
        if not all(field in course_fields for field in required_fields):
            raise HTTPException(status_code=400, detail="Не все требуемые поля доступны для курса")

        logger.debug("Запрос клиентов")
        clients_result = await db.execute(select(Client).filter(Client.course_group_id == course_group.id))
        clients = clients_result.scalars().all()

        logger.debug("Запрос преподавателей")
        teachers_group_result = await db.execute(select(TeachersGroup).filter(TeachersGroup.group_id == group.id))
        teachers = [tg.teacher for tg in teachers_group_result.scalars().all()]

        # Формирование данных
        logger.debug("Формирование PrintData")
        data = PrintData(
            group=GroupSchema(
                id=group.id,
                date=group.date.isoformat() if group.date else "-",
                isOrder=group.isOrder if group.isOrder is not None else False,
                courseGroups=CourseGroupSchema(
                    id=course_group.id,
                    course_id=course_group.course_id,
                    clients=[
                        ClientSchema(
                            id=client.id,
                            initials=str(client.initials) if client.initials is not None else "-",
                            org=str(client.org) if client.org is not None else "-",
                            inn=str(client.inn) if client.inn is not None else "-",
                            safety=str(client.safety) if client.safety is not None else "-",
                            position=str(client.position) if client.position is not None else "-",
                            reg_num=str(client.reg_num) if client.reg_num is not None else "-"
                        ) for client in clients
                    ] if clients else []
                ),
                teachers=[teacher.id for teacher in teachers] if teachers else []
            ),
            course=CourseSchema(
                id=course.id,
                name=str(course.name) if course.name is not None else "-",
                hours=course.hours if course.hours is not None else 0,
                fields=course_fields if course_fields else []
            )
        )

        logger.debug(f"PrintData сформированы: {data.dict()}")

        # Генерация документа
        logger.debug("Генерация документа")
        await ensure_output_dir()
        output_filename = f"output-{uuid.uuid4()}.docx"
        output_path = OUTPUT_DIR / output_filename

        logger.debug("Подготовка таблицы")
        table = prepare_dict_data(data)
        logger.debug(f"Таблица данных: {table}")

        logger.debug("Создание документа")
        doc = Document(template_path)
        if not doc.tables:
            logger.error("В шаблоне отсутствует таблица")
            raise HTTPException(status_code=400, detail="В шаблоне отсутствует таблица")

        logger.debug("Замена текста")
        replace_text_in_docx(doc, "{{date}}", str(data.group.date) if data.group.date is not None else "-")
        replace_text_in_docx(doc, "{{id}}", str(data.group.id))
        replace_text_in_docx(doc, "{{name}}", str(data.course.name) if data.course.name is not None else "-")
        replace_text_in_docx(doc, "{{hours}}", str(data.course.hours) if data.course.hours is not None else "-")
        logger.debug("Добавление строк в таблицу")
        add_rows_to_table(doc, table, template_config["cell_config"])
        logger.debug(f"Сохранение документа: {output_path}")
        doc.save(output_path)
        output_file_created = True

        logger.info(f"Документ сгенерирован: {output_filename}")
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={output_filename}"}
        )

    except Exception as e:
        logger.error(f"Ошибка при генерации документа: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Ошибка при генерации документа: {str(e)}")

    finally:
        if output_file_created and output_path and output_path.exists():
            try:
                os.remove(output_path)
                logger.debug(f"Временный файл удален: {output_path}")
            except Exception as e:
                logger.error(f"Ошибка при удалении временного файла: {str(e)}")