from flask import Blueprint, request, jsonify
from firebase_admin import firestore as admin_firestore
from groups.firestore import get_firestore_db
from groups.utils import normalize_id



grouping_bp = Blueprint("grouping_bp", __name__)


@grouping_bp.route('/create', methods=['POST'])
def create_group():
    db = get_firestore_db()

    try:
        data = request.get_json()

        if not data:
            return jsonify({"status": "error", "message": "No data provided."}), 400

        group_type = data.get('type')
        suggestion = data.get('suggestion')
        members = data.get('members', [])

        if not group_type or not suggestion:
            return jsonify({"status": "error", "message": "Missing 'type' or 'suggestion' fields."}), 400

        doc_id = normalize_id(suggestion)
        doc_ref = db.collection("Groups").document(doc_id)

        # Check if a group with the same ID already exists
        if doc_ref.get().exists:
            return jsonify({
                "status": "error",
                "message": f"A {group_type} with that name already exists. Please choose a different name."
            }), 409  # 409 Conflict

        group_data = {
            "type": group_type,
            "name": suggestion,  # Original name for display
            "members": members,
            "createdAt": admin_firestore.SERVER_TIMESTAMP,
            # "createdBy": request.user["uid"]  # Uncomment when you implement auth
        }

        doc_ref.set(group_data)

        return jsonify({
            "status": "success",
            "message": f"{group_type.capitalize()} '{suggestion}' created successfully!",
            "groupId": doc_id
        }), 201

    except Exception as e:
        print(f"Error creating group/community: {e}")
        return jsonify({
            "status": "error",
            "message": f"Failed to create group/community: {str(e)}"
        }), 500
