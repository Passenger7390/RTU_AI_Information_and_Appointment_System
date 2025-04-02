from database import get_db
from auth import read_users_me
from sqlalchemy.orm import Session
from schemas import CreateProfessor, ProfessorResponse, UserBase
from fastapi import APIRouter, Depends, HTTPException, status
from models import ProfessorInformation
from uuid import uuid4

router = APIRouter(prefix='/professor', tags=['professor'])

@router.get('/get-professors', response_model=ProfessorResponse)
async def get_professors():
    """
        Get a list of names of professors

        This is for the dropdown menu in the appointment form

        This is also for the admin to view the list of professors and their information in the admin panel

    """
    # TODO: Implement /get-professors function
    return {'professors': ['Edwin Purisima', 'Christopher Zaplan', 'Dolores Cruz']}

@router.post('/add-professor')
async def add_professor(professor: CreateProfessor, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to add new professors"""

    # TODO: Working hours is none
    print("professor working hours", professor.office_hours)
    new_professor = ProfessorInformation(professor_id=uuid4(), 
                                         first_name=professor.first_name, 
                                         last_name=professor.last_name, 
                                         email=professor.email, 
                                         office_hours=professor.office_hours, 
                                         title=professor.title)
    db.add(new_professor)
    db.commit()
    db.refresh(new_professor)
    return {'message': 'Professor information added successfully'}

@router.put('/update-professor')
async def update_professor_information(db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to update the information of a professor"""
    # TODO: Implement /update-professor function
    return {'message': 'Professor information updated successfully'}

@router.delete('/delete-professor')
async def delete_professor(db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to delete the information of a professor"""
    # TODO: Implement /delete-professor function

    return {'message': 'Professor information deleted successfully'}