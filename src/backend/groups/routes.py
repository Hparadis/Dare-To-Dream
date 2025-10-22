# src/backend/groups/routes.py
from flask import Blueprint, request, jsonify
from firebase_admin import firestore
from src.backend.utils.auth import require_auth
from src.backend.groups.services import (
    auto_create_groups,
    fetch_recommended_groups_for_user,
    get_user_groups_service,
    handle_create_group,
    handle_search_groups
)
from src.backend.groups.firestore import list_all_groups

groups_bp = Blueprint("groups", __name__)
db = firestore.client()

# --- GROUP CREATION ---
@groups_bp.route("/auto-create", methods=["POST"])
@require_auth
def auto_create_route():
    created = auto_create_groups()
    return jsonify({"created": created}), 201

@groups_bp.route("/create", methods=["POST"])
@require_auth
def create_group_route():
    uid = request.user.get("uid")
    payload = request.json
    group = handle_create_group(uid, payload)
    return jsonify(group), 201


# --- GROUP FETCHING ---
@groups_bp.route("/user", methods=["GET"])
@require_auth
def get_user_groups():
    uid = request.user.get("uid")
    groups = get_user_groups_service(uid)
    return jsonify({"groups": groups})

@groups_bp.route("/recommend", methods=["GET"])
@require_auth
def recommend_groups():
    uid = request.user.get("uid")
    auto_create_groups()  # ensure groups exist
    groups = fetch_recommended_groups_for_user(uid)
    return jsonify({"groups": groups})

@groups_bp.route("/search", methods=["GET"])
def search_groups_route():
    query = request.args.get("q", "")
    groups = handle_search_groups(query)
    return jsonify({"groups": groups})

@groups_bp.route("/all", methods=["GET"])
def get_all_groups():
    groups = list_all_groups()
    return jsonify({"groups": groups}), 200


# --- GROUP MEMBERSHIP ---
@groups_bp.route("/join", methods=["POST"])
@require_auth
def join_group_route():
    data = request.json
    uid = request.user.get("uid")  # authenticated user
    group_id = data.get("groupId")

    if not group_id:
        return jsonify({"error": "groupId is required"}), 400

    group_ref = db.collection("Groups").document(group_id)
    group = group_ref.get()

    if not group.exists:
        return jsonify({"error": "Group not found"}), 404

    group_ref.update({
        "members": firestore.ArrayUnion([uid])
    })

    return jsonify({"message": "Joined group successfully", "groupId": group_id}), 200
