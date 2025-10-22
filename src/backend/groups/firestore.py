# src/backend/groups/firestore.py
from firebase_admin import firestore

db = firestore.client()

def create_group(group_data: dict) -> str:
    """Create a group document and return its ID."""
    group_ref = db.collection("Groups").document()
    group_ref.set(group_data)
    return group_ref.id

def get_groups_for_user(user_id: str) -> list:
    """Return groups where user is a member."""
    docs = db.collection("Groups").where("members", "array_contains", user_id).stream()
    return [{**d.to_dict(), "id": d.id} for d in docs]

def add_member_to_group(group_id: str, user_id: str):
    """Add a user to group members using ArrayUnion."""
    group_ref = db.collection("Groups").document(group_id)
    group_ref.update({"members": firestore.ArrayUnion([user_id])})
    return True

def get_groups_by_tag(tag: str) -> list:
    docs = db.collection("Groups").where("tags", "array_contains", tag).stream()
    return [{**d.to_dict(), "id": d.id} for d in docs]

def list_all_groups() -> list:
    return [{**d.to_dict(), "id": d.id} for d in db.collection("Groups").stream()]
def search_groups(query):
    # Simple "name contains" search
    groups_ref = db.collection("Groups")
    results = groups_ref.where("name", ">=", query).where("name", "<=", query + "\uf8ff").stream()
    return [doc.to_dict() for doc in results]
