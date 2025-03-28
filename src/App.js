import { useState } from "react"; 
import axios from "axios";

export default function StressForm() {
  const [formData, setFormData] = useState({
    sleep: "",
    screenTime: "",
    exercise: "",
    caffeine: "",
    workHours: "",
    socialTime: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simple validation check
    if (Object.values(formData).some(value => value === "" || isNaN(value))) {
      alert("Please fill in all fields with valid numbers.");
      return;
    }
  
    setLoading(true);
    setError(null);  // Reset error state before making the request
  
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      console.log("Prediction Response:", response);  // Log the response from backend
      setPrediction(response.data.predictedStressLevel);  // Corrected field to match the backend response
    } catch (error) {
      setError("Error fetching prediction. Please try again later.");
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl space-y-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">🌿 Stress Level Predictor</h2>
        <p className="text-center text-gray-500 mb-6">Fill out the form below to get an estimate of your stress level!</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="sleep" className="block text-gray-700 font-medium mb-2">😴 Sleep hours</label>
              <input
                type="number"
                name="sleep"
                id="sleep"
                placeholder="Enter hours of sleep"
                onChange={handleChange}
                value={formData.sleep}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="screenTime" className="block text-gray-700 font-medium mb-2">📱 Screen time (hrs)</label>
              <input
                type="number"
                name="screenTime"
                id="screenTime"
                placeholder="Enter hours of screen time"
                onChange={handleChange}
                value={formData.screenTime}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="exercise" className="block text-gray-700 font-medium mb-2">🏋️ Exercise (days/week)</label>
              <input
                type="number"
                name="exercise"
                id="exercise"
                placeholder="Enter days of exercise per week"
                onChange={handleChange}
                value={formData.exercise}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="caffeine" className="block text-gray-700 font-medium mb-2">☕ Caffeine (cups/day)</label>
              <input
                type="number"
                name="caffeine"
                id="caffeine"
                placeholder="Enter cups of caffeine per day"
                onChange={handleChange}
                value={formData.caffeine}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="workHours" className="block text-gray-700 font-medium mb-2">💼 Work hours/day</label>
              <input
                type="number"
                name="workHours"
                id="workHours"
                placeholder="Enter work hours per day"
                onChange={handleChange}
                value={formData.workHours}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="socialTime" className="block text-gray-700 font-medium mb-2">🧑‍🤝‍🧑 Social interactions (hrs)</label>
              <input
                type="number"
                name="socialTime"
                id="socialTime"
                placeholder="Enter social hours"
                onChange={handleChange}
                value={formData.socialTime}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "🔄 Predicting..." : "🔮 Predict Stress Level"}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-lg font-semibold text-center bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
            {error}
          </p>
        )}

        {prediction && (
          <p className="mt-6 text-lg font-semibold text-center bg-blue-100 text-blue-700 p-4 rounded-lg shadow-md">
            Predicted Stress Level: {prediction}
          </p>
        )}
      </div>
    </div>
  );
}
