from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, relationship
from typing import List

from app.models.order import Order
from app.models.product import Product
from app.models.cart import CartItem

from app.schemas.order import OrderRead
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.schemas.cart import CartItemRead

from app.db.deps import get_db
from app.core.dependencies import get_current_admin
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.get("/orders", response_model=List[OrderRead])
def get_all_orders(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    orders = db.query(Order).options(joinedload(Order.user)).all()

    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "status": order.status,
            "total_price": order.total_price,
            "user_email": order.user.email if order.user else None
        })
    return result


@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    _tablename__ = "orders"
    order = db.query(Order).filter_by(id=order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    return {"ok": True}


@router.get("/carts", response_model=List[CartItemRead])
def get_all_carts(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    items = db.query(CartItem)\
              .options(joinedload(CartItem.product), joinedload(CartItem.user))\
              .all()
    return items


@router.post("/products", response_model=ProductRead)
def create_product(product: ProductCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"ok": True}


@router.patch("/products/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.get("/products/{product_id}", response_model=ProductRead)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
