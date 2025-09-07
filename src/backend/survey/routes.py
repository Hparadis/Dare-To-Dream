from flask import Blueprint, request, jsonify
from src.backend.survey.services import submit_survey, fetch_surveys_for_user
from src.backend.utils.auth import verify_firebase_token

survey_bp = Blueprint("survey", __name__, url_prefix="/api/survey")

@survey_bp.route("/submit", methods=["POST"])
def handle_survey_submit():
    try:
        auth_header = request.headers.get("Authorization", "")
        id_token = auth_header.replace("Bearer ", "")
        user_id = None

        if id_token:
            decoded = verify_firebase_token(id_token)
            user_id = decoded.get("uid")

        data = request.get_json()
        if not user_id:
            user_id = data.get("userId")

        if not user_id:
            raise ValueError("Missing userId")

        data["userId"] = user_id
        doc_id = submit_survey(data)
        return jsonify({"message": "Survey submitted", "surveyId": doc_id}), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500

@survey_bp.route("", methods=["GET"])
def get_surveys():
    user_id = request.args.get("userId")
    try:
        surveys = fetch_surveys_for_user(user_id)
        return jsonify({"surveys": surveys}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to fetch surveys"}), 500
