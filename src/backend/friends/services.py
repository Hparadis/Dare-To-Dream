# src/backend/friends/services.py
from src.backend.friends.firestore import db
from google.cloud.firestore_v1 import ArrayRemove
from google.cloud import firestore

db = firestore.Client()

def _get_profile_for_user(user_id):
    user_doc = db.collection("Users").document(user_id).get()
    if user_doc.exists:
        profile = user_doc.to_dict()
        profile["userId"] = user_id
        return profile
    survey_doc = db.collection("Surveys").document(user_id).get()
    if survey_doc.exists:
        profile = survey_doc.to_dict()
        profile["userId"] = user_id
        return profile
    return {"userId": user_id}

def get_similar_friends(user_id, problem, cause, limit=3):
    friends = []
    # Query surveys collection to find users matching problem and cause, excluding current user
    surveys_ref = db.collection("Surveys")
    query = surveys_ref.where("problem", "==", problem).where("cause", "==", cause).limit(limit*2)
    results = query.stream()

    for doc in results:
        data = doc.to_dict()
        if data["userId"] != user_id:
            friend_data = {
                "userId": data["userId"],
                "name": data.get("name", "Unknown"),
                "problem": data.get("problem"),
                "cause": data.get("cause"),
                "description": data.get("description", ""),
            }
            friends.append(friend_data)
            if len(friends) >= limit:
                break
    return friends
def suggest_and_save_friends(user_id, problem, cause, max_friends=3):
    if not user_id or not problem or not cause:
        raise ValueError("Missing userId, problem, or cause")

    query = (
        db.collection("Surveys")
        .where("problem", "==", problem)
        .where("cause", "==", cause)
    )

    matches = []
    for doc in query.stream():
        data = doc.to_dict()
        if data.get("userId") != user_id:
            matches.append({
                "userId": data["userId"],
                "name": data.get("name", "Unknown"),
                "description": data.get("description", "")
            })
        if len(matches) >= max_friends:
            break

    # Save into user's Friends subcollection
    for friend in matches:
        friend_ref = db.collection("Users").document(user_id).collection("Friends").document(friend["userId"])
        friend_ref.set(friend)

    return matches
def get_saved_friends(user_id):
    if not user_id:
        raise ValueError("Missing userId")

    friends = []
    query = db.collection("friends").where("userId", "==", user_id).stream()
    for doc in query:
        data = doc.to_dict()
        friend_id = data.get("friendId")
        if friend_id:
            friends.append(_get_profile_for_user(friend_id))
    return friends
def get_accepted_friends(user_id):
    if not user_id:
        raise ValueError("Missing userId")

    friends = []
    # 🔹 Look inside the `friends` collection
    query = db.collection("friends").where("userId", "==", user_id).stream()

    for doc in query:
        data = doc.to_dict()
        friend_id = data.get("friendId")

        if friend_id:
            friends.append(_get_profile_for_user(friend_id))

    return friends
# ✅ Fetch chat messages
def get_chat_messages(conversation_id):
    try:
        messages_ref = db.collection("Chats").document(conversation_id).collection("Messages")
        docs = messages_ref.order_by("timestamp").stream()

        messages = []
        for doc in docs:
            msg = doc.to_dict()
            msg["id"] = doc.id
            messages.append(msg)

        return messages
    except Exception as e:
        print("Error fetching messages:", e)
        raise


# ✅ Save message to Firestore
def save_message_to_db(conversation_id, message_obj):
    try:
        messages_ref = db.collection("Chats").document(conversation_id).collection("Messages")
        messages_ref.add(message_obj)  # Auto-generates a message ID
        return True
    except Exception as e:
        print("Error saving message:", e)
        raise
