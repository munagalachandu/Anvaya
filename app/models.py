from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from datetime import date
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(Enum('student', 'faculty', 'admin', name='user_roles'), default='student', nullable=False)

class Event(db.Model):
    __tablename__ = 'events'
    
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_name=db.Column(db.String(100),nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User')
    category = db.Column(Enum('Cultural', 'Technical', 'Sports', 'Workshops', name='event_categories'), nullable=False)
    status = db.Column(Enum('Planning', 'Upcoming', 'Live', 'Ended', name='event_status'), default='planning', nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)  
    venue = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)  
    guest_name = db.Column(db.String(255), nullable=True)
    guest_contact = db.Column(db.String(100), nullable=True)
    session_details = db.Column(db.Text, nullable=True)
    number_of_participants = db.Column(db.Integer, default=0)

class student_achievements(db.Model):
    __tablename__ = 'Achievements'

    achievement_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    achievement_name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User')  # Access student name as user.name
    date = db.Column(db.Date, nullable=True)
    venue = db.Column(db.String(255), nullable=True)
    placement = db.Column(db.Text, nullable=True)
    verification = db.Column(Enum('Verified', 'Pending','Rejected'))
    achievement_certificate = db.Column(db.String(300), nullable=False)



