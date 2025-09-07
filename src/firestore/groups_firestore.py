from ..config.firebase import db
from firebase_admin import firestore

def _normalize_group(doc):
    d = doc.to_dict()
    return {
        "id": doc.id,
        "name": d.get("name") or d.get("groupName"),
        "memberIds": d.get("memberIds") or d.get("memberUserIds") or [],
        "createdBy": d.get("createdBy"),
        "problem": d.get("problem"),
        "cause": d.get("cause"),
    }

def get_groups_where_member(user_id: str) -> list[dict]:
    q1 = db.collection("Groups").where("memberIds", "array_contains", user_id)
    q2 = db.collection("Groups").where("memberUserIds", "array_contains", user_id)
    docs = list(q1.stream()) + list(q2.stream())
    return [_normalize_group(doc) for doc in docs]
