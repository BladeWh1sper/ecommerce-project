from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    total_price: float

class OrderRead(BaseModel):
    id: int
    status: OrderStatus
    total_price: float
    user_email: Optional[str]

    class Config:
        from_attributes = True
