# src/backend/groups/routes.py
from flask import Blueprint, request, jsonify
from src.backend.utils.auth import verify_firebase_token
from .services import create_group_service, fetch_groups_for_user_service
from src.config.firebase import db
from firebase_admin import firestore
from src.backend.utils.auth import require_auth

groups_bp = Blueprint("groups", __name__)


db = firestore.client()

@groups_bp.route("/groups/create", methods=["POST"])
@verify_firebase_token()
def create_group_route():
    data = request.json
    name = data.get("name")
    description = data.get("description")
    tags = data.get("tags", [])
    created_by = data.get("userId")

    if not name or not created_by:
        return jsonify({"error": "Missing required fields"}), 400

    group_id = create_group_service(name, description, tags, created_by)
    return jsonify({"groupId": group_id}), 201

@groups_bp.route("/groups/user", methods=["GET"])
@verify_firebase_token()
def get_user_groups():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    groups = fetch_groups_for_user_service(user_id)
    return jsonify(groups), 200
@groups_bp.route("/test-create-group", methods=["POST"])
def test_create_group():
    group_ref = db.collection("Groups").document()
    group_ref.set({
        "name": "Mindful Warriors",
        "description": "A supportive space for mental health growth",
        "createdBy": "test_user",
        "members": ["test_user"],
        "createdAt": firestore.SERVER_TIMESTAMP,
        "tags": ["mental health", "growth"]
    })
    return jsonify({"id": group_ref.id, "message": "Group created"})



@groups_bp.route("/recommend", methods=["GET"])
@require_auth
def recommend_groups():
    user_id = request.user["uid"]
    survey_doc = db.collection("Surveys").document(user_id).get()
    if not survey_doc.exists:
        return jsonify({"groups": []}), 200

    survey = survey_doc.to_dict()
    problem = survey.get("problem")
    cause = survey.get("cause")

    # Your smart logic to match tags to groups
    matched_groups = []
    for group in db.collection("Groups").stream():
        data = group.to_dict()
        if problem in data.get("tags", []) or cause in data.get("tags", []):
            data["id"] = group.id
            matched_groups.append(data)

    print(f"[DEBUG] Recommended groups for {user_id}:", matched_groups)

    return jsonify({"groups": matched_groups}), 200
