
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user, read_users_me
from otp import get_gmail_service
from schemas import AppointmentResponse, AppointmentCreate, AppointmentResponseForTable, AppointmentUpdate, UserBase
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
        status='Pending'
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
    

@router.get('/get-appointments', response_model=List[AppointmentResponseForTable])
async def get_appointment(db: Session = Depends(get_db), current_user: UserBase = Depends(get_current_user)):
    """Get a appointment information depending on the uid provided by the user"""
    appointments = db.query(Appointment).all()
    appointments_list = []
    for appointment in appointments:
        professor = db.query(ProfessorInformation.first_name, 
                             ProfessorInformation.last_name, 
                             ProfessorInformation.title,
                             ProfessorInformation.professor_id)\
                        .filter(ProfessorInformation.professor_id == appointment.professor_uuid).first()
        professor_name = f"{professor.title} {professor.first_name} {professor.last_name}"
        appointments_list.append(AppointmentResponseForTable(
                            uuid=str(appointment.uuid), 
                            student_name=appointment.student_name, 
                            student_id=appointment.student_id,
                            student_email=appointment.student_email,
                            professor_name=professor_name, 
                            start_time=format_iso_date(appointment.start_time),
                            end_time=format_iso_date(appointment.end_time),
                            status=appointment.status,
                            professor_id=professor.professor_id))
        
    return appointments_list


@router.get('/get-appointment-by-reference/{appointment_reference}', response_model=AppointmentResponse)
async def get_appointment_by_reference(appointment_reference: str, db: Session = Depends(get_db)):
    """Get a appointment information depending on the reference provided by the user"""
    query = db.query(Appointment).filter(cast(Appointment.uuid, String).like(f"%{appointment_reference}")).first()
    if query is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    professor = db.query(ProfessorInformation.first_name, 
                         ProfessorInformation.last_name, 
                         ProfessorInformation.title)\
                    .filter(ProfessorInformation.professor_id == query.professor_uuid).first()
    
    professor_name = f"{professor.title} {professor.first_name} {professor.last_name}"
    return AppointmentResponse(id=query.id, uuid=str(query.uuid), student_name=query.student_name, student_id=query.student_id, student_email=query.student_email, professor_name=professor_name, start_time=format_iso_date(query.start_time), end_time=format_iso_date(query.end_time), status=query.status)

