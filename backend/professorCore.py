from database import get_db
from auth import read_users_me
from sqlalchemy.orm import Session
from schemas import CreateProfessor, ProfessorResponse, UserBase
from fastapi import APIRouter, Depends, HTTPException, status
import uuid

router = APIRouter(prefix='/professor', tags=['professor'])

@router.get('/get-professors', response_model=ProfessorResponse)
async def get_professors():
    """
        Get a list of names of professors

        This is for the dropdown menu in the appointment form

        This is also for the admin to view the list of professors and their information in the admin panel

    """

    return {'professors': ['Edwin Purisima', 'Christopher Zaplan', 'Dolores Cruz']}

@router.post('/add-professor')
async def add_professor(db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to add new professors"""
    return {'message': 'Professor information added successfully'}

@router.put('/update-professor')
async def update_professor_information(db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to update the information of a professor"""
    return {'message': 'Professor information updated successfully'}

@router.delete('/delete-professor')
async def delete_professor(db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to delete the information of a professor"""
    return {'message': 'Professor information deleted successfully'}