
#!/usr/bin/env python3
"""
Stress Prediction Model

This script implements a machine learning model to predict stress levels
based on questionnaire responses. It uses a simple Random Forest model
trained on a dataset of stress-related features.
"""

import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder

# Load and process input data from stdin
def load_input_data():
    """Load and parse the JSON input data passed from Node.js."""
    try:
        # Get the command line argument (JSON string)
        json_str = sys.argv[1]
        answers = json.loads(json_str)
        return answers
    except Exception as e:
        print(json.dumps({"error": f"Failed to parse input data: {str(e)}"}))
        sys.exit(1)

# Sample dataset creation (in a real implementation, you'd load from a file)
def create_sample_dataset():
    """
    Create a synthetic dataset for training the stress prediction model.
    
    This function generates synthetic data that resembles real stress assessment data.
    In a production system, you would replace this with loading your actual dataset.
    """
    np.random.seed(42)  # For reproducibility
    
    # Generate 1000 synthetic records
    n_samples = 1000
    
    # Generate features
    stress_levels = np.random.uniform(0, 10, n_samples)  # Current stress (0-10)
    sleep_hours = np.random.uniform(4, 10, n_samples)    # Sleep hours (4-10)
    exercise_days = np.random.randint(0, 8, n_samples)   # Exercise days per week (0-7)
    
    # Categorical features
    work_life_balance = np.random.choice(['Poor', 'Fair', 'Good', 'Excellent'], n_samples)
    relaxation = np.random.choice(['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'], n_samples)
    
    # Calculate target (stress score) with some noise
    # This formula simulates how different factors might affect stress
    stress_score = (
        stress_levels * 5 +                             # Higher self-reported stress → higher score
        np.maximum(0, 40 - (sleep_hours * 5)) +         # Less sleep → higher score
        np.maximum(0, 25 - (exercise_days * 3.5))       # Less exercise → higher score
    )
    
    # Add influence from categorical variables
    wlb_effect = {'Poor': 20, 'Fair': 15, 'Good': 7, 'Excellent': 0}
    relaxation_effect = {'Never': 15, 'Rarely': 10, 'Sometimes': 7, 'Often': 3, 'Daily': 0}
    
    for i in range(n_samples):
        stress_score[i] += wlb_effect[work_life_balance[i]]
        stress_score[i] += relaxation_effect[relaxation[i]]
    
    # Add some random noise
    stress_score += np.random.normal(0, 5, n_samples)
    
    # Ensure scores are between 0 and 100
    stress_score = np.clip(stress_score, 0, 100)
    
    # Create DataFrame
    data = pd.DataFrame({
        'stress_level': stress_levels,
        'sleep_hours': sleep_hours,
        'exercise_days': exercise_days,
        'work_life_balance': work_life_balance,
        'relaxation': relaxation,
        'stress_score': stress_score
    })
    
    return data

# Process the user's answers into a format suitable for the model
def process_answers(answers):
    """Convert the JSON answer format to features the model can use."""
    features = {}
    
    for answer in answers:
        q_id = answer['questionId']
        value = answer['value']
        
        if q_id == 1:  # Current stress level
            features['stress_level'] = float(value) if isinstance(value, (int, float)) else 5.0
        elif q_id == 2:  # Sleep hours
            features['sleep_hours'] = float(value) if isinstance(value, (int, float)) else 7.0
        elif q_id == 3:  # Exercise frequency
            features['exercise_days'] = int(value) if isinstance(value, (int, float)) else 3
        elif q_id == 4:  # Work-life balance
            features['work_life_balance'] = value if isinstance(value, str) else 'Fair'
        elif q_id == 5:  # Relaxation techniques
            features['relaxation'] = value if isinstance(value, str) else 'Sometimes'
    
    return features

# Train the model on our dataset
def train_model(data):
    """Train a Random Forest model on the stress dataset."""
    # Prepare categorical features
    categorical_cols = ['work_life_balance', 'relaxation']
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    
    # Create model features
    X_cat = encoder.fit_transform(data[categorical_cols])
    X_num = data[['stress_level', 'sleep_hours', 'exercise_days']].values
    X = np.hstack([X_num, X_cat])
    
    # Target variable
    y = data['stress_score'].values
    
    # Train Random Forest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    return model, encoder, categorical_cols

# Generate personalized recommendations based on the user's data
def generate_recommendations(features, stress_score):
    """Generate personalized stress management recommendations."""
    recommendations = []
    
    # Basic recommendation for everyone
    recommendations.append("Practice deep breathing for 5 minutes each day to activate your parasympathetic nervous system.")
    
    # Add specific recommendations based on stress level
    if stress_score > 60:
        recommendations.append("Your stress levels are high. Consider talking to a mental health professional for personalized support.")
    
    # Sleep recommendations
    if features.get('sleep_hours', 8) < 7:
        recommendations.append(f"You're getting {features.get('sleep_hours')} hours of sleep. Try to increase your sleep to 7-8 hours per night for better stress management.")
    
    # Exercise recommendations
    if features.get('exercise_days', 0) < 3:
        recommendations.append("Regular physical activity helps reduce stress. Aim for at least 3 days of exercise per week, even if it's just a 30-minute walk.")
    
    # Work-life balance recommendations
    if features.get('work_life_balance') in ['Poor', 'Fair']:
        recommendations.append("Improve your work-life balance by setting boundaries. Consider scheduling dedicated time for relaxation and non-work activities.")
    
    # Relaxation techniques recommendations
    if features.get('relaxation') in ['Never', 'Rarely']:
        recommendations.append("Start incorporating relaxation techniques into your routine. Try meditation, progressive muscle relaxation, or guided imagery for 10 minutes daily.")
    
    return recommendations

# Make a prediction for a new user
def predict_stress(model, encoder, categorical_cols, features):
    """Use the trained model to predict stress score for new input."""
    # Prepare input features for prediction
    X_num = np.array([[
        features.get('stress_level', 5.0),
        features.get('sleep_hours', 7.0),
        features.get('exercise_days', 3)
    ]])
    
    # One-hot encode categorical features
    cat_features = pd.DataFrame({
        'work_life_balance': [features.get('work_life_balance', 'Fair')],
        'relaxation': [features.get('relaxation', 'Sometimes')]
    })
    X_cat = encoder.transform(cat_features[categorical_cols])
    
    # Combine features
    X = np.hstack([X_num, X_cat])
    
    # Make prediction
    predicted_score = model.predict(X)[0]
    predicted_score = max(0, min(100, predicted_score))  # Ensure score is between 0-100
    
    return round(predicted_score)

def main():
    """Main function to process inputs and return predictions."""
    try:
        # Get answers from input
        answers = load_input_data()
        
        # In a real implementation, the model would be pre-trained and loaded
        # For this example, we create a synthetic dataset and train on the fly
        data = create_sample_dataset()
        model, encoder, categorical_cols = train_model(data)
        
        # Process the user's answers into model features
        features = process_answers(answers)
        
        # Make prediction
        predicted_score = predict_stress(model, encoder, categorical_cols, features)
        
        # Generate recommendations
        recommendations = generate_recommendations(features, predicted_score)
        
        # Prepare and return the result
        result = {
            "score": predicted_score,
            "recommendations": recommendations
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "error": f"An error occurred: {str(e)}",
            "score": 50,  # Fallback score
            "recommendations": ["General stress management recommendation as fallback."]
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
