import { Check } from "lucide-react";
import { CollageCreationStep, getStepOrderForType } from "../../enums/collageCreationStep";
import { CollageCreationType } from "../../enums/collageCreationType";
import { cn } from "../../../../../lib/utils";

interface ProgressStepperProps {
    currentStep: CollageCreationStep;
    type: CollageCreationType;
    onNavigate: (step: CollageCreationStep) => void;
}

const outputStepLabel = (type: CollageCreationType): string => {
    switch (type) {
        case CollageCreationType.Text:
            return "Text";
        case CollageCreationType.Symbol:
            return "Symbol";
        default:
            return "Photo";
    }
};

export function ProgressStepper({ currentStep, type, onNavigate }: ProgressStepperProps) {
    const labels: Record<CollageCreationStep, string> = {
        [CollageCreationStep.SelectTypeStep]: "Type",
        [CollageCreationStep.SelectOutputSizeStep]: "Size",
        [CollageCreationStep.SelectOutputStep]: outputStepLabel(type),
        [CollageCreationStep.SelectSmallSizeStep]: "Photo Size",
        [CollageCreationStep.PreviewStep]: "Preview",
        [CollageCreationStep.SelectImagesStep]: "Upload Photos",
        [CollageCreationStep.CreateCollageStep]: "Create",
    };

    const stepOrder = getStepOrderForType(type);
    const currentIndex = stepOrder.indexOf(currentStep);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pt-4">
            {/* Desktop / tablet: full stepper with connecting line */}
            <ol className="hidden sm:flex items-start w-full">
                {stepOrder.map((step, index) => {
                    const isComplete = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isClickable = isComplete;
                    const isLast = index === stepOrder.length - 1;

                    return (
                        <li key={step} className="flex-1 flex items-center last:flex-none">
                            <div className="flex flex-col items-center gap-1.5 w-20">
                                <button
                                    type="button"
                                    onClick={() => isClickable && onNavigate(step)}
                                    disabled={!isClickable}
                                    aria-current={isCurrent ? "step" : undefined}
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                                        isComplete && "border-primary bg-primary text-primary-foreground cursor-pointer hover:opacity-90",
                                        isCurrent && "border-primary text-primary bg-background",
                                        !isComplete && !isCurrent && "border-border text-muted-foreground bg-background cursor-default",
                                    )}
                                >
                                    {isComplete ? <Check size={16} /> : index + 1}
                                </button>
                                <span
                                    className={cn(
                                        "text-xs text-center leading-tight",
                                        isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                                    )}
                                >
                                    {labels[step]}
                                </span>
                            </div>
                            {!isLast && (
                                <div
                                    className={cn(
                                        "h-0.5 flex-1 -mt-5",
                                        isComplete ? "bg-primary" : "bg-border",
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            {/* Mobile: compact "Step X of N" with a progress bar */}
            <div className="sm:hidden">
                <p className="text-sm font-medium text-muted-foreground text-center mb-2">
                    Step {currentIndex + 1} of {stepOrder.length} &middot; {labels[currentStep]}
                </p>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / stepOrder.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
