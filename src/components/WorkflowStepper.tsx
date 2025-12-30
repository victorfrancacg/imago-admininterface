import { WorkflowStep } from '@/types/report';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export function WorkflowStepper({ steps, currentStep, onStepClick }: WorkflowStepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.id} className="relative flex-1">
            {index > 0 && (
              <div 
                className={cn(
                  "absolute left-0 top-4 -translate-y-1/2 h-0.5 w-full -translate-x-1/2",
                  step.status === 'complete' || step.status === 'active' 
                    ? "bg-step-complete" 
                    : "bg-step-inactive"
                )}
                style={{ width: 'calc(100% - 2rem)', left: 'calc(-50% + 1rem)' }}
              />
            )}
            
            <button
              onClick={() => step.status === 'complete' && onStepClick?.(step.id)}
              disabled={step.status === 'pending'}
              className={cn(
                "relative flex flex-col items-center group",
                step.status === 'complete' && "cursor-pointer",
                step.status === 'pending' && "cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  step.status === 'complete' && "bg-step-complete text-success-foreground",
                  step.status === 'active' && "bg-step-active text-primary-foreground shadow-glow animate-pulse-soft",
                  step.status === 'pending' && "bg-step-inactive text-muted-foreground"
                )}
              >
                {step.status === 'complete' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </span>
              
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  step.status === 'active' && "text-primary",
                  step.status === 'complete' && "text-success",
                  step.status === 'pending' && "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}