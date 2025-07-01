from flask import Blueprint, jsonify
from firebase_admin import firestore


communities_bp = Blueprint('communities', __name__)

@communities_bp.route('/list', methods=['GET'])
def list_communities():
    db = firestore.client()
    try:
        communities_ref = db.collection("Communities")
        docs = communities_ref.stream()
        communities_list = []
        for doc in docs:
            community_data = doc.to_dict()
            community_data['communityId'] = doc.id
            communities_list.append(community_data)
        return jsonify({"status": "success", "communities": communities_list})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500