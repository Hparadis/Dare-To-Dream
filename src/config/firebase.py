import json
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore


def _initialize_firebase():
    if firebase_admin._apps:
        return

    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "").strip()
    inline_creds = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
    local_default = Path("src/config/dare-to-dream-9c136-firebase-adminsdk-fbsvc-ebb89d4994.json")

    if creds_path and Path(creds_path).exists():
        cred = credentials.Certificate(creds_path)
        firebase_admin.initialize_app(cred)
        return

    if inline_creds:
        cred_info = json.loads(inline_creds)
        cred = credentials.Certificate(cred_info)
        firebase_admin.initialize_app(cred)
        return

    if local_default.exists():
        cred = credentials.Certificate(str(local_default))
        firebase_admin.initialize_app(cred)
        return

    # Last-resort fallback so local GCP ADC can still work if configured.
    firebase_admin.initialize_app()


_initialize_firebase()
db = firestore.client()


def get_firestore():
    return db
