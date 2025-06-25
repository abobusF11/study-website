import logging
from backend.app.docs.docs_utils import get_field_display_name
from backend.app.docs.models import PrintData
from typing import List, Dict

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def prepare_dict_data(data: PrintData) -> List[Dict[str, str]]:
    logger.debug("Начало подготовки данных для таблицы")
    group = data.group
    course = data.course

    clients = group.courseGroups.clients if isinstance(group.courseGroups.clients, list) else [group.courseGroups.clients] if group.courseGroups.clients else []
    logger.debug(f"Клиенты: {[client.dict() for client in clients]}")

    result = []
    fields = course.fields if course.fields else []
    logger.debug(f"Поля курса: {fields}")

    for client in clients:
        client_dict = {}
        logger.debug(f"Обработка клиента: {client.dict()}")

        for field in fields:
            try:
                value = getattr(client, field, None)
                logger.debug(f"Поле {field}: {value}")

                if value is None:
                    value = "-"
                elif field == "safety":
                    try:
                        value = int(value) if value else None
                        match value:
                            case 1:
                                value = "I группа"
                            case 2:
                                value = "II группа"
                            case 3:
                                value = "III группа"
                            case _:
                                value = str(value)
                    except (ValueError, TypeError):
                        value = str(value) if value else "-"

                key = get_field_display_name(field)
                client_dict[key] = str(value)
                logger.debug(f"Добавлено в словарь: {key} = {client_dict[key]}")
            except Exception as e:
                logger.error(f"Ошибка при обработке поля {field}: {str(e)}")
                client_dict[field] = "-"

        result.append(client_dict)

    logger.debug(f"Результат подготовки данных: {result}")
    return result