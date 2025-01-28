import React from "react";
import styles from './selectTypeStep.module.css';
import imageCollage from '../../../../../assets/exampleImageCollage.png';
import textCollage from '../../../../../assets/exampleTextCollage.png';
import symbolCollage from '../../../../../assets/exampleSymbolCollage.png';
import { CollageCreationType } from "../../enums/collageCreationType";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import { CollageCreationStep } from "../../enums/collageCreationStep";

interface SelectTypeStepProps {
    setCurrentStep: (newStep: CollageCreationStep) => void;
    setType: (newType: CollageCreationType) => void;
    dbUtils: any;
    defaultType: CollageCreationType;
}

interface CollageTypeOption {
    title: string;
    type: CollageCreationType;
    considerations: string[];
    image: any;
}

export function SelectTypeStep({
    setCurrentStep,
    setType,
    dbUtils,
    defaultType
}: SelectTypeStepProps) {
    const collageOptions: CollageTypeOption[] = [
        { 
            title: 'Image', 
            type: CollageCreationType.Image, 
            considerations: [
                'Only black and white',
                'You cannot select the small image size (0.3" x 0.3")',
                'Output image must be 24" x 24" or larger',
                'Most unique'

            ],
            image: imageCollage 
        },
        {
            title: 'Text',
            type: CollageCreationType.Text,
            considerations: [
                'Can output in black and white or color',
                'Can use small, medium, or large image sizes in step 2',
                'Output image must be 12" x 12" or greater'
            ],
            image: textCollage
        },
        {
            title: 'Symbol',
            type: CollageCreationType.Symbol,
            considerations: [
                'Similar considerations as text collage',
                'There are a limited number of symbols to choose from',
                'You may request custom symbol if you do not like the options'
            ],
            image: symbolCollage
        }
    ]

    const clickedSelect = (type: CollageCreationType) => {
        setType(type);
        if (type === defaultType) {
            dbUtils.storeType(type);
        }
        setCurrentStep(CollageCreationStep.SelectOutputSizeStep)
    }

    return (
        <div className={styles.step1Container}>
            { collageOptions.map((option) => (
                <div className={styles.collageOption} key={option.title}>
                    <p className={styles.optionTitle}>
                        {option.title}
                    </p>
                    <GeneralButton text={'Select'} onClick={() => clickedSelect(option.type)} />
                    { option.considerations.length > 0 &&
                        <div>
                            <p className={styles.considerationsTitle}>
                                Considerations:
                            </p>
                            {option.considerations.map((consideration, index) => (
                                <p className={styles.consideration} key={index}>
                                - {consideration}
                                </p>
                            ))}
                        </div>
                    }
                    <img src={option.image} className={styles.optionImage} />
                </div>
            ))}
        </div>
    )
}
