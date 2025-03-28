
import { toast } from "@/components/ui/use-toast";

// This file handles communication with the backend server
// which runs the Python stress prediction model

type Answer = {
  questionId: number;
  value: number | string;
};

interface StressModelResponse {
  score: number;
  recommendations: string[];
}

// Function to send questionnaire data to the backend
export const getPredictionFromModel = async (answers: Answer[]): Promise<StressModelResponse> => {
  try {
    // In a real implementation, this would be an API call to your Node.js backend
    // which would then call the Python model
    const response = await fetch('/api/predict-stress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction from server');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling stress model API:', error);
    
    // If the API call fails, fall back to the client-side prediction
    // This ensures the app still works even if the backend is unavailable
    console.log('Falling back to client-side prediction');
    return fallbackPrediction(answers);
  }
};

// Fallback client-side prediction logic (same as the original stressPredictor.ts)
const fallbackPrediction = (answers: Answer[]): StressModelResponse => {
  // Simple algorithm to calculate stress score (0-100)
  let score = 0;
  
  // Process each answer to contribute to stress score
  answers.forEach(answer => {
    switch (answer.questionId) {
      case 1: // Current stress level
        score += typeof answer.value === 'number' ? answer.value * 5 : 0; // 0-10 scale → 0-50 points
        break;
      case 2: // Sleep hours
        if (typeof answer.value === 'number') {
          // Less sleep = more stress
          score += Math.max(0, 40 - (answer.value * 5)); // 0-8 hours → 40-0 points
        }
        break;
      case 3: // Exercise frequency
        if (typeof answer.value === 'number') {
          // Less exercise = more stress
          score += Math.max(0, 25 - (answer.value * 3.5)); // 0-7 times → 25-0 points
        }
        break;
      case 4: // Work-life balance
        if (typeof answer.value === 'string') {
          const balanceScores: Record<string, number> = {
            'Poor': 20,
            'Fair': 15,
            'Good': 7,
            'Excellent': 0
          };
          score += balanceScores[answer.value] || 10;
        }
        break;
      case 5: // Relaxation techniques
        if (typeof answer.value === 'string') {
          const relaxationScores: Record<string, number> = {
            'Never': 15,
            'Rarely': 10,
            'Sometimes': 7,
            'Often': 3,
            'Daily': 0
          };
          score += relaxationScores[answer.value] || 7;
        }
        break;
    }
  });
  
  // Clamp the score between 0 and 100
  score = Math.min(100, Math.max(0, score));
  
  // Generate recommendations based on score
  const recommendations = getRecommendations(score, answers);
  
  return { 
    score: Math.round(score), 
    recommendations 
  };
};

// Generate personalized recommendations based on score and answers
const getRecommendations = (score: number, answers: Answer[]): string[] => {
  const recommendations: string[] = [];

  // Get the answers by questionId for easier reference
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));
  
  // Basic stress management recommendations for everyone
  recommendations.push("Practice deep breathing for 5 minutes each day to activate your parasympathetic nervous system.");
  
  // Add specific recommendations based on stress level
  if (score > 60) {
    recommendations.push("Your stress levels are high. Consider talking to a mental health professional for personalized support.");
  }
  
  // Sleep recommendations
  const sleepHours = answerMap.get(2);
  if (typeof sleepHours === 'number' && sleepHours < 7) {
    recommendations.push(`You're getting ${sleepHours} hours of sleep. Try to increase your sleep to 7-8 hours per night for better stress management.`);
  }
  
  // Exercise recommendations
  const exerciseFrequency = answerMap.get(3);
  if (typeof exerciseFrequency === 'number' && exerciseFrequency < 3) {
    recommendations.push("Regular physical activity helps reduce stress. Aim for at least 3 days of exercise per week, even if it's just a 30-minute walk.");
  }
  
  // Work-life balance recommendations
  const workLifeBalance = answerMap.get(4);
  if (workLifeBalance === 'Poor' || workLifeBalance === 'Fair') {
    recommendations.push("Improve your work-life balance by setting boundaries. Consider scheduling dedicated time for relaxation and non-work activities.");
  }
  
  // Relaxation techniques recommendations
  const relaxationFrequency = answerMap.get(5);
  if (relaxationFrequency === 'Never' || relaxationFrequency === 'Rarely') {
    recommendations.push("Start incorporating relaxation techniques into your routine. Try meditation, progressive muscle relaxation, or guided imagery for 10 minutes daily.");
  }
  
  return recommendations;
};
