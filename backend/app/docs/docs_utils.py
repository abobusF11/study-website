from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from docx.shared import Pt


def replace_text_in_docx(doc, old_text, new_text):
    for paragraph in doc.paragraphs:
        if old_text in paragraph.text:
            paragraph.text = paragraph.text.replace(old_text, new_text)

def add_rows_to_table(doc, input_data, cell_config):
    table = doc.tables[0]

    # Удаляем все строки, кроме первой (заголовок)
    while len(table.rows) > 1:
        table._tbl.remove(table.rows[1]._tr)

    for index, data in enumerate(input_data, start=1):
        row = table.add_row()

        # Заполняем ячейки согласно конфигурации
        for idx, config in enumerate(cell_config):
            cell = row.cells[idx]

            # Заполняем содержимое ячейки
            if config["type"] == "index":
                cell.text = str(index)
            elif config["type"] == "data":
                cell.text = str(data.get(config["key"], ""))  # Безопасное получение данных
            elif config["type"] == "static":
                cell.text = str(config.get("value", ""))

            # Форматируем ячейку
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
                for run in paragraph.runs:
                    run.font.size = Pt(11)
                    # Устанавливаем курсив на основе конфигурации
                    run.font.italic = (config.get("style") == "italic")

FIELD_NAME_MAPPING = {
    "initials": "ФИО",
    "inn": "ИНН",
    "org": "Наименование предприятия",
    "safety": "Группа по безопасности",
    "reg_num": "Регистрационный номер",
    "position": "Занимаемая должность"
}
def get_field_display_name(field: str) -> str:
    return FIELD_NAME_MAPPING.get(field, field)
