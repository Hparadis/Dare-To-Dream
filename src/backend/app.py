#src/backend/app.py
from flask import Flask
from flask_cors import CORS
from flask import Flask
from src.backend.survey.routes import survey_bp
from src.backend.friends.routes import friends_bp
from src.backend.groups.routes import groups_bp
from src.backend.chats.routes import chats_bp
from src.backend.communities.routes import communities_bp
from src.backend.users.routes import users_bp
from src.backend.app import app



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://192.168.1.68:5173"]}})
app.register_blueprint(survey_bp)
app.register_blueprint(friends_bp)
app.register_blueprint(groups_bp, url_prefix="/api/groups")
app.register_blueprint(chats_bp)
app.register_blueprint(communities_bp, url_prefix="/api/communities")
app.register_blueprint(users_bp)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
