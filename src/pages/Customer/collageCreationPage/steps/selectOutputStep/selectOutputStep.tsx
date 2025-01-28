import React, { useState } from "react";
import { CollageCreationType } from "../../enums/collageCreationType";
import ImageUpload from "../../../../../components/imageUpload/imageUpload";
import heart from '../../../../../assets/symbols/Heart.jpg';
import paw from '../../../../../assets/symbols/Paw.jpg';
import { CollageCreationStep } from "../../enums/collageCreationStep";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import styles from './selectOutputStep.module.css';
import { SymbolOption } from "../../interfaces/SymbolOption";
import TextInput from "../../../../../components/textInput/newTextInput";
import Checkbox from "../../../../../components/checkbox/checkbox";
import { CropCoordinate } from "../../interfaces/CropCoordinate";
import { CropArea } from "../../interfaces/CropArea";
import usePreventScroll from "../../../../../hooks/preventScroll";
import CustomCropper from "../../../../../components/customCropper/customCropper";
import LoadingScreen from "../../../../../components/loadingScreen/loadingScreen";
import CropperButton from "../../../../../components/cropperButton/cropperButton";
import { getCroppedImg, rotateImage } from "../../../../../utils/modifyImage";
import { useConstants } from "../../../../../context/constantsContext";
import { toastRef } from "../../../../../context/toastContext/toastContext";
import { OutputSize } from "../../enums/OutputSize";

interface SelectOutputStepProps {
    setCurrentStep: (newStep: CollageCreationStep) => void;
    type: CollageCreationType;
    outputSize: OutputSize;
    setMainImage: (newMainImage: string | null) => void;
    setOutputText: (newText: string) => void;
    setOutputSymbol: (newSymbol: SymbolOption | null) => void;
}

