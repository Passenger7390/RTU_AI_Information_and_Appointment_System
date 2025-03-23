import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import AppointmentResponse, AppointmentRequest
from database import get_db
from models import Appointment
from sqlalchemy.orm import Session

router = APIRouter(prefix='/appointment', tags=['appointment'])


# ===============================================Appointment Information===================================================

@router.post('/create-appointment')
async def create_apointment(appointment: AppointmentRequest, db: Session = Depends(get_db)):
    """Kiosk users Create an appointment"""
    new_appointment = Appointment(
        uuid=uuid.uuid4(),
        student_name=appointment.student_name,
        student_id=appointment.student_id,
        student_email=appointment.student_email,
        professor_name=appointment.professor_name,
        start_time=datetime.strptime(appointment.start_time, '%Y-%m-%d %H:%M:%S'),
        end_time=datetime.strptime(appointment.end_time, '%Y-%m-%d %H:%M:%S'),
        status='pending'
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return {'message': f"{appointment.student_name} created an appointment with {appointment.professor_name}"}
    # return {'message': 'Appointment created successfully'}

@router.get('/get-appointment')
async def get_appointment():
    """Get a appointment information depending on the uid provided by the user"""
    return {'appointments'}
