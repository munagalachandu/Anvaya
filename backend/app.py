from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MySQL database configuration - update these with your credentials
db_config = {
    'host': 'localhost',
    'user': 'root',      # <-- your MySQL username
    'password': 'root',  # <-- your MySQL password
    'database': 'anvaya'   # <-- your MySQL database name
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def create_users_table():
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to database. Cannot create table.")
        return

    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    try:
        cursor = conn.cursor()
        cursor.execute(create_table_query)
        conn.commit()
        print("Users table created or already exists.")
    except Error as e:
        print(f"Error creating users table: {e}")
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Missing JSON data"}), 400

    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"success": False, "message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE email = %s AND role = %s"
        cursor.execute(query, (email, role))
        user = cursor.fetchone()
    except Error as e:
        print(f"Database query error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500
    finally:
        cursor.close()
        conn.close()

    # Plain text password check (for demo only)
    if user and user['password'] == password:
        return jsonify({
            "success": True,
            "message": f"Welcome back, {role}!",
            "user": {
                "email": user['email'],
                "role": user['role'],
                "name": user['name']
            }
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid email, password, or role"
        }), 401

if __name__ == '__main__':
    create_users_table()
    app.run(debug=True)