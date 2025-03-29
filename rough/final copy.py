import google.generativeai as genai
import pandas as pd
import json

# Configure Gemini API
genai.configure(api_key="KEY GOES HERE")
model = genai.GenerativeModel(
    'gemini-1.5-flash-latest',
    generation_config={"temperature": 0.1, "max_output_tokens": 1000},  # Reduced temperature for more consistent outputs
    safety_settings={}
)

# Initialize user profile with None values
user_profile = {
    "Age": None,
    "State": None,
    "Employment_Status": None,
    "Salary": None,
    "Gender": None,
    "Disability": None
}

def extract_info(text):
    prompt = f"""Extract these details from the text. Return ONLY valid JSON with keys: Age, State, Employment_Status, Salary, Gender, Disability.
    
    Rules:
    - Age should be a number or null
    - Convert salary to numeric (e.g., 'no salary' → 0, '50k' → 50000)
    - Use standard Indian state names (e.g., write "Maharashtra" not "Bombay")
    - Employment_Status must be one of: student/retired/employed/unemployed
    - Disability must be boolean (true/false)
    - Gender must be standardized as: Male/Female/Other or null
    - Return null for any field not mentioned in the text
    
    Text: {text}
    
    JSON Response Format:
    {{
      "Age": null,
      "State": null,
      "Employment_Status": null,
      "Salary": null,
      "Gender": null,
      "Disability": null
    }}"""
    
    try:
        response = model.generate_content(prompt)
        # Clean the response to ensure we get valid JSON
        json_str = response.text.strip()
        if '```json' in json_str:
            json_str = json_str.split('```json')[1].split('```')[0].strip()
        elif '```' in json_str:
            json_str = json_str.split('```')[1].split('```')[0].strip()
        
        data = json.loads(json_str)
        
        # Validate and sanitize the data
        if 'Age' in data and data['Age'] is not None:
            try:
                data['Age'] = int(data['Age'])
            except:
                data['Age'] = None
        
        if 'Salary' in data and data['Salary'] is not None:
            try:
                data['Salary'] = int(float(str(data['Salary']).replace(',', '')))
            except:
                data['Salary'] = None
        
        if 'Employment_Status' in data and data['Employment_Status'] is not None:
            if data['Employment_Status'].lower() not in ['student', 'retired', 'employed', 'unemployed']:
                data['Employment_Status'] = None
            else:
                data['Employment_Status'] = data['Employment_Status'].lower()
        
        if 'Disability' in data and data['Disability'] is not None:
            if isinstance(data['Disability'], str):
                data['Disability'] = data['Disability'].lower() in ['true', 'yes', '1']
        
        if 'Gender' in data and data['Gender'] is not None:
            if data['Gender'].lower() in ['male', 'm']:
                data['Gender'] = 'Male'
            elif data['Gender'].lower() in ['female', 'f']:
                data['Gender'] = 'Female'
            elif data['Gender'].lower() in ['other', 'non-binary', 'nonbinary']:
                data['Gender'] = 'Other'
            else:
                data['Gender'] = None
        
        return data
    except Exception as e:
        print(f"Error parsing response: {e}")
        return {}

def get_next_question(profile):
    priority_order = ['Age', 'State', 'Employment_Status', 'Salary', 'Gender', 'Disability']
    questions = {
        "Age": "Could you share your age?",
        "State": "Which Indian state are you currently residing in?",
        "Employment_Status": "Are you currently a student, employed, unemployed, or retired?",
        "Salary": "What's your approximate monthly income (in INR)? (Enter 0 if unemployed/student)",
        "Gender": "How do you identify your gender?",
        "Disability": "Do you have any officially recognized disability? (Yes/No)"
    }
    
    # Check if salary needs to be asked (only if employment status is employed)
    if profile['Employment_Status'] == 'employed' and profile['Salary'] is None:
        return questions['Salary']
    
    # Skip salary question if not employed
    if profile['Employment_Status'] in ['student', 'unemployed', 'retired'] and profile['Salary'] is None:
        profile['Salary'] = 0
    
    for field in priority_order:
        if profile[field] is None:
            return questions[field]
    return None

