# src/backend/utils/auth.py
from functools import wraps
from flask import request, jsonify
from firebase_admin import auth as firebase_auth

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization required"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            decoded = firebase_auth.verify_id_token(token)
            # attach for routes:
            request.user = decoded            # full decoded token
            request.user_id = decoded.get("uid")
        except Exception as e:
            return jsonify({"error": "Invalid token", "details": str(e)}), 401
        return f(*args, **kwargs)
    return wrapper

def get_user_id_from_auth_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ", 1)[1]
            decoded = firebase_auth.verify_id_token(token)
            return decoded.get("uid")
        except Exception:
            return None
    return None
