import os
import json
import re
from flask import Flask, request, jsonify, render_template
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set up Gemini client with API key
genai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
model = "gemini-1.5-flash"  # You can also use "gemini-2.0"

def extract_profile(text):
    prompt = f"""
You are an AI assistant. Given a natural language user input, extract the following:

- age (number)
- employment_status (student, employed, unemployed, retired)
- location (any city or state in India)
- income (annual income in INR, interpret "no income" as 0)
- disability_status (yes or no)

Only return a valid JSON object. If any field is missing, include it with a value of null.

Examples:

Input: "I’m 19, a student from Delhi. No disability. Earning 2.5 lakhs annually."
Output: {{
  "age": 19,
  "employment_status": "student",
  "location": "Delhi",
  "income": 250000,
  "disability_status": "no"
}}

Input: "I have no income and no disability."
Output: {{
  "age": null,
  "employment_status": null,
  "location": null,
  "income": 0,
  "disability_status": "no"
}}

Input: "{text}"
"""

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain"
    )

    try:
        result = ""
        for chunk in genai_client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            result += chunk.text

        # Extract JSON object from the response
        json_str_match = re.search(r"\{[\s\S]*\}", result)
        if not json_str_match:
            return {"error": "No valid JSON object found in response."}
        json_str = json_str_match.group(0)
        profile = json.loads(json_str)

        # Identify missing fields
        missing_fields = [key for key, value in profile.items() if value is None]
        profile["missing_fields"] = missing_fields
        return profile
    except Exception as e:
        return {"error": str(e)}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/extract", methods=["POST"])
def extract():
    data = request.get_json()
    user_input = data.get("message", "")
    result = extract_profile(user_input)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
