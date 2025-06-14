from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from fastapi import HTTPException

def create_order_from_cart(db: Session, user: User) -> Order:
    cart_items = db.query(CartItem).filter(CartItem.user_id == user.id).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_price = 0

    
    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for product '{item.product.name}'"
            )
        total_price += item.product.price * item.quantity

    
    order = Order(user_id=user.id, total_price=total_price, status="pending")
    db.add(order)
    db.flush()

    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)
        item.product.stock -= item.quantity

    db.query(CartItem).filter(CartItem.user_id == user.id).delete()

    db.commit()
    db.refresh(order)
    return order