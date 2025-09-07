from flask import Blueprint, request, jsonify
from src.config.firebase import get_firestore
from datetime import datetime

chats_bp = Blueprint("chats", __name__, url_prefix="/chats")

db = get_firestore()

@chats_bp.route("/<conversation_id>/send", methods=["POST"])
def send_message(conversation_id):
    data = request.get_json()
    message = data.get("message")
    sender_id = data.get("senderId")
    receiver_id = data.get("receiverId")

    if not message or not sender_id or not receiver_id:
        return jsonify({"error": "Missing fields"}), 400

    msg_data = {
        "conversationId": conversation_id,
        "senderId": sender_id,
        "receiverId": receiver_id,
        "content": message,
        "timestamp": datetime.utcnow().isoformat(),
    }

    db.collection("chats").document(conversation_id).collection("messages").add(msg_data)

    return jsonify({"success": True, "message": msg_data}), 200
