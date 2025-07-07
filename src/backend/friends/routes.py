from flask import Blueprint, request, jsonify
from firebase_admin import firestore
from .firestore import get_all_users_except
from .services import find_best_friend_match

friends_bp = Blueprint("friends", __name__)

@friends_bp.route('/initial-friends', methods=['GET'])
def get_initial_friends():
    try:
        user_id = request.args.get("userId")
        print(f"Received userId: {user_id}")

        if not user_id:
            return {"error": "Missing userId"}, 400

        db = firestore.client()
        current_user_doc = db.collection("Surveys").document(user_id).get()

        if not current_user_doc.exists:
            print("User survey not found")
            return jsonify({"status": "no_data", "message": "Survey not found"}), 404

        current_user_data = current_user_doc.to_dict()
        other_users = get_all_users_except(db, user_id)

        print(f"Found {len(other_users)} other users")

        from .services import find_best_friend_match
        match = find_best_friend_match(current_user_data, other_users)

        if not match:
            return jsonify({"status": "no_suggestions", "message": "No friends to suggest."}), 200

        return jsonify({
            "status": "success",
            "friend": {
                "name": match["name"],
                "userId": match["userId"],
                "email": match.get("email", "no-email")
            }
        })

    except Exception as e:
        print(f"🔥 Error in /initial-friends: {e}")
        return jsonify({"error": "Internal server error"}), 500
