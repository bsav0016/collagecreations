import React, { useState } from "react";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import styles from "./previewStep.module.css";

interface PreviewStepProps {
    setCurrentStep: (newStep: CollageCreationStep) => void;
    lightDarkArray: boolean[][];
    setLightDarkArray: (newArray: boolean[][]) => void;
}

export function PreviewStep({
    setCurrentStep,
    lightDarkArray,
    setLightDarkArray
}: PreviewStepProps) {
    const updateLightDarkArray = (i: number, j: number) => {
        const updatedArray = 
            lightDarkArray.map((lightDarkRow, i2) => (
                lightDarkRow.map((lightDarkCell, j2) => (
                    (i === i2 && j === j2) ? !lightDarkCell : lightDarkCell
                ))
            ));
        setLightDarkArray(updatedArray);
    }

    const confirmPreview = () => {
        setCurrentStep(CollageCreationStep.SelectImagesStep);
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const maxSize = Math.min(screenWidth, screenHeight) * 0.9
    const cols = lightDarkArray[0]?.length || 1;
    const calculatedSize = (maxSize) / cols;
    const boxSize = Math.floor(calculatedSize);

    return (
        <div>
            <div style={{display: 'flex', width: 'auto', justifyContent: 'center'}}>
                <GeneralButton text={"Confirm Preview"} onClick={confirmPreview} />
            </div>
            <div className={styles.gridContainer}>
                {lightDarkArray.map((lightDarkRow, i) => (
                    <div className={styles.rowContainer} key={i}>
                        {lightDarkRow.map((lightDarkCell, j) => (
                            <button
                                key={j}
                                style={{
                                    backgroundColor: lightDarkCell ? 'white' : 'black',
                                    padding: 0,
                                    margin: 0,
                                    width: `${boxSize}px`,
                                    height: `${boxSize}px`,
                                }}
                                onClick={() => updateLightDarkArray(i, j)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
