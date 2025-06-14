from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, Float
from sqlalchemy.orm import relationship
from app.db.database import Base
from datetime import datetime
import enum

class OrderStatus(enum.Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    total_price = Column(Float, nullable=False)
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    user = relationship("User")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
