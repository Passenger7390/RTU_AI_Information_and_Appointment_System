from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from pydantic import BaseModel
from jose import JWTError, jwt
from starlette import status
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from models import User
from database import get_db
import os

load_dotenv()   # Load environment variables

router = APIRouter(prefix="/auth", tags=["auth"]) # Create a router for authentication

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")    # Responsible for hashing passwords
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

class CreateUser(BaseModel):    # Create User model
    username: str
    password: str

class Token(BaseModel): # Token model
    access_token: str
    token_type: str

db_dependency = Annotated[Session, Depends(get_db)] # DB dependency injection

# Register function
# @router.post("/register", status_code=status.HTTP_201_CREATED) # Register route
# async def register(user: CreateUser, db: db_dependency):
#     create_user_model = User(username=user.username, 
#                              hashed_password=bcrypt_context.hash(user.password))    # Create user model
#     db.add(create_user_model)   # Add user to database e.g. git add create_user_model
#     db.commit() # Commit changes

@router.post("/token", response_model=Token) # Token Route / gives token
async def login_access_token(form_data: Annotated[OAuth2PasswordRequestForm,Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)    # Authenticate user

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")    # Raise exception if user is not authenticated
    token = create_token(user.username, user.id, timedelta(minutes=15))    # Create token

    return {"access_token" : token, "token_type" : "bearer"}    # Return token

def authenticate_user(username: str, password: str, db: db_dependency):
    user = db.query(User).filter(User.username==username).first()   # if match, will get the first result
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):   # get the users hashed password and compare the inputted password
        return False
    return user

def create_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub" : username, "id" : user_id, "exp" : datetime.now() + expires_delta}   # Encode the token
    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))    # Encode the token with the secret key and algorithm
    # encode has the data of the user and the expiration time of the token

async def getCurrentUser(token: Annotated[str, Depends(oauth2_bearer)]):    # get current user / Verify token
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), os.getenv("ALGORITHM"))    # Decode the token
        username = payload.get("sub")   # Get the username from the token
        user_id = payload.get("id") # Get the user id from the token

        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")
            # Raise exception if token is invalid

        return {"username" : username, "id" : user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")



