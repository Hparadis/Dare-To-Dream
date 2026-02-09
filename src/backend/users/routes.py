# src/backend/users/routes.py
from flask import Blueprint, request, jsonify
from firebase_admin import firestore

users_bp = Blueprint("users", __name__, url_prefix="/api/users")
db = firestore.client()


def _get_profile_for_user(user_id):
    user_doc = db.collection("Users").document(user_id).get()
    if user_doc.exists:
        profile = user_doc.to_dict()
        profile["userId"] = user_id
        return profile
    survey_doc = db.collection("Surveys").document(user_id).get()
    if survey_doc.exists:
        profile = survey_doc.to_dict()
        profile["userId"] = user_id
        return profile
    return {"userId": user_id}


@users_bp.route("/batch", methods=["POST"])
def get_users_batch():
    data = request.json or {}
    user_ids = data.get("userIds", [])
    profiles = []
    for uid in user_ids:
        profiles.append(_get_profile_for_user(uid))
    return jsonify({"profiles": profiles})
