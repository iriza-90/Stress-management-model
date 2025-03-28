
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StressResultProps {
  stressScore: number;
  recommendations: string[];
  onReset: () => void;
}

const StressResult: React.FC<StressResultProps> = ({ stressScore, recommendations, onReset }) => {
  // Define stress level labels based on score
  const getStressLevel = () => {
    if (stressScore <= 30) return { level: 'Low', color: 'text-green-500' };
    if (stressScore <= 60) return { level: 'Moderate', color: 'text-amber-500' };
    return { level: 'High', color: 'text-red-500' };
  };

  const { level, color } = getStressLevel();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-calm-dark">Your Stress Assessment Results</CardTitle>
        <CardDescription className="text-center">
          Based on your responses, we've calculated your stress level
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Stress Level: <span className={color}>{level}</span></h3>
          <div className="mb-2">
            <Progress 
              value={stressScore} 
              className="h-4"
              // Use dynamic colors based on stress score
              style={{
                background: stressScore <= 30 ? 'rgba(34, 197, 94, 0.2)' : 
                           stressScore <= 60 ? 'rgba(245, 158, 11, 0.2)' : 
                           'rgba(239, 68, 68, 0.2)',
                '--tw-progress-fill': stressScore <= 30 ? 'rgb(34, 197, 94)' : 
                                     stressScore <= 60 ? 'rgb(245, 158, 11)' : 
                                     'rgb(239, 68, 68)'
              } as React.CSSProperties}
            />
          </div>
          <p className="text-sm text-muted-foreground">Score: {stressScore}/100</p>
        </div>

        <div className="mt-8">
          <h4 className="font-medium text-lg mb-4">Recommendations:</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="p-3 bg-secondary rounded-md">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} className="w-full bg-calm hover:bg-calm-dark">
          Take Assessment Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StressResult;
