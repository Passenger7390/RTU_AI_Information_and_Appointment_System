from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from starlette import status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from models import User
from database import get_db, db_dependency
import jwt
import bcrypt
import os
from schemas import Token, UserBase, CreateUser


load_dotenv()   # Load environment variables

router = APIRouter(prefix="/auth", tags=["auth"]) # Create a router for authentication

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv('SECRET_KEY'), algorithm=os.getenv('ALGORITHM'))
    return encoded_jwt

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=15))
    return Token(access_token=access_token, token_type="bearer")

@router.get("/users/me", response_model=UserBase)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=os.getenv('ALGORITHM'))
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if user is None:    
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return UserBase(username=username)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: CreateUser, db: db_dependency):
    # Generate a salt and hash the user's password
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(user.password.encode('utf-8'), salt)
    # Optionally decode the hash to a string if needed for your database
    hashed_password = hashed_bytes.decode('utf-8')
    
    create_user_model = User(
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(create_user_model)
    db.commit()

user_dependency = Annotated[dict, Depends(read_users_me)]
