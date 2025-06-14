from sqlalchemy import Column, Integer, String, Enum
from app.db.database import Base
import enum

class UserRole(enum.Enum):
    customer = "customer"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.customer)
