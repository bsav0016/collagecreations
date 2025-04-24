import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CollageCreationStep } from "./enums/collageCreationStep";
import NavBar from "../../../layout/navBars/navBar";
import LoadingScreen from "../../../components/loadingScreen/loadingScreen";
import { SelectTypeStep } from "./steps/selectTypeStep/selectTypeStep";
import { SelectOutputSizeStep } from "./steps/selectOutputSize/selectOutputSize";
import { SelectOutputStep } from "./steps/selectOutputStep/selectOutputStep";
import { SelectSmallSizeStep } from "./steps/selectSmallSizeStep/selectSmallSizeStep";
import { PreviewStep } from "./steps/previewStep/previewStep";
import { CreateCollageStep } from "./steps/createCollageStep/createCollageStep";
import { SelectImagesStep } from "./steps/selectImagesStep/selectImagesStep";
import { CollageCreationType } from "./enums/collageCreationType";
import { OutputSize } from "./enums/OutputSize";
import { SmallImageSize } from "./enums/SmallImageSize";
import { SymbolOption } from "./interfaces/SymbolOption";
import { useLocalDatabase } from "../../../context/databaseContext";
import styles from './collageCreationPage.module.css';
import appStyles from '../../../App.module.css';
import MediumLogoHeader from "../../../layout/mediumLogoHeader/mediumLogoHeader";
import { databaseUtils } from "./databaseUtils";
import AdminNavBar from "../../../layout/navBars/adminNavBar";

interface CollageCreationPageProps {
    isAdmin: boolean
}

