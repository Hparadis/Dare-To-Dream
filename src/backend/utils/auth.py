# src/backend/utils/auth.py
import firebase_admin
from functools import wraps
from flask import request, jsonify
from firebase_admin import auth


def decode_firebase_token(id_token: str) -> dict:
    return auth.verify_id_token(id_token)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization required"}), 401
        # TODO: validate token properly here
        return f(*args, **kwargs)
    return decorated

def verify_firebase_token():
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Invalid token format"}), 401
            id_token = auth_header.split(" ")[1]

            try:
                decoded_token = auth.verify_id_token(id_token)
                request.user_id = decoded_token.get("uid")  # attach user_id to request
            except Exception as e:
                return jsonify({"error": "Unauthorized", "details": str(e)}), 401
            return f(*args, **kwargs)
        return wrapper
    return decorator


def get_user_id_from_auth_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        id_token = auth_header.split(" ")[1]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token.get("uid")
    return None
