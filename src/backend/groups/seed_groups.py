# src/backend/groups/seed_groups.py
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
import random

# Initialize Firebase
cred = credentials.Certificate("src/config/dare-to-dream-9c136-firebase-adminsdk-fbsvc-ebb89d4994.json")  # Update path
firebase_admin.initialize_app(cred)
db = firestore.client()

# Fetch all users and their survey tags
users = list(db.collection("Users").stream())
print(f"Found {len(users)} users")

user_tag_map = {}

for user in users:
    user_id = user.id
    survey_doc = db.collection("Surveys").document(user_id).get()
    tags = []

    if survey_doc.exists:
        survey = survey_doc.to_dict()
        for key in ["problem", "cause", "effect", "timePeriod", "goDeeper", "tags"]:
            value = survey.get(key)
            if isinstance(value, list):
                tags.extend(value)
            elif isinstance(value, str):
                tags.append(value.lower())

    user_tag_map[user_id] = set(tag.lower().strip() for tag in tags if isinstance(tag, str))

# Helper: Get best-matching users for given group tags
def get_matching_users(group_tags, max_users=5):
    group_tags = set(tag.lower().strip() for tag in group_tags)
    scored_users = []

    for user_id, user_tags in user_tag_map.items():
        score = len(group_tags & user_tags)
        if score > 0:
            scored_users.append((user_id, score))

    # Sort by highest match score, fallback to random if needed
    scored_users.sort(key=lambda x: -x[1])
    top_users = [user_id for user_id, _ in scored_users[:max_users]]

    if len(top_users) < max_users:
        remaining = set(user_tag_map.keys()) - set(top_users)
        extra = random.sample(list(remaining), min(max_users - len(top_users), len(remaining)))
        top_users.extend(extra)

    return top_users

# Groups to seed
initial_groups = [
    {
        "name": "Mind Over Storm",
        "description": "A safe space for anyone battling anxiety, overthinking, and fear. Let’s breathe through the storm together.",
        "tags": ["anxiety", "overthinking", "panic"]
    },
    {
        "name": "Healing the Wounds",
        "description": "For survivors of childhood trauma, abuse, and painful pasts. You are not alone in your healing.",
        "tags": ["childhood trauma", "abuse", "PTSD"]
    },
    {
        "name": "Rise from the Fall",
        "description": "A support group for those recovering from depression, burnout, or suicidal thoughts. Let’s rise, one day at a time.",
        "tags": ["depression", "burnout", "suicidal thoughts"]
    },
    {
        "name": "Alone Together",
        "description": "A group to fight loneliness, isolation, and feelings of disconnection. Share. Listen. Feel heard.",
        "tags": ["loneliness", "isolation", "social anxiety"]
    },
    {
        "name": "The Light Within",
        "description": "A positive-focused group for people working on self-love, mindfulness, and emotional resilience.",
        "tags": ["self-esteem", "mindfulness", "healing"]
    },
]

# Seed groups with matched members
for group in initial_groups:
    matching_members = get_matching_users(group["tags"], max_users=5)

    group_data = {
        **group,
        "createdBy": "system",
        "members": matching_members,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }

    doc_ref = db.collection("Groups").document()
    doc_ref.set(group_data)
    print(f"Created group: {group['name']} with members: {matching_members}")
# Clean-up: Delete any groups without members
def cleanup_empty_groups():
    groups = db.collection("Groups").stream()
    deleted_count = 0

    for group in groups:
        data = group.to_dict()
        members = data.get("members")

        if not isinstance(members, list) or len(members) == 0:
            db.collection("Groups").document(group.id).delete()
            print(f"Deleted empty group: {data.get('name', 'Unnamed')} (ID: {group.id})")
            deleted_count += 1

    print(f"\n✅ Cleanup complete: Deleted {deleted_count} empty group(s)")

# Run cleanup
cleanup_empty_groups()
