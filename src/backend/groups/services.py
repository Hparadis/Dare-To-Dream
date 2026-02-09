# src/backend/groups/services.py
from .firestore import create_group as create_group_doc, get_groups_for_user, add_member_to_group, get_groups_by_tag, list_all_groups
from firebase_admin import firestore
from src.config import firebase as firebase_config  # if you have project config; otherwise db usage below
from firebase_admin import firestore as _firestore
from .firestore import create_group as create_group_doc, search_groups

db = firestore.client()

def auto_create_groups(min_size=5, allow_smaller=True, min_smaller=2):
    """
    Build groups from Surveys collection:
      - bucket users by survey.problem (lowercased)
      - create groups of `min_size` members
      - optionally create smaller groups of at least `min_smaller`
    Returns list of created groups metadata.
    """
    surveys = db.collection("Surveys").stream()
    buckets = {}
    for doc in surveys:
        s = doc.to_dict()
        problem = s.get("problem")
        user_id = s.get("userId") or doc.id
        if not problem or not user_id:
            continue
        key = problem.strip().lower()
        buckets.setdefault(key, []).append(user_id)

    created = []
    for problem, users in buckets.items():
        # remove users already in groups for this problem
        existing_groups = db.collection("Groups").where("tags", "array_contains", problem).stream()
        existing_member_ids = set()
        for g in existing_groups:
            existing_member_ids.update(g.to_dict().get("members", []))
        users = [u for u in users if u not in existing_member_ids]

        # make full-size groups
        while len(users) >= min_size:
            members = users[:min_size]
            users = users[min_size:]
            group_data = {
                "name": f"{problem.capitalize()} Support Group",
                "description": f"A support group for people facing {problem}.",
                "tags": [problem],
                "createdBy": members[0],
                "members": members,
                "createdAt": _firestore.SERVER_TIMESTAMP,
            }
            gid = create_group_doc(group_data)
            created.append({"id": gid, **group_data})

        # optional: allow a smaller group
        if allow_smaller and len(users) >= min_smaller:
            members = users
            group_data = {
                "name": f"{problem.capitalize()} Mini Support Group",
                "description": f"A smaller support group for people facing {problem}.",
                "tags": [problem],
                "createdBy": members[0],
                "members": members,
                "createdAt": _firestore.SERVER_TIMESTAMP,
            }
            gid = create_group_doc(group_data)
            created.append({"id": gid, **group_data})

    return created

def fetch_recommended_groups_for_user(user_id: str) -> list:
    """
    Return groups matching user's tags (from Users doc if available,
    otherwise use last survey's 'problem'). Exclude groups the user already belongs to.
    """
    tags = []
    user_doc = db.collection("Users").document(user_id).get()
    if user_doc.exists:
        tags = user_doc.to_dict().get("tags", [])
    else:
        # fallback to last survey for uid
        sdoc = db.collection("Surveys").document(user_id).get()
        if sdoc.exists:
            p = sdoc.to_dict().get("problem")
            if p:
                tags = [p]

    matched = []
    for gdoc in db.collection("Groups").stream():
        g = gdoc.to_dict()
        if user_id in g.get("members", []):
            continue
        if any(tag in g.get("tags", []) for tag in tags):
            g["id"] = gdoc.id
            matched.append(g)
    return matched

def get_user_groups_service(user_id: str) -> list:
    return get_groups_for_user(user_id)
def handle_create_group(user_id, payload):
    group_data = {
        "name": payload.get("name"),
        "description": payload.get("description", ""),
        "tags": payload.get("tags", []),
        "createdBy": user_id,
        "members": [user_id],
    }
    return create_group_doc(group_data)

def handle_search_groups(query):
    return search_groups(query)

def create_group(user_id, name, description=""):
    group_ref = db.collection("Groups").document()
    group_ref.set({
        "id": group_ref.id,
        "name": name,
        "description": description,
        "members": [user_id],   # creator is first member
    })
    return group_ref.get().to_dict()
def join_group(user_id, group_id):
    group_ref = db.collection("Groups").document(group_id)
    group = group_ref.get()

    if not group.exists:
        return None

    group_data = group.to_dict()
    members = group_data.get("members", [])

    if user_id not in members:
        members.append(user_id)
        group_ref.update({"members": members})

    return group_ref.get().to_dict()