@router.put('/action-appointment/{appointment_reference}')
async def action_appointment(appointment_reference: str, action: AppointmentUpdate, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """Accept or reject an appointment"""
    appointment = db.query(Appointment).filter(Appointment.uuid == appointment_reference).first()
    professor = db.query(ProfessorInformation.title,
                         ProfessorInformation.first_name,
                         ProfessorInformation.last_name
                         )\
                         .filter(ProfessorInformation.professor_id == appointment.professor_uuid).first()
    
    appointment_details = {
        "student_name": appointment.student_name,
        "student_email": appointment.student_email,
        "professor_name": f"{professor.title} {professor.first_name} {professor.last_name}", 
        "uuid": str(appointment.uuid)[-6:],
        "date": format_iso_date(appointment.start_time).split(' ')[0],
        "start_time": format_iso_date(appointment.start_time).split(' ')[1],
        "end_time": format_iso_date(appointment.end_time).split(' ')[1],

    }

    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if action.status == 'accept':
        appointment.status = 'Accepted'
        await send_email(action.status, appointment_details)
    elif action.status == 'reject':
        appointment.status = 'Rejected'
        await send_email(action.status, appointment_details)
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    db.refresh(appointment)
    
    return {'message': f'Appointment {action}ed successfully', 'status': appointment.status}

@router.get('/professor-appointments/{professor_id}/{date}')
async def get_professor_appointments(professor_id: str, date: str, db: Session = Depends(get_db)):
    """Get all appointments for a professor on a specific date"""
    
    # Format the date for query comparison (add time bounds for the full day)
    date_start = f"{date} 00:00:00"
    date_end = f"{date} 23:59:59"
    print("This is executed")
    appointments = db.query(Appointment).filter(
        Appointment.professor_uuid == professor_id,
        Appointment.start_time >= date_start,
        Appointment.start_time <= date_end,
        Appointment.status.in_(["Pending", "Accepted"])  # Only consider pending or accepted appointments
    ).all()
    
    result = []
    for appointment in appointments:
        start_time = format_iso_date(appointment.start_time)
        end_time = format_iso_date(appointment.end_time)
        
        # Extract just the time portion for the frontend
        start_time_only = start_time.split(' ')[1]
        end_time_only = end_time.split(' ')[1]
        
        result.append({
            "start_time": start_time_only,
            "end_time": end_time_only
        })
    
    return result

async def send_email(status: str, appointment_details: dict):
    """Send email to the user"""
    print(f"status: {status}")
    try:
        service = get_gmail_service()
        confirmationEmail = EmailMessage()

        if status == "accept":
            # Acceptance email template
        
            confirmationEmail.set_content(f"Dear {appointment_details['student_name']},\n\n"
                                          f"Good day!\n"
                                          f"We're pleased to inform you that {appointment_details["professor_name"]} has accepted your appointment request.\n\n"
                                          f"Appointment Details:\n"
                                          f"- Date: {appointment_details['date']}\n"
                                          f"- Time: {appointment_details['start_time']} to {appointment_details['end_time']}\n"
                                          f"- Reference Number: {appointment_details['uuid']}\n\n"
                                          f"Please arrive 5 minutes before your scheduled time. If you need to reschedule or cancel, please do so at least 24 hours in advance.\n\n"
                                          f"Thank you for using our appointment system.\n\n"
                                          f"Best regards,\n"
                                          f"RTU Kiosk Appointment System")
            confirmationEmail["Subject"] = "Appointment Accepted - Reference #" + appointment_details['uuid']
            
        elif status == "reject":
            # Rejection email template
            confirmationEmail.set_content(f"Dear {appointment_details['student_name']},\n\n"
                                        f"Good day!\n"
                                        f"We regret to inform you that {appointment_details["professor_name"]} is unable to accommodate your appointment request at the requested time.\n\n"
                                        f"Your Reference Number: {appointment_details['uuid']}\n\n"
                                        f"This could be due to scheduling conflicts or prior commitments. You are welcome to schedule a new appointment at a different time that might better fit the professor's schedule.\n\n"
                                        f"If you have any urgent matters to discuss, you may email the professor directly or visit during their regular office hours.\n\n"
                                        f"Thank you for your understanding.\n\n"
                                        f"Best regards,\n"
                                        f"RTU Kiosk Appointment System")
            confirmationEmail["Subject"] = "Appointment Request Update - Reference #" + appointment_details['uuid']
            
        confirmationEmail["To"] = appointment_details['student_email']
        confirmationEmail["From"] = "2021-101043@rtu.edu.ph"
        
        # Encode and send message
        encoded_message = base64.urlsafe_b64encode(confirmationEmail.as_bytes()).decode()
        create_message = {"raw": encoded_message}
        

        send_message = (
            service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
        
        return {"message": send_message["id"], "status": status}
    except HttpError as error:
        raise HTTPException(status_code=500, detail=str(error))

def format_iso_date(date_value):
    """
    Convert ISO format date string to a readable format
    
    Converts any ISO format (2025-04-11T21:00:00+00:00 or 2025-04-11T07:30:00Z)
    to clean format: 2025-04-11 07:30:00
    """
    if not isinstance(date_value, str):
        date_value = str(date_value)
    
    # First replace T with space
    date_value = date_value.replace('T', ' ')
    
    # Remove timezone offset (+00:00 or -00:00)
    if '+' in date_value:
        date_value = date_value.split('+')[0]
    elif '-' in date_value[10:]:  # Only check for - after the date part
        date_value = date_value.split('-', 1)[0]
    
    # Remove Z if present
    date_value = date_value.replace('Z', '')
    
    # Remove any trailing or leading spaces
    return date_value.strip()

def convert_time_format(datetime_str: str):
    """
         Convert datetime string to datetime object
 
         Converts 2025-10-10 10:00 AM -> 2025-10-10 10:00:00
    """
 
    return datetime.strptime(datetime_str, '%Y-%m-%d %I:%M %p')