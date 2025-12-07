from typing import Optional

from pydantic import BaseModel


class ModelCreate(BaseModel):
    name: str
    age: int
    height_cm: int
    country: str


class ModelResponse(BaseModel):
    id: int
    name: str
    age: int
    height_cm: int
    country: str
    status: str

    class Config:
        orm_mode = True


class ModelContactResponse(BaseModel):
    model: ModelResponse
    chat_id: int
