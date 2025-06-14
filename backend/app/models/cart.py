from sqlalchemy import Column, Integer, ForeignKey
from app.db.database import Base
from sqlalchemy.orm import relationship

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    product = relationship("Product")
    user = relationship("User")