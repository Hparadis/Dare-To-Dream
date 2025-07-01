# src/backend/ai_routes.py
from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import google.generativeai as genai
import os
import json
import traceback # <--- NEW: Import traceback for detailed error logging

ai_bp = Blueprint('ai', __name__)

# Configure the Gemini API key
if os.getenv("AIzaSyAVblKSK0JxIl3A_eQ_hGbQtUrUIP6lMHQ"):
    genai.configure(api_key=os.getenv("AIzaSyAVblKSK0JxIl3A_eQ_hGbQtUrUIP6lMHQ"))
    print("Gemini API configured using GEMINI_API_KEY environment variable.")
else:
    genai.configure(api_key="") # Canvas will inject the key if empty for allowed models.
    print("Gemini API configured with empty key (expecting Canvas injection or ADC).")

model = genai.GenerativeModel('gemini-2.0-flash')

@ai_bp.route('/moderate-content', methods=['POST'])
def moderate_content():
    """
    Receives text content (e.g., a user post or comment) and uses AI to
    moderate it for negativity, trolling, or irrelevance to mental health support.
    """
    print("--- Starting Content Moderation Request ---")
    try:
        data = request.get_json()
        content_text = data.get('text', '')

        print(f"Received content for moderation: '{content_text[:100]}...'") # Log beginning of content

        if not content_text:
            print("Moderation: No text content provided.")
            return jsonify({"status": "error", "message": "No text content provided for moderation."}), 400

        prompt = f"""
        You are an AI content moderator for a mental health support application called "DareToDream".
        Your primary goal is to ensure a safe, supportive, and on-topic environment for users.
        
        Analyze the following user-generated content: "{content_text}"
        
        Determine if the content is:
        1.  **Negative/Harmful:** Contains hate speech, threats, harassment, excessive negativity, self-harm promotion, or bullying.
        2.  **Trolling/Disruptive:** Intentionally provokes, offends, or disrupts constructive conversation.
        3.  **Off-topic:** Not related to mental health support, personal challenges, or the app's purpose (e.g., spam, advertisements, unrelated personal anecdotes).
        
        If the content is problematic, identify the primary category (Negative/Harmful, Trolling/Disruptive, Off-topic) and provide a brief reason.
        
        Return your analysis in a JSON format.
        
        Example of a SAFE response:
        ```json
        {{
            "is_problematic": false,
            "category": null,
            "reason": null
        }}
        ```
        
        Example of a PROBLEMATIC response:
        ```json
        {{
            "is_problematic": true,
            "category": "Negative/Harmful",
            "reason": "The content contains overly negative and hopeless language."
        }}
        ```
        
        Example of an OFF-TOPIC response:
        ```json
        {{
            "is_problematic": true,
            "category": "Off-topic",
            "reason": "The content is an advertisement for a commercial product."
        }}
        ```
        
        Ensure your response is valid JSON.
        """

        print("Calling Gemini API...")
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        print(f"Gemini API call successful. Raw AI Response Text: {response.text}")

        ai_analysis = {}
        try:
            ai_analysis = json.loads(response.text)
            print(f"Successfully parsed AI response: {ai_analysis}")
        except json.JSONDecodeError as e:
            print(f"Error decoding AI response JSON: {e}. Raw text: {response.text}")
            return jsonify({"status": "error", "message": "AI returned invalid JSON format.", "raw_ai_response": response.text}), 500
        except Exception as e:
            print(f"Unexpected error parsing AI response: {e}")
            return jsonify({"status": "error", "message": "Unexpected error parsing AI response.", "raw_ai_response": response.text}), 500

        if not isinstance(ai_analysis, dict) or "is_problematic" not in ai_analysis:
            print("AI response missing 'is_problematic' or not a dictionary.")
            return jsonify({"status": "error", "message": "AI returned unexpected JSON structure.", "ai_response": ai_analysis}), 500

        print("--- Content Moderation Successful ---")
        return jsonify({"status": "success", "moderation_result": ai_analysis}), 200

    except Exception as e:
        print(f"Caught an unexpected exception in moderate_content: {e}")
        traceback.print_exc() # Print full traceback to console
        print("--- Content Moderation Failed ---")
        return jsonify({"status": "error", "message": f"Content moderation failed: {str(e)}"}), 500

