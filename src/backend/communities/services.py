# src/backend/communities/services.py
from firebase_admin import firestore
from .firestore import create_community as create_community_firestore
from .firestore import add_member_to_community, create_community, search_communities
from src.config.firebase import db


def auto_create_communities():
    survey_ref = db.collection("Surveys").stream()
    problem_buckets = {}
    for doc in survey_ref:
        survey = doc.to_dict()
        problem = survey.get("problem")
        if not problem:
            continue
        uid = doc.id
        problem_buckets.setdefault(problem.lower(), []).append(uid)

    created_communities = []
    for problem, users in problem_buckets.items():
        # skip users already placed in a community for this problem
        existing = db.collection("Communities").where("tags", "array_contains", problem).stream()
        existing_member_ids = set()
        for c in existing:
            existing_member_ids.update(c.to_dict().get("members", []))
        users = [u for u in users if u not in existing_member_ids]

        while len(users) >= 5:
            community_members = users[:5]
            users = users[5:]
            community_data = {
                "name": f"{problem.capitalize()} Support Community",
                "description": f"A community for people facing {problem}.",
                "tags": [problem],
                "createdBy": community_members[0],
                "members": community_members,
                "createdAt": firestore.SERVER_TIMESTAMP,
            }
            community_id = create_community_firestore(community_data)
            created_communities.append({"id": community_id, **community_data})

    return created_communities


def create_community_service(name: str, description: str, created_by: str, tags: list):
    """
    Manually create a community.
    """
    community_data = {
        "name": name,
        "description": description,
        "tags": tags,
        "createdBy": created_by,
        "members": [created_by],
        "createdAt": firestore.SERVER_TIMESTAMP,
    }
    return create_community_firestore(community_data)


def fetch_user_communities(user_id: str):
    """
    Return all communities the user is part of.
    """
    communities_ref = db.collection("Communities").stream()
    user_communities = []

    for doc in communities_ref:
        data = doc.to_dict()
        if user_id in data.get("members", []):
            data["id"] = doc.id
            user_communities.append(data)

    return user_communities


def fetch_recommended_communities_for_user(user_id: str):
    """
    Return communities user can join (not yet a member), optionally filtered by tags.
    """
    user_doc = db.collection("Users").document(user_id).get()
    if not user_doc.exists:
        return []

    user_data = user_doc.to_dict()
    user_tags = user_data.get("tags", [])

    communities_ref = db.collection("Communities").stream()
    recommended = []

    for doc in communities_ref:
        data = doc.to_dict()
        data["id"] = doc.id
        if user_id in data.get("members", []):
            continue
        if any(tag in user_tags for tag in data.get("tags", [])):
            recommended.append(data)

    return recommended
def join_community_service(user_id: str, community_id: str):
    """
    Adds a user to a community if not already a member.
    """
    success = add_member_to_community(community_id, user_id)
    if not success:
        return {"error": "Community not found"}, 404
    return {"message": "Joined community"}
def handle_create_community(user_id, payload):
    community_data = {
        "name": payload.get("name"),
        "description": payload.get("description", ""),
        "tags": payload.get("tags", []),
        "createdBy": user_id,
        "members": [user_id],
    }
    return create_community(community_data)

def handle_search_communities(query):
    return search_communities(query)
