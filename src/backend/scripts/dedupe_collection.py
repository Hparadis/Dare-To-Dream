# src/backend/scripts/dedupe_collection.py
"""
One-time cleanup: keeps the first doc per unique `tags` value, deletes the rest.
Run with: python -m src.backend.scripts.dedupe_collection
"""
from src.config.firebase import db

def dedupe(collection_name):
    seen_tags = {}
    for doc in db.collection(collection_name).stream():
        d = doc.to_dict()
        tag_key = tuple(sorted(d.get("tags", [])))
        if tag_key in seen_tags:
            print(f"Deleting duplicate {collection_name}/{doc.id} (tags={tag_key})")
            doc.reference.delete()
        else:
            seen_tags[tag_key] = doc.id

if __name__ == "__main__":
    dedupe("Communities")
    dedupe("Groups")