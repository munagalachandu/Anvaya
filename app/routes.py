from flask import Blueprint, request, jsonify
from models import User, Event, db, student_achievements
import datetime
import jwt
from config import Config
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
load_dotenv()
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

auth_bp = Blueprint('auth', __name__)
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'}

def verify_token(token):
    try:
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
        decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Missing JSON data"}), 400

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if not role:
        return jsonify({"success": False, "message": "Role is required"}), 400
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email, role=role).first()

    if user and user.password == password:
        expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        token = jwt.encode(
            {"user_id": user.id, "role": user.role, "exp": expiration_time},
            Config.SECRET_KEY, 
            algorithm="HS256"
        )
        
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        
        return jsonify({
            "success": True,
            "token": token,
            "user": {
                "email": user.email,
                "role": user.role,
                "name": user.name,
                "id": user.id
            }
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid email, password, or role"
        }), 401

@auth_bp.route('/fac_events/<int:facultyid>', methods=['GET'])
def get_events(facultyid):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401
    
    decoded_token = verify_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401
    
    events = Event.query.filter_by(user_id=facultyid).all()
    events_data = []
    
    for e in events:
        events_data.append({
            "id": e.event_id,
            "title": e.event_name,
            "date": e.start_date.strftime('%Y-%m-%d') if e.start_date else "",  
            "venue": e.venue,
            "status": e.status, 
            "participants": e.number_of_participants or 0 
        })
    
    return jsonify(events_data), 200

@auth_bp.route('/fac_add_events/<int:facultyid>', methods=['POST'])
def add_event(facultyid):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401

    decoded_token = verify_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    try:
        title = data.get('title')
        category = data.get('category')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        venue = data.get('venue')
        description = data.get('description')
        guest_name = data.get('guest_name')  
        guest_contact = data.get('guest_contact')
        session_details = data.get('session_details')

        if not all([title, category, start_date, end_date, venue, description]):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

        new_event = Event(
            event_name=title,
            user_id=facultyid,
            category=category,
            start_date=start_date,
            end_date=end_date,
            venue=venue,
            description=description,
            guest_name=guest_name,
            guest_contact=guest_contact,
            session_details=session_details,
            status="Upcoming",  
            number_of_participants=0  
        )

        db.session.add(new_event)
        db.session.commit()

        return jsonify({"success": True, "message": "Event added successfully"}), 201

    except Exception as e:
        print("Error adding event:", e)
        db.session.rollback() 
        return jsonify({"success": False, "error": "Failed to add event"}), 500

@auth_bp.route('/student_achievements/<int:studentid>', methods=['GET'])
def get_achievements(studentid):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401
    
    decoded_token = verify_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401
    
    try:
        stu_achievement = student_achievements.query.filter_by(user_id=studentid).all()
        achievements_data = []
        for e in stu_achievement:
            achievements_data.append({
                "id": e.achievement_id,
                "event_name": e.achievement_name,
                "certificate": e.achievement_certificate,
                "placement": e.placement,
                "date": e.date.strftime('%Y-%m-%d') if e.date else "",
                "venue": e.venue,
                "verification": e.verification,
            })
        
        return jsonify(achievements_data), 200
    except Exception as e:
        print(f"Error getting achievements: {e}")
        return jsonify({"error": "Failed to retrieve achievements data"}), 500 

@auth_bp.route('/student_add_achievement/<int:studentid>', methods=['POST'])
def add_achievement(studentid):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401

    decoded_token = verify_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401

    try:
        # Get form data fields
        event_name = request.form.get('event_name')
        event_date = request.form.get('event_date')
        venue = request.form.get('venue')
        placement = request.form.get('placement')
        
        # Get certificate file
        certificate_file = request.files.get('certificate')
        
        

        if not all([event_name, event_date, venue, certificate_file]):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            event_date = datetime.datetime.strptime(event_date, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Upload file to Cloudinary
        try:
            filename = certificate_file.filename
            ext = os.path.splitext(filename)[1].lower()

            resource_type = "image" if ext in IMAGE_EXTENSIONS else "raw"

            upload_result = cloudinary.uploader.upload(
                certificate_file,
                folder="student_certificates",
                resource_type=resource_type
            )
            
            # Get secure URL from the upload response
            certificate_url = upload_result.get('secure_url')
            
            if not certificate_url:
                return jsonify({"error": "Failed to upload certificate to Cloudinary"}), 500
                
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            return jsonify({"error": "Failed to upload certificate to cloud storage"}), 500

        # Create new achievement record with the Cloudinary URL
        new_achievement = student_achievements(
            user_id=studentid,
            achievement_name=event_name,
            date=event_date,
            venue=venue,
            placement=placement,
            achievement_certificate=certificate_url,
            verification="Pending"
        )

        db.session.add(new_achievement)
        db.session.commit()

        return jsonify({"success": True, "message": "Achievement added successfully"}), 201

    except Exception as e:
        print("Error adding achievement:", e)
        db.session.rollback()
        return jsonify({"success": False, "error": f"Failed to add achievement: {str(e)}"}), 500

@auth_bp.route('/student_events_verify/<int:teacherid>', methods=['GET'])
def get_student_events(teacherid):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401
    
    decoded_token = verify_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401
    
    events = student_achievements.query.all()
    events_data = []
    
    for e in events:
        user = User.query.get(e.user_id)
        events_data.append({
            "id": e.achievement_id,
            "name": user.name if user else "Unknown",
            "title": e.achievement_name,
            "certificate": e.achievement_certificate,
            "placement": e.placement,
            "verification": e.verification,
        })
    
    return jsonify(events_data), 200
    
@auth_bp.route('/verify_participation/<int:achievement_id>', methods=['POST'])
def verify_participation(achievement_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401
    
    decoded_token = verify_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401
    
    if decoded_token.get('role') != 'faculty':
        return jsonify({"error": "Unauthorized. Only faculty can verify achievements"}), 403
    
    try:
        achievement = student_achievements.query.get(achievement_id)
        
        if not achievement:
            return jsonify({"error": "Achievement not found"}), 404
        
        achievement.verification = "Verified"
        db.session.commit()
        
        return jsonify({
            "success": True, 
            "message": "Achievement verified successfully",
            "achievement_id": achievement_id
        }), 200
        
    except Exception as e:
        print(f"Error verifying achievement: {e}")
        db.session.rollback()
        return jsonify({"error": "Failed to verify achievement"}), 500