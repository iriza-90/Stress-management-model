
import React, { useState } from 'react';
import StressQuestionnaire from '@/components/StressQuestionnaire';
import StressResult from '@/components/StressResult';
import { predictStress } from '@/services/stressPredictor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sun, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Answer = {
  questionId: number;
  value: number | string;
};

const Index = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stressScore, setStressScore] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const handleQuestionnaireSubmit = async (answers: Answer[]) => {
    setIsLoading(true);
    try {
      const result = await predictStress(answers);
      setStressScore(result.score);
      setRecommendations(result.recommendations);
      setShowQuestionnaire(false);
    } catch (error) {
      console.error('Error processing answers:', error);
      toast({
        title: 'Error',
        description: 'There was a problem analyzing your responses. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowQuestionnaire(true);
    setStressScore(0);
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-block p-3 bg-calm-light rounded-full">
              <Activity className="h-10 w-10 text-calm animate-pulse-subtle" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-calm-dark mb-2">Stress Predictor</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Analyze your current stress levels and get personalized recommendations to improve your wellbeing.
          </p>
        </header>

        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="assessment" className="data-[state=active]:bg-calm data-[state=active]:text-white">
              Assessment
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-calm data-[state=active]:text-white">
              About Stress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment" className="mt-0">
            {isLoading ? (
              <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="animate-float">
                    <div className="h-16 w-16 rounded-full bg-calm flex items-center justify-center mb-4">
                      <Activity className="h-8 w-8 text-white animate-pulse" />
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground mt-4">Analyzing your responses...</p>
                </CardContent>
              </Card>
            ) : showQuestionnaire ? (
              <StressQuestionnaire onSubmit={handleQuestionnaireSubmit} />
            ) : (
              <StressResult 
                stressScore={stressScore} 
                recommendations={recommendations} 
                onReset={handleReset} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="info">
            <Card className="w-full max-w-3xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4 text-calm-dark">Understanding Stress</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-calm-light p-2 rounded-full">
                      <Sun className="h-6 w-6 text-calm-dark" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">What is Stress?</h3>
                      <p className="text-muted-foreground text-sm">
                        Stress is your body's reaction to pressure from a certain situation or event. It can be a physical, mental, or emotional reaction.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-calm-light p-2 rounded-full">
                      <Moon className="h-6 w-6 text-calm-dark" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Effects of Stress</h3>
                      <p className="text-muted-foreground text-sm">
                        Chronic stress can lead to various health problems including anxiety, depression, digestive issues, headaches, and sleep problems.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold mb-3">How This Predictor Works</h3>
                <p className="text-muted-foreground mb-6">
                  Our stress predictor analyzes your responses to questions about your lifestyle, habits, and feelings to estimate your current stress level. The assessment evaluates key factors like sleep quality, exercise frequency, and work-life balance.
                </p>
                
                <h3 className="font-bold mb-3">Managing Stress Effectively</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Practice regular physical activity</li>
                  <li>Maintain a healthy diet and stay hydrated</li>
                  <li>Get adequate sleep (7-8 hours for most adults)</li>
                  <li>Use relaxation techniques like deep breathing, meditation, or yoga</li>
                  <li>Connect with supportive friends and family</li>
                  <li>Limit alcohol and caffeine consumption</li>
                  <li>Seek professional help when needed</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>This stress predictor is for informational purposes only and is not a substitute for professional medical advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
