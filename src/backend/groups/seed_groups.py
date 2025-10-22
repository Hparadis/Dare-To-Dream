# src/backend/groups/seed_groups.py
"""
Run this script to create sample survey documents for testing:
python -m src.backend.groups.seed_groups
"""

import firebase_admin
from firebase_admin import credentials,firestore,initialize_app

cred = credentials.Certificate("src/config/dare-to-dream-9c136-firebase-adminsdk-fbsvc-ebb89d4994.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

from src.backend.groups.services import auto_create_groups



# ensure firebase app initialized (your project probably does this elsewhere)
if not firebase_admin._apps:
    initialize_app()



SAMPLE_SURVEYS = [
    {"userId": "test_user_1", "problem": "addiction", "cause": "peer", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_2", "problem": "addiction", "cause": "stress", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_3", "problem": "addiction", "cause": "family", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_4", "problem": "addiction", "cause": "loneliness", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_5", "problem": "addiction", "cause": "boredom", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_6", "problem": "depression", "cause": "loss", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_7", "problem": "depression", "cause": "isolation", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_8", "problem": "depression", "cause": "stress", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_9", "problem": "depression", "cause": "trauma", "createdAt": firestore.SERVER_TIMESTAMP},
    {"userId": "test_user_10", "problem": "depression", "cause": "health", "createdAt": firestore.SERVER_TIMESTAMP},
]

def seed_surveys():
    for s in SAMPLE_SURVEYS:
        uid = s["userId"]
        db.collection("Surveys").document(uid).set(s)
    print("Seeded surveys to Surveys collection.")

if __name__ == "__main__":
    created = auto_create_groups()
    print("Groups created:", created)
    seed_surveys()
