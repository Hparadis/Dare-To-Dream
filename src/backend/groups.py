# src/backend/groups.py
from flask import Blueprint, jsonify, request
from firebase_admin import firestore
from collections import defaultdict
import uuid
import os # <--- NEW: Import os
import json # Already there, but reminding its use for json.loads

def get_firestore_db():
    return firestore.client()

# Get the Firestore client inside the function, after app.py has initialized it
try:
    db_client_global = firestore.client()
except ValueError:
    # This block is a fallback for when groups.py is run/imported without app.py
    # Ensure firebase_credentials.json is found relative to this file's location
    import firebase_admin
    from firebase_admin import credentials
    
    # --- CRITICAL FIX: Construct absolute path to credentials file ---
    current_dir = os.path.dirname(__file__)
    credentials_path = os.path.join(current_dir, "firebase_credentials.json")
    print(f"Groups.py: Attempting to load credentials from: {credentials_path}") # Debugging
    
    try:
        cred = credentials.Certificate(credentials_path)
        firebase_admin.initialize_app(cred)
        db_client_global = firestore.client()
        print("Groups.py: Firebase Admin SDK initialized successfully (fallback).")
    except FileNotFoundError:
        print(f"Groups.py Error: 'firebase_credentials.json' not found at {credentials_path}. Please ensure it's in the src/backend directory.")
        # Re-raise the error to prevent Flask from starting with uninitialized DB
        raise
    except Exception as e:
        print(f"Groups.py Error: Failed to initialize Firebase Admin SDK (fallback): {e}")
        raise

grouping_bp = Blueprint('grouping', __name__)

@grouping_bp.route('/run-grouping', methods=['GET'])
def run_grouping():
    db_instance = firestore.client()
    try:
        surveys = list(db_instance.collection("Surveys").stream())
        survey_data = [doc.to_dict() for doc in surveys]

        if not survey_data:
            return jsonify({"status": "success", "message": "No survey data available for grouping."}), 200

        group_dict = defaultdict(list)
        for user in survey_data:
            key = (user.get("problem"), user.get("cause"))
            if all(key):
                group_dict[key].append(user["userId"])

        for key, user_ids in group_dict.items():
            for i in range(0, len(user_ids), 10):
                group_members = user_ids[i:i+10]
                if len(group_members) > 0:
                    group_id = str(uuid.uuid4())
                    group_name = f"{key[0]}_{key[1]}_group_{i // 10 + 1}".replace(" ", "_")
                    try:
                        db_instance.collection("Groups").document(group_id).set({
                            "groupId": group_id,
                            "problem": key[0],
                            "cause": key[1],
                            "memberUserIds": group_members,
                            "memberCount": len(group_members),
                            "groupName": group_name
                        })
                    except Exception as e:
                        print(f"Error creating group {group_id}: {e}")

        community_dict = defaultdict(list)
        for user in survey_data:
            key = (user.get("problem"), user.get("effect"))
            if all(key):
                community_dict[key].append(user["userId"])

        for key, user_ids in community_dict.items():
            community_id = str(uuid.uuid4())
            community_name = f"{key[0]}_{key[1]}_community".replace(" ", "_")
            try:
                db_instance.collection("Communities").document(community_id).set({
                    "communityId": community_id,
                    "problem": key[0],
                    "effect": key[1],
                    "memberUserIds": user_ids,
                    "memberCount": len(user_ids),
                    "communityName": community_name
                })
            except Exception as e:
                print(f"Error creating community {community_id}: {e}")

        initial_friends_data = {}
        for user1 in survey_data:
            potential_friends = []
            for user2 in survey_data:
                if user1["userId"] != user2["userId"] and \
                   user1.get("problem") and user2.get("problem") and \
                   user1["problem"] == user2["problem"]:
                    potential_friends.append(user2["userId"])
            initial_friends_data[user1["userId"]] = {"userId": user1["userId"], "suggestedFriendIds": potential_friends[:5]}

        for user_id, data in initial_friends_data.items():
            try:
                db_instance.collection("InitialFriends").document(user_id).set(data)
            except Exception as e:
                print(f"Error creating initial friends for user {user_id}: {e}")

        return jsonify({"status": "success", "message": "Grouping and initial friend suggestions completed."}), 200
    except Exception as e:
        print(f"Error running grouping logic: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Failed to run grouping: {str(e)}"}), 500

@grouping_bp.route('/initial-friends/<user_id>', methods=['GET'])
def get_initial_friends(user_id):
    db_instance = firestore.client()
    try:
        friends_doc = db_instance.collection("InitialFriends").document(user_id).get()
        if friends_doc.exists:
            suggested_friend_ids = friends_doc.to_dict().get("suggestedFriendIds", [])
            
            suggested_friends_profiles = []
            if suggested_friend_ids:
                users_ref = db_instance.collection("Surveys")
                for friend_id in suggested_friend_ids:
                    user_profile_doc = users_ref.document(friend_id).get()
                    if user_profile_doc.exists:
                        profile = user_profile_doc.to_dict()
                        profile['userId'] = user_profile_doc.id
                        suggested_friends_profiles.append(profile)

            return jsonify({"status": "success", "suggestedFriends": suggested_friends_profiles}), 200
        else:
            return jsonify({"status": "success", "suggestedFriends": []}), 200
    except Exception as e:
        print(f"Error fetching initial friends for user {user_id}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Failed to fetch initial friends: {str(e)}"}), 500

