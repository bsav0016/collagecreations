import { useState } from "react";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import { SmallImageSize } from "../../enums/SmallImageSize";
import { cn } from "../../../../../lib/utils";
import { CollageCreationType } from "../../enums/collageCreationType";
import { OutputSize } from "../../enums/OutputSize";
import { SizeOption } from "../../interfaces/SizeOption";
import { createPreview } from "../../../../../services/createPreview";
import { SymbolOption } from "../../interfaces/SymbolOption";
import largeImages from '../../../../../assets/quarterLargeImages.png';
import mediumImages from '../../../../../assets/quarterMediumImages.png';
import smallImages from '../../../../../assets/quarterSmallImages.png';

interface SelectSmallSizeStepProps {
    setCurrentStep: (newStep: CollageCreationStep) => void;
    type: CollageCreationType;
    outputSize: OutputSize;
    outputText: string;
    outputSymbol: SymbolOption | null;
    setSmallImageSize: (newSize: SmallImageSize) => void;
    setLightDarkArray: (newArray: boolean[][]) => void;
    setShowLoading: (loading: boolean) => void;
    setLoadingMessage: (loadingMessage: string | null) => void;
    dbUtils: any;
    defaultSmallImageSize: SmallImageSize;
    mainImage: string | null;
}

export function SelectSmallSizeStep({
    setCurrentStep,
    type,
    outputSize,
    outputText,
    outputSymbol,
    setSmallImageSize,
    setLightDarkArray,
    setShowLoading,
    setLoadingMessage,
    dbUtils,
    defaultSmallImageSize,
    mainImage
}: SelectSmallSizeStepProps) {
    const availableSmallSizes: SizeOption[] = [
        {
            text: SmallImageSize.Small,
            size: '0.3" x 0.3"',
            image: smallImages
        },
        {
            text: SmallImageSize.Medium,
            size: '0.6" x 0.6"',
            image: mediumImages
        },
        {
            text: SmallImageSize.Large,
            size: '1" x 1"',
            image: largeImages
        }
    ]

    const [selecting, setSelecting] = useState<SmallImageSize | null>(null);

    const selectSmallSize = async (newSize: SmallImageSize) => {
        if (selecting) return;
        setSelecting(newSize);
        setSmallImageSize(newSize);
        if (newSize === defaultSmallImageSize) {
            dbUtils.storeSmallImageSize(newSize);
        }
        setShowLoading(true);
        setLoadingMessage("Getting your collage preview ready...");
        try {
            const newArray = await createPreview(
                type,
                outputSize,
                newSize,
                outputText,
                outputSymbol ?? undefined,
                mainImage ?? undefined
            )
            setLightDarkArray(newArray);
            setCurrentStep(CollageCreationStep.PreviewStep);
        } catch (error) {
            console.error("Error creating preview: ", error);
        } finally {
            setShowLoading(false);
            setLoadingMessage(null);
            setSelecting(null);
        }

    }

    return (
        <div className="flex flex-row gap-6 px-4 max-md:flex-col">
            {availableSmallSizes.map((availableSize, index) => (
                <button
                    type="button"
                    key={index}
                    onClick={() => selectSmallSize(availableSize.text)}
                    disabled={!!selecting}
                    className={cn(
                        "flex-1 flex flex-col items-center gap-1 pb-5 pt-5 border-2 border-border bg-card text-card-foreground rounded-xl shadow-sm transition-colors",
                        !selecting && "hover:border-primary/50 cursor-pointer",
                        selecting && selecting !== availableSize.text && "opacity-50",
                    )}
                >
                    <p className="p-0 m-0 text-xl font-semibold">{availableSize.text}</p>
                    <p className="text-sm text-muted-foreground">{availableSize.size}</p>
                    <img src={availableSize.image} className="max-w-full h-[150px] object-contain mt-2.5" alt={availableSize.text} />
                </button>
            ))}
        </div>
    )
}