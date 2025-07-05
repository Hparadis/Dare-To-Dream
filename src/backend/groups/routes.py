# src/backend/groups/routes.py
from flask import Blueprint, request, jsonify
from .services import create_group_logic
from .firestore import get_firestore_db

grouping_bp = Blueprint("grouping", __name__)

@grouping_bp.route('/create', methods=['POST'])
def create_group():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided."}), 400

        result, status = create_group_logic(data)
        return jsonify(result), status

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Similarly move and refactor other routes: run_grouping, submit_survey, join_group, etc.
