from src.config.firebase import db
from datetime import datetime

def save_survey(data: dict) -> str:
    """
    Save the full survey dict to Firestore.
    Returns the created document ID.
    """
    data["createdAt"] = datetime.utcnow().isoformat()
    doc_ref = db.collection("Surveys").document()
    doc_ref.set(data)
    return doc_ref.id
def get_surveys_by_user(user_id: str) -> list:
    """
    Returns all surveys where userId == user_id
    """
    ref = db.collection("Surveys")
    query = ref.where("userId", "==", user_id).stream()
    return [doc.to_dict() for doc in query]
