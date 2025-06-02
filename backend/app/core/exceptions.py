from fastapi import HTTPException

class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(self.detail)

class EntityNotFound(AppException):
    def __init__(self, entity: str, entity_id: int):
        super().__init__(404, f"{entity} with id {entity_id} not found")