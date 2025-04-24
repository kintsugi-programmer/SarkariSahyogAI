from flask import Flask, request, jsonify, render_template
from PIL import Image
import os
import shutil
import base64
import google.generativeai as genai
import json
import re

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure Gemini Generative AI
genai.configure(api_key="AIzaSyC05dOo51w_MBUM6f3oH9Lvo-MeSbnzTRE")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'front_image' not in request.files or 'back_image' not in request.files:
        return jsonify({'error': 'Both front and back images are required'}), 400

    front_image = request.files['front_image']
    back_image = request.files['back_image']

    if front_image.filename == '' or back_image.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    front_path = os.path.join(app.config['UPLOAD_FOLDER'], 'front_' + front_image.filename)
    back_path = os.path.join(app.config['UPLOAD_FOLDER'], 'back_' + back_image.filename)

    front_image.save(front_path)
    back_image.save(back_path)

    try:
        # Prepare prompt for Gemini Generative AI
        prompt = """
        You are an advanced OCR AI. Extract Aadhaar card details from the provided images.
        The fields to populate are:
        - Aadhaar Number
        - Name
        - Date of Birth
        - Gender
        - Address

        Return ONLY a valid JSON object with these fields as keys. If a field cannot be extracted, set its value to null.
        Format: {"Aadhaar Number": "1234 5678 9012", "Name": "John Doe", "Date of Birth": "01/01/1990", "Gender": "Male", "Address": "123 Main St"}
        """

        # Create model instance
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Process front and back images
        with open(front_path, "rb") as f:
            front_image_data = f.read()
            
        with open(back_path, "rb") as f:
            back_image_data = f.read()

        # Create multipart content with images and prompt
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": front_image_data},
            {"mime_type": "image/jpeg", "data": back_image_data}
        ])
        
        # Try to extract JSON from the response text
        response_text = response.text
        json_match = re.search(r'({[\s\S]*})', response_text)
        
        if json_match:
            json_str = json_match.group(1)
            try:
                extracted_data = json.loads(json_str)
            except:
                # If JSON parsing fails, create an empty structure
                extracted_data = {
                    "Aadhaar Number": "",
                    "Name": "",
                    "Date of Birth": "",
                    "Gender": "",
                    "Address": ""
                }
        else:
            # If no JSON found, create an empty structure
            extracted_data = {
                "Aadhaar Number": "",
                "Name": "",
                "Date of Birth": "",
                "Gender": "",
                "Address": ""
            }
        
        # Clean up files
        if os.path.exists(front_path):
            os.remove(front_path)
        if os.path.exists(back_path):
            os.remove(back_path)
            
        # Return JSON response instead of rendering template
        return jsonify({'extracted_data': extracted_data, 'raw_response': response_text})
    
    except Exception as e:
        # Clean up files on error
        if os.path.exists(front_path):
            os.remove(front_path)
        if os.path.exists(back_path):
            os.remove(back_path)
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/submit', methods=['POST'])
def submit_application():
    data = request.json
    # Process the submitted application data (e.g., save to database or send to API)
    return jsonify({'message': 'Application submitted successfully!'})

if __name__ == '__main__':
    app.run(debug=True)