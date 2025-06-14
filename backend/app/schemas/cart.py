from pydantic import BaseModel
from app.schemas.product import ProductRead
from app.schemas.user import UserRead

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class CartItemRead(CartItemCreate):
    id: int
    product: ProductRead
    quantity: int
    user: UserRead 
    
    class Config:
        from_attributes = True
