# src/backend/groups/groups_assign.py
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

cred = credentials.Certificate("src/config/dare-to-dream-9c136-firebase-adminsdk-fbsvc-ebb89d4994.json")  # update this path
firebase_admin.initialize_app(cred)

db = firestore.client()

def assign_users_to_groups():
    # Step 1: Fetch all users with surveys
    surveys_ref = db.collection("Surveys")
    surveys = list(surveys_ref.stream())
    print(f"Found {len(surveys)} surveys")

    # Step 2: Fetch all groups
    groups_ref = db.collection("Groups")
    groups = list(groups_ref.stream())
    print(f"Found {len(groups)} groups")

    # Build groups dictionary with tags and current members
    groups_data = {}
    for g in groups:
        data = g.to_dict()
        groups_data[g.id] = {
            "tags": data.get("tags", []),
            "members": set(data.get("members", [])),
            "ref": g.reference
        }

    # Step 3: For each user survey, find matching groups and assign user to those groups
    for survey in surveys:
        user_id = survey.id
        survey_data = survey.to_dict()
        user_problem = survey_data.get("problem")
        user_cause = survey_data.get("cause")

        # For each group, check if tags intersect with problem/cause
        for group_id, group_info in groups_data.items():
            if user_problem in group_info["tags"] or user_cause in group_info["tags"]:
                if user_id not in group_info["members"]:
                    group_info["members"].add(user_id)

    # Step 4: Update groups in Firestore
    for group_id, group_info in groups_data.items():
        group_ref = group_info["ref"]
        members_list = list(group_info["members"])
        group_ref.update({"members": members_list})
        print(f"Updated group {group_id} members: {members_list}")

if __name__ == "__main__":
    assign_users_to_groups()
