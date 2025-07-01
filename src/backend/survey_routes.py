from flask import Blueprint, request, jsonify
from firebase_admin import firestore


survey_bp = Blueprint('survey', __name__)

@survey_bp.route('/submit-survey', methods=['POST'])
def submit_survey():
    db = firestore.client()
    data = request.json
    user_id = data.get('userId')
    if not user_id:
        return jsonify({"status": "error", "message": "User ID is required."}), 400
    try:
        db.collection("Surveys").document(user_id).set(data)
        return jsonify({"status": "success", "message": "Survey submitted."}), 200
    except Exception as e:
        print(f"Error submitting survey for user {user_id}: {e}")
        return jsonify({"status": "error", "message": f"Failed to submit survey: {str(e)}"}), 500