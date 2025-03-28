
# Stress Predictor Application

This application helps users assess their stress levels and provides personalized recommendations for stress management.

## Project Structure

The project consists of three main parts:

1. **React Frontend** - A user-friendly interface for taking the stress assessment
2. **Node.js Backend** - A server that processes requests and communicates with the model
3. **Python ML Model** - A machine learning model that predicts stress levels

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- Python 3.8+
- npm or yarn

### Frontend Setup

```bash
# In the root directory
npm install
npm run dev
```

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
npm run dev
```

## How It Works

1. Users complete a questionnaire about their stress, sleep, exercise, work-life balance, and relaxation.
2. The frontend sends this data to the Node.js backend.
3. The backend passes the data to a Python script that runs a Random Forest model.
4. The model predicts a stress score and generates personalized recommendations.
5. Results are displayed to the user in a visually appealing way.

## Model Details

The stress prediction model uses a Random Forest algorithm trained on synthetic data that represents patterns of how various lifestyle factors affect stress levels. Features include:

- Self-reported current stress level
- Hours of sleep
- Exercise frequency
- Work-life balance quality
- Frequency of relaxation techniques

The model outputs a stress score (0-100) and customized recommendations based on the user's specific answers.

## Development Notes

- In production, the model would be pre-trained and saved to disk, then loaded when needed.
- The synthetic dataset generation is included for demonstration purposes; a real application would use actual data.
- The frontend includes fallback logic to ensure functionality even if the backend is unavailable.

## License

[MIT License](LICENSE)
