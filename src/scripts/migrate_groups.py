"""
One‑time field‑rename for the groups collection.
Run with:  python -m src.scripts.migrate_groups
"""

from firebase_admin import firestore, initialize_app, credentials
from src.config.firebase import db  

def migrate_groups():
    print("Connected to project:", db._database_string)  # show which project
    groups_ref = db.collection("Groups")
    docs = list(groups_ref.stream())
    print("Found", len(docs), "group docs")

    for doc in docs:
        d = doc.to_dict()
        updates = {}
        if "groupName" in d:
            updates["name"] = d["groupName"]
            updates["groupName"] = firestore.DELETE_FIELD
        if "memberUserIds" in d:
            updates["memberIds"] = d["memberUserIds"]
            updates["memberUserIds"] = firestore.DELETE_FIELD
        if updates:
            doc.reference.update(updates)
            print("✔ migrated", doc.id)
        else:
            print("– already clean", doc.id)

if __name__ == "__main__":
    # make sure Admin SDK is initialized
    try:
        firestore.client()
    except ValueError:
        # if not yet, initialise with default creds
        initialize_app()

    migrate_groups()
