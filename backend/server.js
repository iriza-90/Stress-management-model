const express = require("express");
const bodyParser = require("body-parser");
const { PythonShell } = require("python-shell");

const app = express();
const port = 5000;  // Port for your backend API

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint for stress prediction
app.post("/predict", (req, res) => {
  const { sleep, screenTime, exercise, caffeine, workHours, socialTime } = req.body;

  // Prepare the input data for the model (sent as an array)
  const inputData = [[sleep, screenTime, exercise, caffeine, workHours, socialTime]];

  // Run the Python script to predict the stress level
  const options = {
    mode: "text",
    pythonPath: "python",  // This will use the global python environment
    pythonOptions: ["-u"], // Unbuffered output
    scriptPath: "./backend", // Path to your Python script
    args: [JSON.stringify(inputData)],  // Pass the input data to the Python script
  };

  PythonShell.run("predict_stress.py", options, (err, result) => {
    if (err) {
      console.error("Error in prediction:", err);
      return res.status(500).send("Error making prediction");
    }

    // Log the result for debugging
    console.log("Python script result:", result);

    
    const prediction = result[0];

    
    res.json({ predictedStressLevel: prediction });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
