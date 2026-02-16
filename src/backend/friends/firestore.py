from src.config.firebase import db

def get_similar_users(current_user_id, problem, cause, limit=3):
    surveys_ref = db.collection("Surveys")
    query = surveys_ref \
        .where("problem", "==", problem) \
        .where("cause", "==", cause) \
        .where("userId", "!=", current_user_id) \
        .limit(limit)

    results = query.stream()
    return [doc.to_dict() for doc in results]
