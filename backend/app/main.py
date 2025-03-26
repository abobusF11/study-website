from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

fake_db = []

@app.get("/items/")
def read_items():
    return fake_db

@app.post("/items/")
def create_item(item: Item):
    fake_db.append(item)
    return {"message": "Item created", "item": item}