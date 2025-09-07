from google.cloud import firestore

# Initialize Firestore client
db = firestore.Client()

def delete_collection(coll_name, batch_size=10):
    coll_ref = db.collection(coll_name)
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        print(f"Deleting doc {doc.id} from {coll_name}")
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_collection(coll_name, batch_size)

if __name__ == "__main__":
    collections_to_delete = ["Surveys", "Groups", "Communities", "Users"]

    for coll in collections_to_delete:
        print(f"Starting deletion of collection: {coll}")
        delete_collection(coll)
        print(f"Finished deletion of collection: {coll}")
