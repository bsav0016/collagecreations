import { useEffect, useState } from "react";
import { CollageCreationType } from "../../enums/collageCreationType";
import { OutputSize } from "../../enums/OutputSize";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import { cn } from "../../../../../lib/utils";
import img12x12 from "../../../../../assets/comparison12x12.png";
import img12x18 from "../../../../../assets/comparison12x18.png";
import img18x12 from "../../../../../assets/comparison18x12.png";
import img24x24 from "../../../../../assets/comparison24x24.png";
import img24x36 from "../../../../../assets/comparison24x36.png";
import img36x24 from "../../../../../assets/comparison36x24.png";

interface SelectOutputSizeStepProps {
    setCurrentStep: (newStep: CollageCreationStep) => void;
    type: CollageCreationType;
    setOutputSize: (newSize: OutputSize) => void;
    dbUtils: any;
    defaultOutputSize: OutputSize;
}

export function SelectOutputSizeStep({
    setCurrentStep,
    type,
    setOutputSize,
    dbUtils,
    defaultOutputSize
}: SelectOutputSizeStepProps) {
    const [availableSizes, setAvailableSizes] = useState<OutputSize[]>([]);
    const [selectedSize, setSelectedSize] = useState<OutputSize | null>(null);

    const outputSizeImages: Record<OutputSize, string> = {
        [OutputSize.x12x12]: img12x12,
        [OutputSize.x12x18]: img12x18,
        [OutputSize.x18x12]: img18x12,
        [OutputSize.x24x24]: img24x24,
        [OutputSize.x24x36]: img24x36,
        [OutputSize.x36x24]: img36x24
    };

    useEffect(() => {
        updateAvailableSizes(type);
    }, [type]);

    const mapAvailableSizes = (type: CollageCreationType): OutputSize[] => {
        switch (type) {
            case CollageCreationType.Image:
                return [
                    OutputSize.x24x24,
                    OutputSize.x24x36,
                    OutputSize.x36x24
                ];
            case CollageCreationType.Text:
                return [
                    OutputSize.x12x12,
                    OutputSize.x12x18,
                    OutputSize.x18x12,
                    OutputSize.x24x24,
                    OutputSize.x24x36,
                    OutputSize.x36x24
                ];
            case CollageCreationType.Symbol:
                return [
                    OutputSize.x12x12,
                    OutputSize.x24x24
                ];
        }
    };

    const updateAvailableSizes = (type: CollageCreationType) => {
        const newAvailableSizes = mapAvailableSizes(type);
        setAvailableSizes(newAvailableSizes);
    }

    // A small rectangle drawn to scale so each card shows its shape at a glance,
    // in addition to the "width x height" text.
    const ShapePreview = ({ size, active }: { size: OutputSize; active: boolean }) => {
        const [width, height] = size.split("x").map(Number);
        const longestSide = 44;
        const scale = longestSide / Math.max(width, height);
        return (
            <div style={{ height: longestSide }} className="flex items-end justify-center">
                <div
                    style={{ width: width * scale, height: height * scale }}
                    className={cn(
                        "rounded-sm border-2",
                        active ? "border-primary bg-primary/20" : "border-muted-foreground/50 bg-muted",
                    )}
                />
            </div>
        );
    };

    const confirmSelection = () => {
        if (!selectedSize) {
            console.error("Size not provided");
            return;
        }
        setOutputSize(selectedSize);
        if (selectedSize === defaultOutputSize) {
            dbUtils.storeOutputSize(selectedSize);
        }
        setCurrentStep(CollageCreationStep.SelectOutputStep);
    }

    return (
        <div className="flex flex-col items-center gap-8 px-4">
            <div className="flex flex-row gap-3 sm:gap-4 justify-center items-stretch flex-wrap">
                {availableSizes.map((availableSize) => {
                    const active = selectedSize === availableSize;
                    return (
                        <button
                            type="button"
                            key={availableSize}
                            onClick={() => setSelectedSize(availableSize)}
                            aria-pressed={active}
                            className={cn(
                                "flex flex-col items-center gap-2 w-24 sm:w-28 rounded-xl border-2 bg-card px-2 sm:px-3 py-3 sm:py-4 shadow-sm transition-colors",
                                active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                            )}
                        >
                            <ShapePreview size={availableSize} active={active} />
                            <span className={cn("text-sm font-semibold", active && "text-primary")}>
                                {availableSize.replace("x", " x ")}"
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedSize && (
                <>
                    {/* Right under the choices, and pinned to the bottom of the screen while it is in view,
                        so it can't be missed or pushed below the fold on a phone. */}
                    <div className="sticky bottom-4 z-10 -mt-4 w-full max-w-xs rounded-md shadow-lg">
                        <GeneralButton text="Continue" onClick={confirmSelection} variant="primary" fullWidth />
                    </div>
                    <img
                        src={outputSizeImages[selectedSize]}
                        alt={selectedSize}
                        className="w-[40%] h-auto max-md:w-[75%] rounded-xl dark:bg-slate-100 dark:p-3"
                    />
                </>
            )}
        </div>
    )
}
