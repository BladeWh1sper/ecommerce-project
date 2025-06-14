from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductRead
from typing import List

router = APIRouter()

# @router.post("/", response_model=ProductRead)
# def create_product(product: ProductCreate, db: Session = Depends(get_db)):
#     db_product = Product(**product.dict())
#     db.add(db_product)
#     db.commit()
#     db.refresh(db_product)
#     return db_product

@router.get("/", response_model=List[ProductRead])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
