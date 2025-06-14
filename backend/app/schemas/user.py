from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    customer = "customer"
    admin = "admin"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.customer

class UserRead(BaseModel):
    id: int
    email: EmailStr
    role: UserRole

    class Config:
        orm_mode = True
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str
