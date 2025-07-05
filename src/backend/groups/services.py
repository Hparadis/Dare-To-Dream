# src/backend/groups/services.py
from .firestore import get_firestore_db
from .utils import normalize_id
from firebase_admin import firestore as admin_firestore

def create_group_logic(data):
    db = get_firestore_db()
    
    group_type = data.get('type')
    suggestion = data.get('suggestion')
    members = data.get('members', [])

    if not group_type or not suggestion:
        return {"error": "Missing 'type' or 'suggestion'"}, 400

    doc_id = normalize_id(suggestion)
    doc_ref = db.collection("Groups").document(doc_id)

    if doc_ref.get().exists:
        return {"error": "Group with that name already exists."}, 409

    group_data = {
        "type": group_type,
        "name": suggestion,
        "members": members,
        "createdAt": admin_firestore.SERVER_TIMESTAMP,
    }

    doc_ref.set(group_data)
    return {
        "message": f"{group_type.capitalize()} '{suggestion}' created successfully!",
        "groupId": doc_id
    }, 201
