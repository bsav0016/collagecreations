import React from "react";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import { SmallImageSize } from "../../enums/SmallImageSize";
import { CollageCreationType } from "../../enums/collageCreationType";
import { OutputSize } from "../../enums/OutputSize";
import { SizeOption } from "../../interfaces/SizeOption";
import { createPreview } from "../../../../../services/createPreview";
import { SymbolOption } from "../../interfaces/SymbolOption";
import largeImages from '../../../../../assets/quarterLargeImages.png';
import mediumImages from '../../../../../assets/quarterMediumImages.png';
import smallImages from '../../../../../assets/quarterSmallImages.png';
import styles from './selectSmallSizeStep.module.css'

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
    defaultSmallImageSize
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

    const selectSmallSize = async (newSize: SmallImageSize) => {
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
                outputSymbol ?? undefined
            )
            setLightDarkArray(newArray);
            setCurrentStep(CollageCreationStep.PreviewStep);
        } catch (error) {
            console.error("Error creating preview: ", error);
        } finally {
            setShowLoading(false);
            setLoadingMessage(null);
        }
        
    }

    return (
        <div className={styles.pageContainer}>
            {availableSmallSizes.map((availableSize, index) => (
                <div className={styles.sizeContainer} key={index}>
                    <p className={styles.sizeText}>{availableSize.text}</p>
                    <GeneralButton text={"Select"} onClick={() => selectSmallSize(availableSize.text)} />
                    <img src={availableSize.image} className={styles.image}/>
                </div>
            ))}
        </div>
    )
}