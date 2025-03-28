
// This file represents the Node.js backend server that would 
// interface between the React frontend and the Python model

const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint to handle stress prediction
app.post('/api/predict-stress', (req, res) => {
  const { answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid input: answers must be an array' });
  }
  
  // Prepare data to send to Python script
  const dataString = JSON.stringify(answers);
  
  // Spawn Python process
  const pythonProcess = spawn('python', ['./model/stress_model.py', dataString]);
  
  let result = '';
  
  // Collect data from Python script
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });
  
  // Handle errors in Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });
  
  // When Python process ends, send response
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).json({ error: 'Model prediction failed' });
    }
    
    try {
      const prediction = JSON.parse(result);
      res.json(prediction);
    } catch (error) {
      console.error('Error parsing Python output:', error);
      res.status(500).json({ error: 'Failed to parse model output' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Note: In a production environment, you would want to add:
// - Error handling middleware
// - Request validation
// - Authentication/authorization
// - HTTPS support
// - Rate limiting
