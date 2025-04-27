from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini using API key from .env
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

MODEL_NAME = "models/gemini-1.5-pro-latest"
model = genai.GenerativeModel(MODEL_NAME)



@app.route('/')
def home():
    return "Hey sugar! 🧷 TooSugary is up and running! Try sending a POST request to /message ✨"



@app.route('/message', methods=['POST'])
def handle_message():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()

        if not user_message:
            return jsonify({'reply': 'Please enter a message.'})

        prompt = f"""You are TooSugary, a friendly health assistant. Respond briefly to this health query:
        {user_message}
        - Keep the response short and concise
        - Be friendly and casual
        - Use Gen Z language (e.g., \"No worries\", \"Chill\", \"You're good\", \"Stay healthy\", etc.)
        - Provide general wellness advice only
        - Never diagnose or prescribe
        - For serious symptoms, recommend seeing a doctor
        """

        response = model.generate_content(prompt)

        if hasattr(response, 'text'):
            return jsonify({'reply': response.text})
        else:
            return jsonify({'reply': 'Hmm, I didn’t quite get that. Try again?'})

    except Exception as e:
        print(f"🔥 Error: {str(e)}")
        return jsonify({'reply': 'Sorry, I encountered an error! Please try again.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)