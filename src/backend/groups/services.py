# src/backend/groups/services.py
from .firestore import create_group as create_group_firestore, get_groups_for_user
from firebase_admin import firestore
from datetime import datetime

db = firestore.client()

def create_group_service(name, description, tags, created_by):
    group_data = {
        "name": name,
        "description": description,
        "tags": tags,
        "createdBy": created_by,
        "members": [created_by],
        "createdAt": firestore.SERVER_TIMESTAMP,
    }
    return create_group_firestore(group_data)

def fetch_groups_for_user_service(user_id):
    user_doc = db.collection("Users").document(user_id).get()
    if not user_doc.exists:
        return []

    user_data = user_doc.to_dict()
    user_tags = user_data.get("tags", [])  # or from their last survey

    # Get all groups
    groups_ref = db.collection("Groups").stream()

    matching_groups = []
    for group in groups_ref:
        data = group.to_dict()
        data["id"] = group.id

        # Skip if already a member
        if user_id in data.get("members", []):
            continue

        # Check tag overlap
        if any(tag in user_tags for tag in data.get("tags", [])):
            matching_groups.append(data)

    return matching_groups

