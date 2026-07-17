# src/backend/matching/routes.py
from flask import Blueprint, request, jsonify
from src.backend.utils.auth import require_auth
from .services import submit_feeling

matching_bp = Blueprint("matching", __name__, url_prefix="/api/match")


@matching_bp.route("/submit", methods=["POST"])
@require_auth
def submit_route():
    """
    Stage 1 of the algorithm: the person types how they feel, we look for
    whoever else already shares the most words with it.
    Requires auth, but works fine with an anonymous Firebase user — the
    person doesn't need a real account yet, just a uid.
    """
    uid = request.user.get("uid")
    data = request.json or {}
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "text is required"}), 400

    result = submit_feeling(uid, text)
    return jsonify(result), 200
