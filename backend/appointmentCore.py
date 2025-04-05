
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from schemas import AppointmentResponse, AppointmentCreate, AppointmentGet, AppointmentGetByReference
from database import get_db
from models import Appointment
from sqlalchemy.orm import Session
from sqlalchemy import cast, String

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
    return {'message': 'Appointment created successfully', 'reference': uuid[-6:]}

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