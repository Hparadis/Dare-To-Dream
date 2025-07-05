# src/backend/groups/firestore.py
from firebase_admin import firestore

def get_firestore_db():
    return firestore.client()
