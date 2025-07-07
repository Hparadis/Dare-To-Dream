# src/backend/friends_routes.py
from flask import Blueprint, request, jsonify
from friends.routes import friends_bp

# Register the friends blueprint
friends_routes = Blueprint('friends_routes', __name__)
friends_routes.register_blueprint(friends_bp, url_prefix='/friends')
