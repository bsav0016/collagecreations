import { useEffect, useState } from "react";
import { CollageCreationType } from "../../enums/collageCreationType";
import { OutputSize } from "../../enums/OutputSize";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import { CollageCreationStep } from "../../enums/collageCreationStep";
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
    const [displayConfirm, setDisplayConfirm] = useState<boolean>(false);

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

    const selectSize = (newSelectedSize: OutputSize) => {
        setSelectedSize(newSelectedSize);
        setDisplayConfirm(true);
    }

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

    const cancelSelection = () => {
        setSelectedSize(null);
        setDisplayConfirm(false);
    }

    return (
        <div>
            <div className="flex flex-row gap-2.5 justify-center items-center flex-wrap">
                {availableSizes.map((availableSize) => (
                    <GeneralButton text={availableSize} onClick={() => selectSize(availableSize)} key={availableSize} />
                ))}
            </div>
            {displayConfirm && (
                <div className="justify-items-center mt-5">
                    <div>
                        Confirm size?
                    </div>
                    <div className="flex flex-row gap-2.5">
                        <GeneralButton text="Yes" onClick={confirmSelection} />
                        <GeneralButton text="No" onClick={cancelSelection} />
                    </div>
                </div>
            )}
            {selectedSize && (
                <div className="flex justify-center">
                    <img 
                        src={outputSizeImages[selectedSize]}
                        alt={selectedSize} 
                        className="w-[40%] h-auto justify-self-center max-md:w-[75%]"
                    />
                </div>
            )}
        </div>
    )
}