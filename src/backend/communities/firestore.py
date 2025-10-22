# src/backend/communities/firestore.py
from firebase_admin import firestore

db = firestore.client()

def create_community(community_data: dict):
    ref = db.collection("Communities").document()
    ref.set(community_data)
    return ref.id

def add_member_to_community(community_id: str, user_id: str):
    ref = db.collection("Communities").document(community_id)
    doc = ref.get()
    if not doc.exists:
        return False
    members = doc.to_dict().get("members", [])
    if user_id not in members:
        members.append(user_id)
        ref.update({"members": members})
    return True
def search_communities(query):
    communities_ref = db.collection("Communities")
    results = communities_ref.where("name", ">=", query).where("name", "<=", query + "\uf8ff").stream()
    return [doc.to_dict() for doc in results]