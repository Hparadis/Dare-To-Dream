import firebase_admin
from firebase_admin import credentials, firestore

# Only initialize once
if not firebase_admin._apps:
    cred = credentials.Certificate("src/config/dare-to-dream-9c136-firebase-adminsdk-fbsvc-ebb89d4994.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_firestore():
    return firestore.client()
