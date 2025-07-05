# src/backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, initialize_app, firestore
import os

# Initialize db as None initially
db = None

# --- CRITICAL: Use relative imports for blueprints ---
# These imports assume app.py is part of the 'backend' package.
# This requires src/backend/__init__.py to exist.
from .survey_routes import survey_bp
from .groups_routes import groups_bp
from .communities_routes import communities_bp
from src.backend.groups import grouping_bp
from .ai_routes import ai_bp
# --- END relative imports ---

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

if not firebase_admin._apps:
    try:
        if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            cred = credentials.ApplicationDefault()
            print("Using Application Default Credentials.")
        else:
            # Construct path to credentials relative to this app.py file
            current_dir = os.path.dirname(__file__)
            credentials_path = os.path.join(current_dir, "firebase_credentials.json")
            print(f"App.py: Attempting to load credentials from: {credentials_path}")
            cred = credentials.Certificate(credentials_path)

            print("Using firebase_credentials.json.")

        initialize_app(cred)
        db = firestore.client()
        print("Firebase Admin SDK initialized successfully.")
    except FileNotFoundError:
        print(f"App.py Error: 'firebase_credentials.json' not found at {credentials_path}. Please ensure it's in the src/backend directory.")
        exit(1)
    except Exception as e:
        print(f"App.py Error: Failed to initialize Firebase Admin SDK: {e}")
        exit(1)
else:
    db = firestore.client()


# Register blueprints
app.register_blueprint(survey_bp, url_prefix='/')
app.register_blueprint(grouping_bp, url_prefix='/groups')
app.register_blueprint(communities_bp, url_prefix='/communities')
app.register_blueprint(ai_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Welcome to the backend API! Server is running."

@app.route('/api/track', methods=['POST'])
def track_data():
    try:
        data = request.get_json()
        print("Tracking data received:", data)
        return jsonify({"status": "success", "message": "Data tracked successfully."}), 200
    except Exception as e:
        print(f"Error tracking data: {e}")
        return jsonify({"status": "error", "message": f"Failed to track data: {str(e)}"}), 500


if __name__ == '__main__':
    # When app.py is run directly (e.g., via `python -m src.backend.app`),
    # this block will execute and start the Flask development server.
    app.run(debug=True, port=5000)