export function CollageCreation({isAdmin=false}: CollageCreationPageProps) {
    const navigate = useNavigate();
    const { step } = useParams<{ step?: string }>();
    const { setVariable, loadVariable } = useLocalDatabase();
    const dbUtils = databaseUtils(setVariable, loadVariable);

    const currentStep: CollageCreationStep = step && Object.values(CollageCreationStep).includes(step as unknown as CollageCreationStep)
        ? (step as unknown as CollageCreationStep)
        : CollageCreationStep.SelectTypeStep;
        
    const baseCollageUrlExt = isAdmin ? '/admin/admin-collage/' : '/collage/';
    const goToNextStep = (nextStep: CollageCreationStep) => navigate(`${baseCollageUrlExt}${nextStep}`);


    const defaultType: CollageCreationType = CollageCreationType.Image;
    const defaultOutputSize: OutputSize = OutputSize.x24x24;
    const defaultMainImage: string | null = null;
    const defaultOutputText: string = "";
    const defaultOutputSymbol: SymbolOption | null = null;
    const defaultSmallImageSize: SmallImageSize = SmallImageSize.Small;
    const defaultLightDarkArray: boolean[][] = [];
    const defaultSmallImages: string[] = [];
    const defaultColor: boolean = true;

    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [type, setType] = useState<CollageCreationType>(defaultType);
    const [outputSize, setOutputSize] = useState<OutputSize>(defaultOutputSize);
    const [mainImage, setMainImage] = useState<string | null>(defaultMainImage);
    const [outputText, setOutputText] = useState<string>(defaultOutputText);
    const [outputSymbol, setOutputSymbol] = useState<SymbolOption | null>(defaultOutputSymbol);
    const [smallImageSize, setSmallImageSize] = useState<SmallImageSize>(defaultSmallImageSize);
    const [lightDarkArray, setLightDarkArray] = useState<boolean[][]>(defaultLightDarkArray);
    const [smallImages, setSmallImages] = useState<string[]>(defaultSmallImages);
    const [color, setColor] = useState(defaultColor);

    const title: string | null = currentStep === CollageCreationStep.SelectTypeStep ? "Select Collage Type"
        : currentStep === CollageCreationStep.SelectOutputSizeStep ? "Select Output Size"
        : currentStep === CollageCreationStep.SelectOutputStep ? "Select Output"
        : currentStep === CollageCreationStep.SelectSmallSizeStep ? "Select Small Image Sizes"
        : currentStep === CollageCreationStep.PreviewStep ? "Light / Dark Image Preview"
        : currentStep === CollageCreationStep.SelectImagesStep ? "Select Small Images"
        : currentStep === CollageCreationStep.CreateCollageStep ? "Final Step!"
        : null

    const subtitle: string | null = currentStep === CollageCreationStep.SelectOutputSizeStep ? "This is the size, in inches, that your collage will print to (width x height)"
        : currentStep === CollageCreationStep.SelectSmallSizeStep ? "This is the size of the images that make up your collage (as compared to a US quarter)"
        : currentStep === CollageCreationStep.PreviewStep ? "This is an outline of how your collage will look. Click on any box you would like to be light instead of dark or vice versa"
        : currentStep === CollageCreationStep.SelectImagesStep ? "Please select at least 5 images. The more images you include, the more diversity your collage will have"
        : currentStep === CollageCreationStep.CreateCollageStep ? "Please give the server up to 2 minutes to process your images"
        : null

    interface DatabaseFunctionSet {
        variable: any;
        variableString: string;
        setVariable: (variable: any) => void;
        storeVariable: (value: any) => Promise<void>;
        loadVariable: () => Promise<any>;
        ignoreStorage: boolean;
    }

    const databaseFunctions: DatabaseFunctionSet[] = [
        { 
            variable: type,
            variableString: 'type',
            setVariable: setType,
            storeVariable: dbUtils.storeType,
            loadVariable: dbUtils.loadType,
            ignoreStorage: type === defaultType
        },

        {
            variable: outputSize, 
            variableString: 'outputSize', 
            setVariable: setOutputSize,
            storeVariable: dbUtils.storeOutputSize, 
            loadVariable: dbUtils.loadOutputSize,
            ignoreStorage: outputSize === defaultOutputSize
        },

        {
            variable: outputText, 
            variableString: 'outputText', 
            setVariable: setOutputText,
            storeVariable: dbUtils.storeOutputText, 
            loadVariable: dbUtils.loadOutputText,
            ignoreStorage: outputText === defaultOutputText
        },

        {
            variable: outputSymbol, 
            variableString: 'outputSymbol', 
            setVariable: setOutputSymbol,
            storeVariable: dbUtils.storeOutputSymbol, 
            loadVariable: dbUtils.loadOutputSymbol,
            ignoreStorage: outputSymbol === defaultOutputSymbol
        },

        {
            variable: smallImageSize, 
            variableString: 'smallImageSize', 
            setVariable: setSmallImageSize,
            storeVariable: dbUtils.storeSmallImageSize, 
            loadVariable: dbUtils.loadSmallImageSize,
            ignoreStorage: smallImageSize === defaultSmallImageSize
        },

        {
            variable: lightDarkArray, 
            variableString: 'lightDarkArray', 
            setVariable: setLightDarkArray,
            storeVariable: dbUtils.storeLightDarkArray, 
            loadVariable: dbUtils.loadLightDarkArray,
            ignoreStorage: lightDarkArray.length === 0
        },

        {
            variable: color, 
            variableString: 'color', 
            setVariable: setColor,
            storeVariable: dbUtils.storeColor, 
            loadVariable: dbUtils.loadColor,
            ignoreStorage: false
        },

        {
            variable: mainImage,
            variableString: 'mainImage',
            setVariable: setMainImage,
            storeVariable: dbUtils.storeMainImage,
            loadVariable: dbUtils.loadMainImage,
            ignoreStorage: mainImage === null
        },

        {
            variable: smallImages, 
            variableString: 'smallImages', 
            setVariable: setSmallImages,
            storeVariable: dbUtils.storeSmallImages,
            loadVariable: dbUtils.loadSmallImages,
            ignoreStorage: smallImages.length === 0
        }
    ]

    useEffect(() => {
        const loadVariables = async () => {
            for (const databaseFunction of databaseFunctions) {
                const storedVariable = await databaseFunction.loadVariable();
                if (storedVariable !== null) {
                    databaseFunction.setVariable(storedVariable);
                }
            }
        }

        loadVariables();
    }, []);

    useEffect(() => {
        const storeVariables = async () => {
            for (const databaseFunction of databaseFunctions) {
                if (!databaseFunction.ignoreStorage) {
                    await databaseFunction.storeVariable(databaseFunction.variable);
                }
            }
        }

        storeVariables();
    }, [type, outputSize, mainImage, outputText, outputSymbol, smallImageSize, lightDarkArray, color, smallImages]);

    return (
        <div>
            {showLoading ? (
                <LoadingScreen message={loadingMessage} />
            ) : (
                <div>
                    {isAdmin ?
                    <AdminNavBar />
                    :
                    <NavBar />
                    }
                    <div className={appStyles.App}>
                        {title &&
                            <div className={styles.collageCreationTitleContainer}>
                                <MediumLogoHeader title={title} />
                                {subtitle &&
                                    <div className={styles.subtitleContainer}>
                                        <p className={styles.collageCreationSubtitle}>{subtitle}</p>
                                    </div>
                                }
                            </div>  
                        }

                        {currentStep === CollageCreationStep.SelectTypeStep ? (
                            <SelectTypeStep 
                                setCurrentStep={goToNextStep} 
                                setType={setType} 
                                dbUtils={dbUtils}
                                defaultType={defaultType}
                            />
                        ) : currentStep === CollageCreationStep.SelectOutputSizeStep ? (
                            <SelectOutputSizeStep 
                                setCurrentStep={goToNextStep} type={type} 
                                setOutputSize={setOutputSize} 
                                dbUtils={dbUtils}
                                defaultOutputSize={defaultOutputSize}
                            />
                        ) : currentStep === CollageCreationStep.SelectOutputStep ? (
                            <SelectOutputStep
                                setCurrentStep={goToNextStep}
                                type={type}
                                outputSize={outputSize}
                                setMainImage={setMainImage}
                                setOutputText={setOutputText}
                                setOutputSymbol={setOutputSymbol}
                            />
                        ) : currentStep === CollageCreationStep.SelectSmallSizeStep ? (
                            <SelectSmallSizeStep
                                setCurrentStep={goToNextStep}
                                type={type}
                                outputSize={outputSize}
                                outputText={outputText}
                                outputSymbol={outputSymbol}
                                setSmallImageSize={setSmallImageSize}
                                setLightDarkArray={setLightDarkArray}
                                setShowLoading={setShowLoading}
                                setLoadingMessage={setLoadingMessage}
                                dbUtils={dbUtils}
                                defaultSmallImageSize={defaultSmallImageSize}
                                mainImage={mainImage}
                            />
                        ) : currentStep === CollageCreationStep.PreviewStep ? (
                            <PreviewStep
                                setCurrentStep={goToNextStep}
                                lightDarkArray={lightDarkArray}
                                setLightDarkArray={setLightDarkArray}
                            />
                        ) : currentStep === CollageCreationStep.SelectImagesStep ? (
                            <SelectImagesStep
                                setCurrentStep={goToNextStep}
                                smallImages={smallImages}
                                setSmallImages={setSmallImages}
                            />
                        ) : (
                            <CreateCollageStep
                                type={type}
                                outputSize={outputSize}
                                mainImage={mainImage}
                                smallImageSize={smallImageSize}
                                lightDarkArray={lightDarkArray}
                                smallImages={smallImages}
                                color={color}
                                setShowLoading={setShowLoading}
                                setLoadingMessage={setLoadingMessage}
                                isAdmin={isAdmin}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
