from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.order import OrderRead
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.product import Product
from app.db.deps import get_db
from app.core.dependencies import get_current_user
from typing import List

router = APIRouter()

@router.post("/", response_model=OrderRead)
def create_order(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    items = db.query(CartItem).filter_by(user_id=current_user.id).all()
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    
    total_price = 0
    for item in items:
        product = db.query(Product).filter_by(id=item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")
        total_price += product.price * item.quantity

    try:
        new_order = Order(user_id=current_user.id, total_price=total_price, status="pending")
        db.add(new_order)
        db.flush()

        for item in items:
            product = db.query(Product).filter_by(id=item.product_id).first()
            product.stock -= item.quantity
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price
            )
            db.add(order_item)
            db.delete(item)

        db.commit()
        db.refresh(new_order)
        return new_order

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error processing order")

@router.get("/", response_model=List[OrderRead])
def get_orders(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    orders = db.query(Order).filter_by(user_id=current_user.id).all()

    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "status": order.status,
            "total_price": order.total_price,
            "user_email": current_user.email
        })

    return result
