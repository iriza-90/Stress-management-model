
import { toast } from "@/components/ui/use-toast";
import { getPredictionFromModel } from "./stressModelServer";

type Answer = {
  questionId: number;
  value: number | string;
};

// Main stress prediction function that attempts to use the server-side model first
export const predictStress = async (answers: Answer[]): Promise<{ score: number, recommendations: string[] }> => {
  // Simulating a network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Try to get prediction from the model server
    return await getPredictionFromModel(answers);
  } catch (error) {
    console.error("Error predicting stress:", error);
    toast({
      title: "Error predicting stress",
      description: "There was a problem analyzing your responses. Please try again.",
      variant: "destructive",
    });
    return { score: 0, recommendations: [] };
  }
};