def find_schemes(user_profile, df):
    matching_schemes = []
    
    for _, scheme in df.iterrows():
        eligible = True
        reasons = []
        
        # Check age criteria
        if pd.notna(scheme['min_age']) and pd.notna(scheme['max_age']) and user_profile['Age'] is not None:
            if not (scheme['min_age'] <= user_profile['Age'] <= scheme['max_age']):
                eligible = False
            else:
                reasons.append(f"Age {user_profile['Age']} is within range {scheme['min_age']}-{scheme['max_age']}")
        
        # Check state criteria
        if pd.notna(scheme['states']) and user_profile['State'] is not None:
            states_list = [s.strip() for s in scheme['states'].split(',')]
            if scheme['states'] != 'All' and user_profile['State'] not in states_list:
                eligible = False
            else:
                reasons.append(f"State {user_profile['State']} is eligible")
        
        # Check employment criteria
        if pd.notna(scheme['employment']) and user_profile['Employment_Status'] is not None:
            if scheme['employment'] != 'Any' and user_profile['Employment_Status'] != scheme['employment']:
                eligible = False
            else:
                reasons.append(f"Employment status ({user_profile['Employment_Status']}) matches")
        
        # Check salary criteria
        if user_profile['Salary'] is not None:
            min_salary_check = not pd.notna(scheme['min_salary']) or user_profile['Salary'] >= scheme['min_salary']
            max_salary_check = not pd.notna(scheme['max_salary']) or user_profile['Salary'] <= scheme['max_salary']
            
            if not (min_salary_check and max_salary_check):
                eligible = False
            else:
                salary_reason = "Salary is within range"
                if pd.notna(scheme['min_salary']) and pd.notna(scheme['max_salary']):
                    salary_reason += f" ({scheme['min_salary']}-{scheme['max_salary']})"
                reasons.append(salary_reason)
        
        # Check gender criteria
        if pd.notna(scheme['gender']) and user_profile['Gender'] is not None:
            if scheme['gender'] != 'Any' and user_profile['Gender'] != scheme['gender']:
                eligible = False
            else:
                reasons.append(f"Gender criteria met")
        
        # Check disability criteria
        if pd.notna(scheme['disability']) and user_profile['Disability'] is not None:
            if scheme['disability'] == 'Yes' and user_profile['Disability'] != True:
                eligible = False
            elif scheme['disability'] != 'Any' and scheme['disability'] != 'Yes' and user_profile['Disability'] == True:
                eligible = False
            else:
                reasons.append(f"Disability criteria met")
        
        if eligible:
            matching_schemes.append({
                "name": scheme['Scheme Name'],
                "reasons": reasons
            })
    
    # Format results
    if matching_schemes:
        result = "Based on your profile, here are the schemes you're eligible for:\n\n"
        for i, scheme in enumerate(matching_schemes, 1):
            result += f"{i}. {scheme['name']}\n"
            result += "   Eligibility: " + ", ".join(scheme['reasons']) + "\n\n"
    else:
        result = "No eligible schemes found based on your current profile. Consider updating your information or checking back later as new schemes become available."
    
    return result

# Chat flow
def run_chat():
    print("Bot: Welcome to Scheme Finder! Let's start with some basic details.")
    print("Bot: You can share information in any format, or I'll ask specific questions.")
    
    # Load schemes data
    try:
        df = pd.read_csv('schemes.csv')
    except Exception as e:
        print(f"Error loading schemes data: {e}")
        df = pd.DataFrame({
            'Scheme Name': ['Scholarship for Students', 'Employment Grant', 'Disability Pension'],
            'min_age': [18, 21, None],
            'max_age': [30, 60, None],
            'states': ['Maharashtra, Karnataka', 'Delhi, Tamil Nadu', 'All'],
            'employment': ['student', 'employed', 'Any'],
            'min_salary': [0, 25000, 0],
            'max_salary': [30000, 100000, None],
            'gender': ['Any', 'Any', 'Any'],
            'disability': ['Any', 'Any', 'Yes']
        })
    
    # Main conversation loop
    while not all(user_profile.values()):
        user_input = input("\nYou: ")
        
        if user_input.lower() in ['exit', 'quit']:
            print("Bot: Goodbye!")
            return
        
        # Extract information using Gemini
        extracted = extract_info(user_input)
        
        # Update profile (only overwrite if new value exists)
        for key in extracted:
            if extracted[key] is not None:
                user_profile[key] = extracted[key]
        
        # Show current profile
        print("Bot: I've updated your profile with the following information:")
        for key, value in user_profile.items():
            if value is not None:
                print(f"- {key.replace('_', ' ')}: {value}")
        
        # Get next question if needed
        next_q = get_next_question(user_profile)
        if next_q:
            print(f"Bot: {next_q}")
        else:
            break
    
    # Find matching schemes
    scheme_results = find_schemes(user_profile, df)
    print(f"\nBot: {scheme_results}")

if __name__ == "__main__":
    run_chat()