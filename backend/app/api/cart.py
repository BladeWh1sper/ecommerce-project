from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from app.schemas.cart import CartItemCreate, CartItemRead
from app.models.cart import CartItem
from app.models.product import Product
from app.db.deps import get_db
from app.core.dependencies import get_current_user
from typing import List
from app.websockets.cart_manager import manager
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.post("/", response_model=CartItemRead)
async def add_to_cart(item: CartItemCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product or product.stock < item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    cart_item = db.query(CartItem).filter_by(user_id=current_user.id, product_id=item.product_id).first()
    if cart_item:
        if product.stock < cart_item.quantity + item.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock for this quantity")
        cart_item.quantity += item.quantity
    else:
        cart_item = CartItem(user_id=current_user.id, product_id=item.product_id, quantity=item.quantity)
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    await manager.send_personal_message(current_user.email, "Cart updated")

    return cart_item


@router.get("/", response_model=List[CartItemRead])
async def get_cart(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(CartItem).filter_by(user_id=current_user.id).all()

@router.delete("/{item_id}")
async def delete_cart_item(item_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = db.query(CartItem).filter_by(id=item_id, user_id=current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()

    await manager.send_personal_message(current_user.email, "Cart updated")

    return {"ok": True}

@router.get("/", response_model=List[CartItemRead])
async def get_cart_items(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    items = db.query(CartItem).options(joinedload(CartItem.product)).filter_by(user_id=current_user.id).all()
    return items