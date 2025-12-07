from pydantic import BaseModel, ConfigDict

class ModelBase(BaseModel):
    name: str
    age: int
    height_cm: int
    country: str

class ModelCreate(ModelBase):
    pass

class ModelOut(ModelBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
