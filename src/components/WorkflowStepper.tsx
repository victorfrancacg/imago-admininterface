import { WorkflowStep } from '@/types/report';
import { Progress } from '@/components/ui/progress';

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export function WorkflowStepper({ steps, currentStep }: WorkflowStepperProps) {
  const currentStepData = steps.find(s => s.id === currentStep);
  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Etapa {currentStep} de {steps.length}
        </p>
        <p className="text-sm font-semibold text-primary">
          {currentStepData?.title}
        </p>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
}