@grouping_bp.route('/users/profiles', methods=['POST'])
def get_user_profiles_by_ids():
    db_instance = firestore.client()
    try:
        data = request.json
        user_ids = data.get('userIds', [])
        
        if not user_ids:
            return jsonify({"status": "success", "profiles": []}), 200

        profiles = []
        for user_id in user_ids:
            user_doc = db_instance.collection("Surveys").document(user_id).get()
            if user_doc.exists:
                profile_data = user_doc.to_dict()
                profile_data['userId'] = user_doc.id
                profiles.append(profile_data)
        
        return jsonify({"status": "success", "profiles": profiles}), 200
    except Exception as e:
        print(f"Error fetching user profiles by IDs: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Failed to fetch user profiles: {str(e)}"}), 500

@grouping_bp.route('/submit-survey', methods=['POST'])
def submit_survey():
    db_instance = firestore.client()
    data = request.json
    user_id = data.get('userId')
    if not user_id:
        return jsonify({"status": "error", "message": "User ID is required."}), 400
    try:
        db_instance.collection("Surveys").document(user_id).set(data)
        return jsonify({"status": "success", "message": "Survey submitted."}), 200
    except Exception as e:
        print(f"Error submitting survey for user {user_id}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Failed to submit survey: {str(e)}"}), 500

@grouping_bp.route('/join-group', methods=['POST'])
def join_group():
    db_instance = firestore.client()
    try:
        data = request.json
        group_id = data["groupId"]
        user_id = data["userId"]

        group_ref = db_instance.collection("Groups").document(group_id)
        group = group_ref.get()

        if not group.exists:
            return jsonify({"status": "error", "message": "Group not found."}), 404

        group_data = group.to_dict()
        if "memberUserIds" not in group_data:
            group_data["memberUserIds"] = []
        if "memberEmails" not in group_data:
            group_data["memberEmails"] = []

        if user_id not in group_data["memberUserIds"]:
            group_data["memberUserIds"].append(user_id)
            group_data["memberCount"] = len(group_data["memberUserIds"])
            group_ref.set(group_data)

        return jsonify({"status": "success", "message": "User added to group."}), 200

    except Exception as e:
        print(f"Error joining group: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500
@grouping_bp.route('/list', methods=['GET'])
def list_groups():
    db = get_firestore_db()
    try:
        # Reference to the "Groups" collection in Firestore
        groups_ref = db.collection("Groups")
        # Get all documents in the collection
        docs = groups_ref.stream()

        groups_list = []
        for doc in docs:
            group_data = doc.to_dict()
            group_data['id'] = doc.id # Add the document ID to the data
            groups_list.append(group_data)

        return jsonify({"status": "success", "groups": groups_list}), 200
    except Exception as e:
        print(f"Error listing groups: {e}")
        return jsonify({"status": "error", "message": f"Failed to retrieve groups: {str(e)}"}), 500
@grouping_bp.route('/create', methods=['POST'])
def create_group():
    db = get_firestore_db()
    try:
        # Get the JSON data sent from the frontend (from the modal)
        data = request.get_json()

        # Basic validation: Check if data was provided and required fields exist
        if not data:
            return jsonify({"status": "error", "message": "No data provided."}), 400

        group_type = data.get('type')        # e.g., "group" or "community"
        suggestion = data.get('suggestion')  # This will be the group/community name
        members = data.get('members', [])    # A list of invited member emails

        if not group_type or not suggestion:
            return jsonify({"status": "error", "message": "Missing 'type' or 'suggestion' fields."}), 400

        # Construct the Python dictionary (object) that will be saved to Firestore
        group_data = {
            "type": group_type,
            "name": suggestion, # Using 'suggestion' as the main name of the group/community
            "members": members,
            "createdAt": firestore.SERVER_TIMESTAMP, # Firestore automatically sets server time
            # You could add 'createdBy' if you have user authentication:
            # "createdBy": "user_id_here",
        }

        # Decide on the Firestore Document ID:
        # Option 1 (chosen here): Use the 'suggestion' (group name) as the document ID.
        #   - Pros: Easy to lookup by name.
        #   - Cons: 'suggestion' must be unique. If a group with the same name exists, it will be overwritten!
        #   - This matches the structure implied by your previous error ("groups/The talk show").
        doc_ref = db.collection("Groups").document(suggestion)
        doc_ref.set(group_data) # <--- THIS IS THE set() call, now with a proper object

        # Option 2 (Alternative - more common): Let Firestore auto-generate a unique ID.
        #   - Pros: Ensures unique IDs, no overwriting.
        #   - Cons: You need to store the generated ID if you want to reference it later.
        # new_doc_ref = db.collection("Groups").add(group_data)
        # group_id = new_doc_ref.id # The auto-generated ID

        return jsonify({
            "status": "success",
            "message": f"{group_type.capitalize()} '{suggestion}' created successfully!",
            "groupId": suggestion # Return the ID we used (or group_id from Option 2)
        }), 201 # 201 Created status code for successful creation

    except Exception as e:
        print(f"Error creating group/community: {e}")
        return jsonify({"status": "error", "message": f"Failed to create group/community: {str(e)}"}), 500

