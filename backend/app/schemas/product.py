from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductRead(ProductCreate):
    id: int

    class Config:
        from_attributes = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None