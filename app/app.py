from flask import Flask
from flask_cors import CORS  # Import CORS
from config import Config
from models import db
from routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for the entire app
CORS(app)  # This will allow all domains. You can configure it for specific domains if needed.

db.init_app(app)

with app.app_context():
    db.create_all()  # Create database tables

app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)