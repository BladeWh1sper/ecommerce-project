from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserRead, Token
from app.schemas.user import Token
from app.schemas.user import UserLogin
from app.repositories import user_repository
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.db.deps import get_db

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_repository.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = user_repository.create_user(db, user_create.email, user_create.password, user_create.role)
    return user

@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = user_repository.get_user_by_email(db, user_login.email)
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return Token(access_token=access_token)

