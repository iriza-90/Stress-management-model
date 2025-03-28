import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import pickle

# Step 1: Load the Dataset
df = pd.read_csv('stress.csv')
print(df.head())
print(df.describe())
# Step 2: Split the data into features (X) and target (y)
X = df.drop('Stress Level', axis=1)  # Features (input)
y = df['Stress Level']  # Target (output)

# Step 3: Split the data into Training and Testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Build a Random Forest Regressor Model (it works well for this kind of data)
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Step 5: Train the model on the training data
model.fit(X_train, y_train)

# Step 6: Evaluate the model on the test data
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse}")

# Step 7: Save the trained model (so you can use it later)
with open('stress_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# # Step 8: Visualize Actual vs Predicted Stress Levels (Optional but helps for better understanding)
# import matplotlib.pyplot as plt

# plt.scatter(y_test, y_pred)
# plt.xlabel('Actual Stress Level')
# plt.ylabel('Predicted Stress Level')
# plt.title('Actual vs Predicted Stress Level')
# plt.show()

