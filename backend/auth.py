import base64
from datetime import datetime, timedelta
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status, APIRouter
from starlette import status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from otp import create_otp_secret, get_gmail_service
from models import ProfessorInformation, User
from database import get_db, db_dependency
import jwt
import bcrypt
import os
from schemas import OTPRequest, Token, UserBase, CreateUser
from uuid import UUID, uuid4
import pyotp
from email.message import EmailMessage


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
    access_token = create_access_token(
        data={
            "sub": user.username,
            "role": user.role,
            "id": user.id,
            # "professor_id": user.professor_id
        }, 
        expires_delta=timedelta(minutes=15)
    )
    return Token(access_token=access_token, token_type="bearer")


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
    
    return UserBase(
        username=user.username,
        role=user.role,
        id=user.id,
        professor_id=user.professor_id
    )


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: CreateUser, db: Session = Depends(db_dependency)):
    return await register(user, db)

async def register(user: CreateUser, db: db_dependency, professor_uuid: Optional[UUID] = None):
    # Generate a salt and hash the user's password
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(user.password.encode('utf-8'), salt)
    # Optionally decode the hash to a string if needed for your database
    hashed_password = hashed_bytes.decode('utf-8')
    
    create_user_model = User(
        username=user.username,
        hashed_password=hashed_password,
        role=user.role,
        professor_id=professor_uuid
    )
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)
    return {'msg': 'User Created Successfully'}

@router.post("/reset-password")
async def resetPassword(request: OTPRequest, db: db_dependency):
    user = db.query(ProfessorInformation).filter(ProfessorInformation.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret, interval=300, digits=6)
    otp_code = totp.now()

    create_otp_secret(request.email, secret, db)

    try:
        service = get_gmail_service()
        message = EmailMessage()

         # Create email content
        message.set_content(f"THIS IS A TEST! Your verification code is: {otp_code}\n\nThis code will expire in 5 minutes.")

        message["To"] = request.email
        message["From"] = "2021-101043@rtu.edu.ph"
        message["Subject"] = "Your Verification Code to reset your password"

        # Encode and send message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {"raw": encoded_message}

        # TODO: Uncomment this after testing
        # TODO: Make sure to delete the tests in contents in email
        
        # send_message = (
        #     service.users()
        #     .messages()
        #     .send(userId="me", body=create_message)
        #     .execute()
        # )
        # return {"message_id": send_message["id"], "status": "sent", "otp": otp_code}
        return {"status": "sent", "otp": otp_code}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create Gmail service")

# Role-based Dependencies for Authentication
@router.get("/users/me", response_model=UserBase)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    
    return UserBase(
        username=user.username,
        role=user.role,
        id=user.id,
        professor_id=user.professor_id
    )

def superuser_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "superuser":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    return current_user

def professor_or_superuser_required(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["professor", "superuser"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    return current_user

user_dependency = Annotated[dict, Depends(get_current_user)]
