import os.path
import os
import base64
from datetime import datetime
import asyncio
import logging
import pyotp

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from email.message import EmailMessage
from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from models import OTPSecret
from database import create_session, db_connect, get_db
from schemas import OTPRequest, OTPVerify

router = APIRouter(prefix="/otp", tags=["gmail"])
session = create_session(db_connect()[0])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

def get_gmail_service():
    """
        Shows basic usage of the Gmail API.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_console()
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    service = build("gmail", "v1", credentials=creds)
    return service

  # try:
  #   # Call the Gmail API
  #   service = build("gmail", "v1", credentials=creds)
  #   results = service.users().labels().list(userId="me").execute()
  #   labels = results.get("labels", [])

  #   if not labels:
  #     print("No labels found.")
  #     return
  #   print("Labels:")
  #   for label in labels:
  #     print(label["name"])

  # except HttpError as error:
  #   # TODO(developer) - Handle errors from gmail API.
  #   print(f"An error occurred: {error}")

@router.post("/send-otp")
async def send_otp(request: OTPRequest, db: Session = Depends(get_db)):
    """
        Send OTP to the specified email address
    """

    email = request.email

    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret, interval=300, digits=6)
    otp_code = totp.now()
    
    create_otp_secret(email, secret, db)

    try:
        service = get_gmail_service()
        message = EmailMessage()

        # Create email content
        message.set_content(f"Your verification code is: {otp_code}\n\nThis code will expire in 5 minutes.")

        message["To"] = email
        message["From"] = "jaycyivanbanaga@gmail.com"
        message["Subject"] = "Your Verification Code"

        # Encode and send message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {"raw": encoded_message}
        
        send_message = (
            service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
        return {"message_id": send_message["id"], "status": "sent", "otp": otp_code}
    except HttpError as error:
        raise HTTPException(status_code=500, detail=str(error))
    
@router.post("/verify-otp")
async def verify_otp(request: OTPVerify, db: Session = Depends(get_db)):
    """
        Verify the OTP sent to the specified email address
    """
    email = request.email
    provided_otp = request.otp

    otp_record = get_otp_secret(email, db)
    print(f"otp_record: ", otp_record)
    # TODO: There is a bug in delete, can't verify otp
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP not found or expired")
    
    if otp_record.is_used == True:
        raise HTTPException(status_code=400, detail="OTP already used")
    
    if otp_record.is_expired():
        raise HTTPException(status_code=400, detail="OTP expired")
    
    totp = pyotp.TOTP(otp_record.secret, interval=300, digits=6)
    if totp.verify(provided_otp):
        # Mark as used
        mark_otp_used(db, email)
        return {"message": "OTP verification successful"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
def create_otp_secret(email: str, secret: str, db: Session = Depends(get_db)):
    """This function will create otp when the user request for it"""

    db.query(OTPSecret).filter(OTPSecret.email == email).delete()
    db.commit()
    
    # Create new OTP
    otp_secret = OTPSecret.create(email, secret)
    db.add(otp_secret)
    db.commit()
    db.refresh(otp_secret)

    return otp_secret


def get_otp_secret(email: str, db: Session):
    return db.query(OTPSecret).filter(OTPSecret.email == email).first()


def mark_otp_used(db: Session, email: str):
    """THis function will"""
    otp_secret = get_otp_secret(db, email)
    if otp_secret:
        otp_secret.is_used = True
        db.commit()
        return True
    return False

    
async def delete_expired_and_used_otp(db: Session):   # Delete expired otp
    now = datetime.now()
    expired_otp = db.query(OTPSecret).filter(OTPSecret.expires_at < now).all()

    for otp in expired_otp:
        db.delete(otp)
    
    used_otp = db.query(OTPSecret).filter(OTPSecret.is_used == True).all()

    for otp in used_otp:
        db.delete(otp)
    
    db.commit()
    return {"message": f"Deleted {len(expired_otp)} expired OTPs and {len(used_otp)} used OTPs"}

async def cleanup_expired_otp():
    while True:
        with session as db:
            logging.info(f"Deleting expired OTPs at {datetime.now()}")
            await delete_expired_and_used_otp(db)
        await asyncio.sleep(30)  # Run every 30 seconds
