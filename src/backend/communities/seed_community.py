# src/backend/communities/seed_communities.py
from .services import create_community_service

default_communities = [
    {"name": "Addiction Support", "description": "Helping each other overcome addiction.", "tags": ["addiction"]},
    {"name": "Depression Support", "description": "Support for depression challenges.", "tags": ["depression"]},
]

def seed():
    from firebase_admin import firestore
    db = firestore.client()
    for c in default_communities:
        # avoid duplicates
        existing = list(db.collection("Communities").where("name", "==", c["name"]).stream())
        if existing:
            continue
        create_community_service(c["name"], c["description"], "admin", c["tags"])
    print("✅ Default communities seeded")
