import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function OnboardingProgress({ currentStep, totalSteps, stepLabels }: OnboardingProgressProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                isCompleted || isCurrent
                  ? "bg-primary"
                  : "bg-border"
              )}
            />
          );
        })}
      </div>

      {/* Step indicators - only show on larger screens */}
      {stepLabels && (
        <div className="hidden sm:flex items-center justify-between">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-opacity",
                  isCurrent ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-secondary text-muted-foreground border border-border"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile: show current step label */}
      {stepLabels && (
        <div className="flex sm:hidden justify-center mt-2">
          <span className="text-sm font-medium text-foreground">
            {currentStep}/{totalSteps} — {stepLabels[currentStep - 1]}
          </span>
        </div>
      )}
    </div>
  );
}