export function SelectOutputStep({
    setCurrentStep,
    type,
    outputSize,
    setMainImage,
    setOutputText,
    setOutputSymbol
}: SelectOutputStepProps) {
    //This section is strictly for the cropper
    const { constants } = useConstants();

    const preparingImage = "Preparing image...";

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<CropCoordinate>({x: 0, y: 0});
    const [cropArea, setCropArea] = useState<CropArea>({x: 0, y: 0, width: 0, height: 0})
    const [zoom, setZoom] = useState<number>(1);
    const [cropperVisible, setCropperVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>(preparingImage);

    usePreventScroll(cropperVisible);

    const rotate = async () => {
        setCropperVisible(false);
        setLoadingMessage("Rotating image...");
        const newURL = await rotateImage(selectedImage);
        setSelectedImage(newURL);
        setCropperVisible(true);
        setLoadingMessage(preparingImage);
    }

    const cropMainImage = async () => {
        if (!constants || !constants.PPI) {
            toastRef.current('Could not get constants');
            return;
        }
        setCropperVisible(false);
        const croppedImage = await getCroppedImg(selectedImage, cropArea);
        const file = new File([croppedImage], 'image.png', { type: croppedImage.type });
        const croppedImageUrl = URL.createObjectURL(file);
        setTempImage(croppedImageUrl);
        setDisplayConfirmImage(true);
        setLoading(false);
        setCropperVisible(false);
    }
    
    const confirmCancelCrop = () => {
        toastRef.current("Are you sure you want to cancel cropping this image?", 
            "info", 
            async () => {
            handleCancelCrop();
        });
    }

    const handleCancelCrop = () => {
        setTempImage(null);
        setLoading(false);
        setCropperVisible(false);
    }

    const mapAspectRatio = (outputSize: OutputSize): number => {
        switch (outputSize) {
            case OutputSize.x18x12, OutputSize.x36x24:
                return 1.5;
            case OutputSize.x12x18, OutputSize.x24x36:
                return 2 / 3;
            default:
                return 1;
        }
    };

    //Begin code for remainder of the component
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [cropImage, setCropImage] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [selectedSymbol, setSelectedSymbol] = useState<SymbolOption | null>(null);
    const [displayConfirmImage, setDisplayConfirmImage] = useState<boolean>(false);
    const [displayConfirmSymbol, setDisplayConfirmSymbol] = useState<boolean>(false);

    const availableSymbols: SymbolOption[] = [
        { text: 'Heart', image: heart },
        { text: 'Paw', image: paw }
    ]

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        e.target.value = "";
        if (cropImage) {
            setSelectedImage(imageUrl)
            setLoading(true);
            setCropperVisible(true);
        }
        else {
            setLoading(true);
            setTempImage(imageUrl);
            setLoading(false);
        }
        setDisplayConfirmImage(true);
    }

    const handleChangeCropImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCropImage(e.target.checked);
    }

    const confirmImageSelection = () => {
        if (!tempImage) {
            console.error("Image not provided");
            return;
        }
        setMainImage(tempImage);
        setCurrentStep(CollageCreationStep.SelectImagesStep);
    }

    const cancelImageSelection = () => {
        setTempImage(null);
        setDisplayConfirmImage(false);
    }

    const completedText = () => {
        setOutputText(text);
        setCurrentStep(CollageCreationStep.SelectSmallSizeStep);
    }

    const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const symbolText = event.target.value;
        const symbol = availableSymbols.find(s => s.text === symbolText);
        if (symbol) {
            setSelectedSymbol(symbol);
            setDisplayConfirmSymbol(true);
        }
    };

    const confirmSymbolSelection = () => {
        if (!selectedSymbol) {
            console.error("Symbol not provided");
            return;
        }
        setOutputSymbol(selectedSymbol);
        setCurrentStep(CollageCreationStep.SelectSmallSizeStep);
    }

    const cancelSymbolSelection = () => {
        setSelectedSymbol(null);
        setDisplayConfirmSymbol(false);
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    return (
        <div className={styles.outputContainer}>
            {type === CollageCreationType.Image ?
                <div>
                    {loading ?
                        <div>
                            <div className={styles.loadingScreenView} >
                                <LoadingScreen message={loadingMessage} />
                            </div>
                            {cropperVisible && 
                                <CustomCropper
                                    selectedImage={selectedImage}
                                    crop={crop}
                                    setCrop={setCrop}
                                    zoom={zoom}
                                    setZoom={setZoom}
                                    setCropArea={setCropArea}
                                    aspect={mapAspectRatio(outputSize)}
                                >
                                    <div className={styles.wrapRowContainer}>
                                        <CropperButton
                                            onClick={cropMainImage}
                                            text="Crop"
                                        />
                                        <CropperButton
                                            onClick={rotate}
                                            text="Rotate Image"
                                        />
                                        <CropperButton
                                            onClick={confirmCancelCrop}
                                            text="Cancel"
                                        />
                                    </div>
                                </CustomCropper>
                            }
                        </div>
                    :
                    <>
                        <div className={styles.chooseCropView}>
                            <Checkbox
                                id="Crop image"
                                checked={cropImage}
                                onChange={handleChangeCropImage}
                                disabled={false}
                                checkboxSize={20}
                            />
                            <p className={styles.cropImageText}>Crop Image</p>
                        </div>
                        <ImageUpload
                            id="main-image-upload"
                            title="Choose Main Image"
                            onChange={handleMainImageChange}
                        />
                        {displayConfirmImage &&
                            <div className={styles.confirmContainer}>
                                <div>
                                    Confirm image?
                                </div>
                                <div className={styles.buttonContainer}>
                                    <GeneralButton text="Yes" onClick={confirmImageSelection} />
                                    <GeneralButton text="No" onClick={cancelImageSelection} />
                                </div>
                            </div>
                        }
                        {tempImage &&
                            <div className={styles.mainImageContainer}>
                                <img src={tempImage} 
                                    alt="Main Image" 
                                    className={styles.mainImage} 
                                    style={{ aspectRatio: mapAspectRatio(outputSize) }}
                                />
                            </div>
                        }
                    </>
                    }
                </div>

            : type === CollageCreationType.Text ?
                <div className={styles.textInputView}>
                    <TextInput
                        maxWidth="50%"
                        value={text}
                        placeholder={"Enter text"}
                        onChange={handleTextChange}
                    />
                    <GeneralButton text={"Next Step"} onClick={completedText} />
                </div>    

            :
            <div>
                <div className={styles.dropdownContainer}>
                    <select id="symbolSelect" onChange={handleSymbolChange}>
                        <option value="">--Select a symbol--</option>
                        {availableSymbols.map((symbol) => (
                            <option key={symbol.text} value={symbol.text}>
                                {symbol.text}
                            </option>
                        ))}
                    </select>
                </div>
                {displayConfirmSymbol &&
                    <div className={styles.confirmContainer}>
                        <div>
                            Confirm symbol?
                        </div>
                        <div className={styles.buttonContainer}>
                            <GeneralButton text="Yes" onClick={confirmSymbolSelection} />
                            <GeneralButton text="No" onClick={cancelSymbolSelection} />
                        </div>
                    </div>
                }
                {selectedSymbol && (
                    <div className={styles.symbolContainer}>
                        <img src={selectedSymbol.image} className={styles.symbolImage} alt={selectedSymbol.text} />
                    </div>
                )}
            </div>
            }
        </div>
    )
}