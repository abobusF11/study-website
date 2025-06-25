from backend.app.docs.docs_utils import get_field_display_name
from backend.app.docs.models import PrintData
from typing import List, Dict

def prepare_dict_data(data: PrintData) -> List[Dict[str, str]]:
    group = data.group
    course = data.course

    clients = group.courseGroups.clients if isinstance(group.courseGroups.clients, list) else [
        group.courseGroups.clients]

    result = []

    for client in clients:
        client_dict = {}

        for field in course.fields:
            value = getattr(client, field, "")

            if field == "safety":
                match value:
                    case 1:
                        value = "I группа"
                    case 2:
                        value = "II группа"
                    case 3:
                        value = "III группа"

            key = get_field_display_name(field)
            client_dict[key] = str(value) if value is not None else ""

        result.append(client_dict)

    return result
