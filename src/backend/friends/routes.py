# //src/backend/friends/routes.py
from datetime import datetime
from flask import Blueprint, request, jsonify
from firebase_admin import firestore
from src.backend.friends.services import get_similar_friends, get_saved_friends,get_accepted_friends,get_chat_messages, save_message_to_db
from src.backend.friends.firestore import get_similar_users
from src.config.firebase import get_firestore

friends_bp = Blueprint("friends", __name__, url_prefix="/api/friends")
db = firestore.client()

# ✅ Suggest friends (based on problem/cause)
@friends_bp.route("/suggest", methods=["GET"])
def suggest_friends():
    user_id = request.args.get("userId")
    problem = request.args.get("problem")
    cause = request.args.get("cause")

    if not user_id or not problem or not cause:
        return jsonify({"error": "Missing userId, problem, or cause"}), 400

    try:
        suggestions = get_similar_users(user_id, problem, cause)
        return jsonify({"friends": suggestions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get saved friends
@friends_bp.route("/<user_id>", methods=["GET"])
def get_friends(user_id):
    try:
        friends = get_saved_friends(user_id)
        return jsonify({"friends": friends}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print("Error fetching friends:", e)
        return jsonify({"error": "Internal server error"}), 500


# ✅ Send invitation
@friends_bp.route("/invite", methods=["POST"])
def invite_friend():
    db = get_firestore()
    data = request.get_json()
    from_user_id = data.get("fromUserId")
    to_user_id = data.get("toUserId")

    if not from_user_id or not to_user_id:
        return jsonify({"error": "Missing userId(s)"}), 400
    
    sender_doc = db.collection("Users").document(from_user_id).get()
    if sender_doc.exists:
        sender_data = sender_doc.to_dict()
        from_user_name = sender_data.get("name", "")
        from_user_email = sender_data.get("email", "")
    else:
        from_user_name = ""
        from_user_email = ""

    Invitation = {
        "fromUserId": from_user_id,
        "fromUserName": from_user_name,
        "fromUserEmail": from_user_email,
        "toUserId": to_user_id,
        "status": "pending",
        "timestamp": datetime.utcnow().isoformat()
    }

    db.collection("Invitations").add(Invitation)

    return jsonify({"message": "Invitation sent"}), 200


# ✅ Respond to invitation (accept/reject)
@friends_bp.route("/respond", methods=["POST"])
def respond_invite():
    db = get_firestore()
    data = request.get_json()
    notification_id = data.get("notificationId")
    response = data.get("response")  # "accepted" | "rejected"

    if not notification_id or response not in ["accepted", "rejected"]:
        return jsonify({"error": "Invalid data"}), 400

    notif_ref = db.collection("notifications").document(notification_id)
    notif_doc = notif_ref.get()

    if not notif_doc.exists:
        return jsonify({"error": "Notification not found"}), 404

    notif_data = notif_doc.to_dict()
    from_user_id = notif_data["fromUserId"]
    to_user_id = notif_data["toUserId"]

    notif_ref.update({"status": response})

    if response == "accepted":
        # Save both friend entries
        db.collection("friends").document(f"{from_user_id}_{to_user_id}").set({
            "userId": from_user_id,
            "friendId": to_user_id,
            "createdAt": datetime.utcnow().isoformat()
        })
        db.collection("friends").document(f"{to_user_id}_{from_user_id}").set({
            "userId": to_user_id,
            "friendId": from_user_id,
            "createdAt": datetime.utcnow().isoformat()
        })
        accepter_doc = db.collection("Users").document(to_user_id).get()
        accepter_name = accepter_doc.to_dict().get("name", "") if accepter_doc.exists else ""
        db.collection("Invitations").add({
            "fromUserId": to_user_id,
            "fromUserName": accepter_name,
            "toUserId": from_user_id,
            "status": "accepted-notification",
            "timestamp": datetime.utcnow().isoformat()
        })

    return jsonify({"message": f"Invitation {response}"}), 200
# ✅ Get accepted friends
@friends_bp.route("/accepted/<user_id>", methods=["GET"])
def accepted_friends(user_id):
    try:
        friends = get_accepted_friends(user_id)
        return jsonify({"friends": friends}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print("Error fetching accepted friends:", e)
        return jsonify({"error": "Internal server error"}), 500
@friends_bp.route("/chats/<conversation_id>/messages", methods=["GET"])
def get_messages(conversation_id):
    # Fetch messages for the conversation
    messages = get_chat_messages(conversation_id)  # implement in services.py
    return jsonify({"messages": messages}), 200


@friends_bp.route("/chats/<conversation_id>/send", methods=["POST"])
def send_message(conversation_id):
    data = request.get_json()
    content = data.get("message")  # must match frontend payload
    sender_id = data.get("senderId")  # pass senderId from frontend
    receiver_id = data.get("receiverId")  # pass receiverId
    timestamp = data.get("timestamp")

    if not content or not sender_id or not receiver_id:
        return jsonify({"error": "Missing fields"}), 400

    message_obj = {
        "senderId": sender_id,
        "receiverId": receiver_id,
        "content": content,
        "timestamp": timestamp,
        "conversationId": conversation_id
    }

    save_message_to_db(conversation_id, message_obj)  # implement in services.py

    return jsonify({"message": message_obj}), 200
@friends_bp.route("/batch", methods=["POST"])
def get_user_profiles_batch():
    data = request.json
    user_ids = data.get("userIds", [])
    profiles = []
    for uid in user_ids:
        user_doc = db.collection("Users").document(uid).get()
        if user_doc.exists:
            profiles.append(user_doc.to_dict() | {"userId": uid})
    return jsonify({"profiles": profiles})