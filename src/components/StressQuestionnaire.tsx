
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type QuestionType = {
  id: number;
  text: string;
  type: 'slider' | 'radio';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
};

type AnswerType = {
  questionId: number;
  value: number | string;
};

const questions: QuestionType[] = [
  {
    id: 1,
    text: "How would you rate your current stress level?",
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
  },
  {
    id: 2,
    text: "How many hours of sleep did you get last night?",
    type: 'slider',
    min: 0,
    max: 12,
    step: 0.5,
  },
  {
    id: 3,
    text: "How many times did you exercise this week?",
    type: 'slider',
    min: 0,
    max: 7,
    step: 1,
  },
  {
    id: 4,
    text: "How would you describe your work-life balance?",
    type: 'radio',
    options: ['Poor', 'Fair', 'Good', 'Excellent'],
  },
  {
    id: 5,
    text: "How often do you practice relaxation techniques?",
    type: 'radio',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
  },
];

interface StressQuestionnaireProps {
  onSubmit: (answers: AnswerType[]) => void;
}

const StressQuestionnaire: React.FC<StressQuestionnaireProps> = ({ onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | string>(
    questions[0].type === 'slider' ? (questions[0].min || 0) : ''
  );
  
  const { toast } = useToast();

  const handleNext = () => {
    if (currentAnswer === '') {
      toast({
        title: "Please answer the question",
        description: "You need to provide an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = [...answers, { 
      questionId: questions[currentQuestion].id, 
      value: currentAnswer 
    }];
    
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setCurrentAnswer(
        questions[nextQuestion].type === 'slider' 
          ? (questions[nextQuestion].min || 0) 
          : ''
      );
    } else {
      onSubmit(newAnswers);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentAnswer(value[0]);
  };

  const handleRadioChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl text-calm-dark">Stress Assessment</CardTitle>
        <CardDescription className="text-center">
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
        <div className="w-full bg-secondary h-2 rounded-full mt-2">
          <div 
            className="bg-calm h-2 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">{question.text}</h3>
        
        {question.type === 'slider' && (
          <div className="space-y-6">
            <Slider
              className="stress-slider"
              value={[currentAnswer as number]}
              min={question.min}
              max={question.max}
              step={question.step}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.min}</span>
              <span>{question.max}</span>
            </div>
            <div className="text-center font-medium text-lg text-calm">
              Selected: {currentAnswer}
            </div>
          </div>
        )}
        
        {question.type === 'radio' && question.options && (
          <RadioGroup value={currentAnswer as string} onValueChange={handleRadioChange} className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNext} 
          className="w-full bg-calm hover:bg-calm-dark"
        >
          {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StressQuestionnaire;
