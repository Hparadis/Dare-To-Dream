# src/backend/groups/firestore.py
from firebase_admin import firestore

db = firestore.client()

def create_group(group_data):
    group_ref = db.collection("Groups").document()
    group_ref.set(group_data)
    return group_ref.id

def get_groups_for_user(user_id):
    user_survey_ref = db.collection("Surveys").document(user_id)
    user_survey = user_survey_ref.get()

    if not user_survey.exists:
        return []

    user_data = user_survey.to_dict()
    user_problem = user_data.get("problem")
    user_cause = user_data.get("cause")

    groups_ref = db.collection("Groups")
    matched_groups = groups_ref.where("tags", "array_contains_any", [user_problem, user_cause]).stream()
    
    return [g.to_dict() for g in matched_groups]
