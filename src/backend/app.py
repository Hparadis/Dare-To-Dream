import os

from flask import Flask
from flask_cors import CORS
from src.backend.survey.routes import survey_bp
from src.backend.friends.routes import friends_bp
from src.backend.groups.routes import groups_bp
from src.backend.chats.routes import chats_bp
from src.backend.communities.routes import communities_bp
from src.backend.users.routes import users_bp
from src.backend.matching.routes import matching_bp

app = Flask(__name__)

cors_origins = os.getenv("CORS_ORIGINS", "")
if cors_origins.strip():
    allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://192.168.1.68:5173",
        os.getenv("FRONTEND_ORIGIN", "").strip(),
    ]
    allowed_origins = [origin for origin in allowed_origins if origin]

CORS(app, resources={r"/*": {"origins": allowed_origins}})
app.register_blueprint(survey_bp)
app.register_blueprint(friends_bp)
app.register_blueprint(groups_bp, url_prefix="/api/groups")
app.register_blueprint(chats_bp)
app.register_blueprint(communities_bp, url_prefix="/api/communities")
app.register_blueprint(users_bp)
app.register_blueprint(matching_bp)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=False)
