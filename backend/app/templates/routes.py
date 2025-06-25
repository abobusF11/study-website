from fastapi import UploadFile, File, HTTPException, APIRouter, Form
from fastapi.responses import FileResponse
import os
from pathlib import Path

router = APIRouter(tags=["Templates"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_file(
        slot_id: str = Form(...),
        file: UploadFile = File(...)
):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Файл не загружен")

        # Извлекаем расширение файла
        file_extension = Path(file.filename).suffix
        # Формируем имя файла как slot_id.расширение
        file_name = f"{slot_id}{file_extension}"
        file_path = UPLOAD_DIR / file_name
        file_size = file.size

        # Сохраняем файл
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        return {
            "status": "success",
            "file_size": file_size,
            "file_url": f"/templates/{file_name}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при загрузке файла: {str(e)}")

@router.get("/{filename}")
async def get_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Файл не найден")
    return FileResponse(file_path)

@router.delete("/{filename}")
async def delete_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Файл не найден")
    os.remove(file_path)
    return {"status": "success"}

@router.get("/")
async def get_all_files():
    try:
        if not UPLOAD_DIR.exists():
            return {"files": []}

        files = []
        for file_path in UPLOAD_DIR.iterdir():
            stat = file_path.stat()
            file_name = file_path.name
            slot_id = file_name.split('.')[0]  # Извлекаем slot_id (все до точки)
            file_extension = file_path.suffix

            files.append({
                "slot_id": slot_id,
                "name": file_name,  # Имя файла (slot_id.расширение)
                "size": stat.st_size,
                "url": f"/templates/{file_name}"
            })

        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении списка файлов: {str(e)}")