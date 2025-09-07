from google.cloud import firestore
from datetime import datetime
from src.backend.friends.services import suggest_and_save_friends
db = firestore.Client()

def submit_survey(data):
    user_id = data.get("userId")
    name = data.get("name", f"User-{user_id[:4]}")
    description = data.get("description", "New user profile.")

    if not user_id:
        raise ValueError("Missing userId")

    # --- 1. Save/Update user profile in 'Users' ---
    user_ref = db.collection("Users").document(user_id)
    user_ref.set({
        "userId": user_id,
        "name": name,
        "description": description,
        "createdAt": datetime.utcnow().isoformat()
    }, merge=True)

    # --- 2. Save/Update survey in 'Surveys/{userId}' ---
    survey_data = data.copy()
    survey_data["createdAt"] = datetime.utcnow().isoformat()

    survey_ref = db.collection("Surveys").document(user_id)  # ✅ use userId as ID
    survey_ref.set(survey_data)  # overwrite if exists

    problem = data.get("problem")
    cause = data.get("cause")
    if problem and cause:
        suggest_and_save_friends(user_id, problem, cause)

    return survey_ref.id

def fetch_surveys_for_user(user_id):
    if not user_id:
        raise ValueError("Missing userId")

    doc = db.collection("Surveys").document(user_id).get()
    if doc.exists:
        return [doc.to_dict()]
    else:
        return []
