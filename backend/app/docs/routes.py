import os
import uuid
import logging
import zipfile
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from docx import Document
from fastapi import BackgroundTasks

from backend.app.docs.cell_configs import *
from backend.app.docs.docs_utils import *
from backend.app.docs.models import PrintData, Course as CourseSchema, Group as GroupSchema, \
    CourseGroup as CourseGroupSchema, Client as ClientSchema, Teacher, DocumentRequest
from backend.app.docs.table_preparer import prepare_dict_data
from backend.app.docs.template_cofigs import TEMPLATE_CONFIGS
from backend.database import get_db
from backend.models.course_model import Courses, CourseFields
from backend.models.group_model import Group, CourseGroup, Client
from backend.models.teachers_model import TeachersGroup

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["documents"])

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("output")

async def ensure_output_dir():
    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Ошибка при создании директории: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при создании директории: {str(e)}")

@router.post("/generate-documents", response_class=FileResponse)
async def generate_documents(
        request: DocumentRequest,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks = None
):
    logger.info(f"Начало генерации документов для группы ID: {request.group_id}")
    try:
        logger.info(f"Проверка существования группы ID: {request.group_id}")
        group = await db.get(Group, request.group_id)
        if not group:
            logger.error(f"Группа ID {request.group_id} не найдена")
            raise HTTPException(status_code=404, detail="Группа не найдена")
        logger.info(f"Группа найдена: {group.id}")

        # Создаем временную директорию
        temp_dir = OUTPUT_DIR / f"temp-{uuid.uuid4()}"
        logger.info(f"Создание временной директории: {temp_dir}")
        os.makedirs(temp_dir, exist_ok=True)
        generated_files = []

        # Получаем все CourseGroup для данной группы
        logger.info(f"Поиск CourseGroup для группы ID: {request.group_id}")
        course_groups_result = await db.execute(select(CourseGroup).filter(CourseGroup.group_id == request.group_id))
        course_groups = course_groups_result.scalars().all()

        if not course_groups:
            logger.error(f"CourseGroup для группы ID {request.group_id} не найдены")
            raise HTTPException(status_code=404, detail="CourseGroup для группы не найдены")
        logger.info(f"Найдено CourseGroup: {len(course_groups)}")

        templates_for_courses = {t.course_id: t.template_ids for t in request.templates}
        logger.info(f"Запрошенные шаблоны по курсам: {templates_for_courses}")

        for course_group in course_groups:
            logger.info(f"Обработка CourseGroup ID: {course_group.id}, курс ID: {course_group.course_id}")

            # Получаем курс
            course_result = await db.execute(select(Courses).filter(Courses.id == course_group.course_id))
            course = course_result.scalars().first()
            if not course:
                logger.warning(f"Курс для CourseGroup {course_group.id} не найден, пропускаем")
                continue
            logger.info(f"Найден курс: {course.name} (ID: {course.id})")

            # Получаем поля курса
            course_fields_result = await db.execute(select(CourseFields).filter(CourseFields.course_id == course.id))
            course_fields = [field.key for field in course_fields_result.scalars().all()]
            logger.info(f"Поля курса: {course_fields}")

            # Получаем шаблоны для текущего курса (если указаны)
            templates_to_process = TEMPLATE_CONFIGS
            if course.id in templates_for_courses:
                templates_to_process = {
                    tid: TEMPLATE_CONFIGS[tid]
                    for tid in templates_for_courses[course.id]
                    if tid in TEMPLATE_CONFIGS
                }
            logger.info(f"Шаблоны для обработки (курс {course.id}): {list(templates_to_process.keys())}")

            # Проверяем каждый шаблон на совместимость с полями курса
            for template_id, template_config in templates_to_process.items():
                logger.info(f"Проверка шаблона {template_id} для CourseGroup {course_group.id}")

                required_fields = template_config["required_fields"]
                if not all(field in course_fields for field in required_fields):
                    logger.warning(f"Шаблон {template_id} не подходит для CourseGroup {course_group.id} (не хватает полей), пропускаем")
                    continue

                template_filename = f"slot{template_id.replace('template', '')}.docx"
                template_path = UPLOAD_DIR / template_filename
                logger.info(f"Поиск шаблона: {template_path}")

                if not template_path.exists():
                    logger.warning(f"Шаблон {template_filename} не найден, пропускаем")
                    continue

                # Получаем клиентов
                clients_result = await db.execute(select(Client).filter(Client.course_group_id == course_group.id))
                clients = clients_result.scalars().all()
                logger.info(f"Найдено клиентов: {len(clients)}")

                # Получаем преподавателей
                teachers_group_result = await db.execute(select(TeachersGroup).filter(TeachersGroup.group_id == group.id))
                teachers = [tg.teacher for tg in teachers_group_result.scalars().all()]
                logger.info(f"Найдено преподавателей: {len(teachers)}")

                # Формирование данных
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
                                    safety=client.safety,
                                    position=str(client.position) if client.position is not None else "-",
                                    reg_num=str(client.reg_num) if client.reg_num is not None else "-",
                                    org_inn=str(client.org_inn) if client.org_inn is not None else "-",
                                    snils=str(client.snils) if client.snils is not None else "-",
                                ) for client in clients
                            ] if clients else []
                        ),
                        teachers=[
                            Teacher(
                                id=teacher.id,
                                initials=str(teacher.initials) if teacher.initials is not None else "-",
                                status=teacher.status
                            ) for teacher in teachers
                        ] if teachers else []
                    ),
                    course=CourseSchema(
                        id=course.id,
                        name=str(course.name) if course.name is not None else "-",
                        hours=course.hours if course.hours is not None else 0,
                        fields=course_fields if course_fields else []
                    )
                )
                logger.info(f"Сформированные данные: {data}")

                # Генерация документа
                doc_filename = f"doc-group{request.group_id}-course{course_group.id}-{template_id}.docx"
                doc_path = temp_dir / doc_filename
                logger.info(f"Создание документа: {doc_path}")

                try:
                    doc = Document(template_path)

                    teachers_dict = {
                        "director": next((t.initials for t in teachers if t.status == 1), "-"),
                        "deputy": next((t.initials for t in teachers if t.status == 2), "-"),
                        "tutor": next((t.initials for t in teachers if t.status == 3), "-")
                    }

                    replacements = {
                        "{{date}}": str(data.group.date) if data.group.date else "-",
                        "{{id}}": str(data.group.id),
                        "{{name}}": str(data.course.name) if data.course.name else "-",
                        "{{hours}}": str(data.course.hours) if data.course.hours else "-",
                        "{{director}}": teachers_dict["director"],
                        "{{deputy}}": teachers_dict["deputy"],
                        "{{tutor}}": teachers_dict["tutor"]
                    }
                    replace_text_in_docx(doc, replacements)

                    # Подготовка и добавление строк в таблицу
                    table = prepare_dict_data(data)
                    add_rows_to_table(doc, table, template_config["cell_config"])

                    doc.save(doc_path)
                    generated_files.append(doc_path)
                    logger.info(f"Документ успешно сгенерирован: {doc_filename}")
                except Exception as e:
                    logger.error(f"Ошибка при генерации документа {doc_filename}: {str(e)}", exc_info=True)
                    continue

        # Если нет файлов — ошибка
        if not generated_files:
            logger.error(f"Не удалось сгенерировать ни одного документа для группы ID: {request.group_id}")
            raise HTTPException(status_code=400, detail="Не удалось сгенерировать ни одного документа")
        logger.info(f"Успешно сгенерировано документов: {len(generated_files)}")

        # Создаем ZIP-архив
        zip_filename = f"documents-group{request.group_id}.zip"
        zip_path = OUTPUT_DIR / zip_filename
        logger.info(f"Создание ZIP-архива: {zip_path}")

        try:
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for file in generated_files:
                    zipf.write(file, arcname=file.name)
            logger.info(f"ZIP-архив успешно создан: {zip_filename}")
        except Exception as e:
            logger.error(f"Ошибка при создании ZIP-архива: {str(e)}", exc_info=True)
            raise

        # Удаляем временные файлы после отправки
        background_tasks.add_task(cleanup_files, temp_dir, zip_path)
        logger.info("Задача очистки временных файлов добавлена в background_tasks")

        return FileResponse(
            zip_path,
            filename=zip_filename,
            media_type="application/zip",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Критическая ошибка при генерации документов: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

def cleanup_files(temp_dir: Path, zip_path: Path):
    """Удаляет временные файлы и архив после отправки."""
    try:
        for file in temp_dir.glob("*"):
            os.remove(file)
        os.rmdir(temp_dir)
        if zip_path.exists():
            os.remove(zip_path)
    except Exception as e:
        logger.error(f"Ошибка при очистке: {e}")