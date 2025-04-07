
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from otp import get_gmail_service
from schemas import AppointmentResponse, AppointmentCreate, AppointmentGet, AppointmentGetByReference
from database import get_db
from models import Appointment, ProfessorInformation
from sqlalchemy.orm import Session
from sqlalchemy import cast, String
import base64

from googleapiclient.errors import HttpError

from email.message import EmailMessage

router = APIRouter(prefix='/appointment', tags=['appointment'])


# ===============================================Appointment Information===================================================

@router.post('/create-appointment')
async def create_apointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    """Kiosk users Create an appointment"""

    formattedStartTime = convert_time_format(appointment.start_time)
    formattedEndTime = convert_time_format(appointment.end_time)
    
    new_appointment = Appointment(
        uuid=uuid4(),
        student_name=appointment.student_name,
        student_id=appointment.student_id,
        student_email=appointment.student_email,
        professor_uuid=appointment.professor_uuid,
        concern=appointment.concern,
        start_time=formattedStartTime,
        end_time=formattedEndTime,
        status='pending'
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    uuid = str(new_appointment.uuid) # This will give the last 6 digits of uuid to users for reference

    professor = db.query(ProfessorInformation.email,
                         ProfessorInformation.first_name,
                         ProfessorInformation.last_name,
                         ProfessorInformation.title
                        ).filter(ProfessorInformation.professor_id == appointment.professor_uuid).first()
    try:
        service = get_gmail_service()

        messageForStudent = EmailMessage()
        messageForProfessor = EmailMessage()

        # Create email content
        messageForStudent.set_content(f"Dear {appointment.student_name},\n\n"
                                      f"Good day!\n\n"
                                      f"Your appointment with {f"{professor.title} {professor.first_name} {professor.last_name}"} has been created.\n"
                                      f"You can view your appointment in our kiosk using the reference number.\n\n"
                                      f"Reference Number: {uuid[-6:]}\n\n"
                                      f"We also notified {f"{professor.title} {professor.first_name} {professor.last_name}"} about your appointment.\n\n")
        
        messageForProfessor.set_content(f"Dear {f"{professor.title} {professor.first_name} {professor.last_name}"},\n\n"
                                      f"Good day!\n\n"
                                      f"{appointment.student_name} made an appointment request to you. Please see the appointment information in the kiosk admin page.\n"
                                      f"Confirm the appointment in the admin page once you are okay with it. Confirmation is required to finalize the appointment.\n\n"
                                      f"Thank you!\n\n")

        messageForStudent["To"] = appointment.student_email
        messageForStudent["From"] = "2021-101043@rtu.edu.ph"
        messageForStudent["Subject"] = "Your Appointment has been created"

        messageForProfessor["To"] = professor.email
        messageForProfessor["From"] = "2021-101043@rtu.edu.ph"
        messageForProfessor["Subject"] = f"{appointment.student_name} has created an appointment"

        # Encode and send message
        encoded_student_message = base64.urlsafe_b64encode(messageForStudent.as_bytes()).decode()
        encoded_professor_message = base64.urlsafe_b64encode(messageForProfessor.as_bytes()).decode()

        create_message_for_student = {"raw": encoded_student_message}
        create_message_for_professor = {"raw": encoded_professor_message}

        send_message_for_student = (
            service.users()
            .messages()
            .send(userId="me", body=create_message_for_student)
            .execute()
        )

        service.users()\
        .messages()\
        .send(userId="me", body=create_message_for_professor)\
        .execute()

        return {'message': 'Appointment created successfully', 'reference': uuid[-6:], "message_id": send_message_for_student["id"], "status": "sent"}
    except HttpError as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.get('/get-appointment', response_model=AppointmentResponse)
async def get_appointment(appointment_uuid: AppointmentGet, db: Session = Depends(get_db)):
    """Get a appointment information depending on the uid provided by the user"""
    query = db.query(Appointment).filter(Appointment.uuid == appointment_uuid.uuid).first()
    if query is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return AppointmentResponse(id=query.id, uuid=query.uuid, student_name=query.student_name, professor_name=query.professor_name, start_time=query.start_time, end_time=query.end_time, status=query.status)


@router.get('/get-appointment-by-reference', response_model=AppointmentResponse)
async def get_appointment_by_reference(appointment_reference: AppointmentGetByReference, db: Session = Depends(get_db)):
    """Get a appointment information depending on the reference provided by the user"""
    query = db.query(Appointment).filter(cast(Appointment.uuid, String).like(f"%{appointment_reference.reference}")).first()
    if query is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return AppointmentResponse(id=query.id, uuid=query.uuid, student_name=query.student_name, professor_name=query.professor_name, start_time=query.start_time, end_time=query.end_time, status=query.status)

# TODO: Get the schedule of the professors so that the user can see the available time slots and can't schedule appointment in the same time slot

def convert_time_format(datetime_str: str):
    """
        Convert datetime string to datetime object

        Converts 2025-10-10 10:00 AM -> 2025-10-10 10:00:00
    """

    return datetime.strptime(datetime_str, '%Y-%m-%d %I:%M %p')