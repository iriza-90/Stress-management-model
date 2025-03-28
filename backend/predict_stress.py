import pickle
import sys
import numpy as np

# Load the trained model
with open('stress_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Parse the input data (this will be passed from the Node.js server)
input_data = sys.argv[1]
input_data = np.array(eval(input_data))  # Convert the input string back into an array

# Make a prediction
prediction = model.predict(input_data)

# Output the prediction (this will be returned to Node.js)
print(prediction[0])
