from flask import Blueprint, jsonify
from firebase_admin import firestore


groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/list', methods=['GET'])
def list_groups():
    db = firestore.client()
    try:
        groups_ref = db.collection("Groups")
        docs = groups_ref.stream()
        groups_list = []
        for doc in docs:
            group_data = doc.to_dict()
            group_data['groupId'] = doc.id
            groups_list.append(group_data)
        return jsonify({"status": "success", "groups": groups_list}), 200
    except Exception as e:
        print(f"Error listing groups: {e}")
        return jsonify({"status": "error", "message": f"Failed to retrieve groups: {str(e)}"}), 500