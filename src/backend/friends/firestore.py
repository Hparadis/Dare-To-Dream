# src/backend/friends/firestore.py
from firebase_admin import firestore

def get_all_users_except(db, current_user_id):
    users_ref = db.collection("Surveys")
    users = users_ref.stream()
    others = []
    for user in users:
        data = user.to_dict()
        # Add document ID as userId field in data dict:
        data["userId"] = user.id
        if data["userId"] != current_user_id:
            others.append(data)
    return others
