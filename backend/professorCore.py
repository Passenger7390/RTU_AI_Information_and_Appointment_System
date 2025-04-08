from typing import List
from database import get_db
from auth import read_users_me
from sqlalchemy.orm import Session
from schemas import CreateProfessor, UpdateProfessor, UserBase, DeleteProfessors
from fastapi import APIRouter, Depends, HTTPException, status
from models import ProfessorInformation
from uuid import uuid4

router = APIRouter(prefix='/professor', tags=['professor'])

@router.get('/get-professors')
async def get_professors(db: Session = Depends(get_db)):
    """
        Get a list of names of professors

        This is for the dropdown menu in the appointment form

        This is also for the admin to view the list of professors and their information in the admin panel

    """

    professors = db.query(ProfessorInformation).all()
    professors_list = []
    for professor in professors:
        professors_list.append({
            'id': professor.id,
            'professor_id': professor.professor_id,
            'name': f"{professor.title} {professor.first_name} {professor.last_name}",
            'email': professor.email,
            'office_hours': professor.office_hours,
        })
    return professors_list

@router.get('/get-professor/{professor_id}', response_model=CreateProfessor)
async def getProfessorById(professor_id: str, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """
        Get a professor by id

        This is for the admin to view the information of a professor in the admin panel

    """
    if not professor_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No professor id provided")
    professor = db.query(ProfessorInformation).filter(ProfessorInformation.professor_id == professor_id).first()

    return professor

@router.post('/add-professor')
async def add_professor(professor: CreateProfessor, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to add new professors"""

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

@router.put('/update-professor/{professor_uuid}')
async def update_professor_information(professor_uuid: str, updated_data: UpdateProfessor, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to update the information of a professor"""

    print("hello")
    if not professor_uuid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No professor id provided")
    
    professor = db.query(ProfessorInformation).filter(ProfessorInformation.professor_id == professor_uuid).first()
    if not professor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Professor not found")
    
    for field, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(professor, field, value)

    db.commit()
    db.refresh(professor)

    return {'message': 'Professor information updated successfully'}

@router.delete('/delete-professor')
async def delete_professor(professor_id: DeleteProfessors, db: Session = Depends(get_db), current_user: UserBase = Depends(read_users_me)):
    """This allows the admin to delete the information of a professor"""

    if not professor_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No professor id provided")

    professors = db.query(ProfessorInformation).filter(ProfessorInformation.professor_id.in_(professor_id.ids)).all()
    for professor in professors:
        db.delete(professor)
    db.commit()
    return {'message': 'Professor information deleted successfully'}