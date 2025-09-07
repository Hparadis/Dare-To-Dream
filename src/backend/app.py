#src/backend/app.py
from flask import Flask
from flask_cors import CORS
from flask import Flask
from src.backend.survey.routes import survey_bp
from src.backend.friends.routes import friends_bp
from src.backend.groups.routes import groups_bp
from src.backend.chats.routes import chats_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
app.register_blueprint(survey_bp)
app.register_blueprint(friends_bp)
app.register_blueprint(groups_bp)
app.register_blueprint(chats_bp)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
