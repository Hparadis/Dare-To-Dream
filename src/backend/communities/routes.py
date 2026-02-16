# src/backend/communities/routes.py
from flask import Blueprint, request, jsonify
from src.backend.utils.auth import require_auth
from src.backend.communities.services import (
    create_community_service,
    fetch_user_communities,
    fetch_recommended_communities_for_user,
    auto_create_communities,
    join_community_service,
)
from src.backend.communities.firestore import add_member_to_community
from .services import handle_create_community, handle_search_communities
from src.config.firebase import db

communities_bp = Blueprint("communities", __name__)

@communities_bp.route("/auto-create", methods=["POST"])
@require_auth
def auto_create_route():
    created = auto_create_communities()
    return jsonify({"created": created}), 201

@communities_bp.route("/create", methods=["POST"])
@require_auth
def create_community():
    data = request.json or {}
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name required"}), 400
    description = data.get("description", "")
    tags = data.get("tags", [])
    created_by = request.user.get("uid")
    community_id = create_community_service(name, description, created_by, tags)
    return jsonify({"communityId": community_id}), 201

@communities_bp.route("/user", methods=["GET"])
@require_auth
def get_user_communities():
    uid = request.user.get("uid")
    communities = fetch_user_communities(uid)
    return jsonify({"communities": communities})

@communities_bp.route("/recommend", methods=["GET"])
@require_auth
def recommend_communities():
    uid = request.user.get("uid")
    # ensure communities are auto-created from surveys
    auto_create_communities()
    communities = fetch_recommended_communities_for_user(uid)
    return jsonify({"communities": communities})

@communities_bp.route("/join", methods=["POST"])
@require_auth
def join_community():
    uid = request.user.get("uid")
    body = request.json or {}
    community_id = body.get("communityId")
    if not community_id:
        return jsonify({"error": "communityId required"}), 400

    community_ref = db.collection("Communities").document(community_id)
    if not community_ref.get().exists:
        return jsonify({"error": "Community not found"}), 404

    add_member_to_community(community_id, uid)
    return jsonify({"message": "Joined community"})
@communities_bp.route("/create", methods=["POST"])
def create_community_route():
    uid = request.user.get("uid")
    payload = request.json
    community = handle_create_community(uid, payload)
    return jsonify(community), 201

@communities_bp.route("/search", methods=["GET"])
def search_communities_route():
    query = request.args.get("q", "")
    communities = handle_search_communities(query)
    return jsonify({"communities": communities})
