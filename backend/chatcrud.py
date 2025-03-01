from sqlalchemy.orm import Session
from models import FAQ
from schemas import FAQCreate

def get_all_faqs(db: Session):
    return db.query(FAQ).all()

def get_faq_by_question(db: Session, question: str):
    return db.query(FAQ).filter(FAQ.question.ilike(question)).first()

def create_faq(db: Session, faq: FAQCreate):
    db_faq = FAQ(question=faq.question.strip(), answer=faq.answer.strip())
    db.add(db_faq)
    db.commit()
    db.refresh(db_faq)
    return db_faq