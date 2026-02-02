import React, { useRef, useState } from "react";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import usePreventScroll from "../../../../../hooks/preventScroll";
import { toastRef } from "../../../../../context/toastContext/toastContext";
import { rotateImage, getCroppedImg, resizeImage } from "../../../../../utils/modifyImage";
import { useLocalDatabase } from "../../../../../context/databaseContext";
import ImageUpload from "../../../../../components/imageUpload/imageUpload";
import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';
import BasicButton from "../../../../../components/basicButton/basicButton";
import CustomCropper from "../../../../../components/customCropper/customCropper";
import CropperButton from "../../../../../components/cropperButton/cropperButton";
import { useConstants } from "../../../../../context/constantsContext";
import LoadingScreen from "../../../../../components/loadingScreen/loadingScreen";
import { CropCoordinate } from "../../interfaces/CropCoordinate";
import { CropArea } from "../../interfaces/CropArea";

interface SelectImagesStepProps {
    setCurrentStep: (newStep: CollageCreationStep) => void;
    smallImages: string[];
    setSmallImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function SelectImagesStep({
    setCurrentStep,
    smallImages,
    setSmallImages
}: SelectImagesStepProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<CropCoordinate>({x: 0, y: 0});
    const [cropArea, setCropArea] = useState<CropArea>({x: 0, y: 0, width: 0, height: 0})
    const [zoom, setZoom] = useState<number>(1);
    const [cropperVisible, setCropperVisible] = useState<boolean>(false);
    const [localLoading, setLocalLoading] = useState<boolean>(false);

    const { deleteVariable } = useLocalDatabase();
    const { constants } = useConstants();
    
    const cropperRef = useRef<{ resolve: (value: unknown) => void; reject: (value: unknown) => void }>(
        { resolve: () => {}, reject: () => {} }
    );
    let skippedError = new Error('Skipped');
    let cancelError = new Error('Cancel');

    usePreventScroll(cropperVisible);

    const cropImage = async (imageUrl: string) => {
        return new Promise((resolve, reject) => {
          setSelectedImage(imageUrl);
          setCropperVisible(true);
          cropperRef.current = { resolve, reject };
        });
    };
    
    const skipImage = () => {
        if (cropperRef.current.reject) {
            cropperRef.current.reject(skippedError);
            resetCropperState();
        }
    };

    const handleCancelCrop = () => {
        setCropperVisible(false);
        setLocalLoading(false);
        resetCropperState();
    };
    
    const confirmCancelCrop = () => {
        toastRef.current?.("Are you sure you want to cancel cropping all images? You can also skip this image or remove an individual image later", 
            "info", 
            async () => {
            handleCancelCrop();
        });
    }

    const resetCropperState = () => {
        setSelectedImage(null);
        setCropperVisible(false);
    };

    const rotate = async () => {
        const newURL = await rotateImage(selectedImage);
        setSelectedImage(newURL);
    }
    
    const handleDelete = (index: number) => {
        const updatedImages = [...smallImages];
        updatedImages.splice(index, 1);
        setSmallImages(updatedImages);
    };
    
    const confirmClearImages = () => {
        toastRef.current?.("Are you sure you want to clear all images?", "info", () => {
            setSmallImages([]);
            deleteVariable('smallImages')
        });
    };

    const uploadSmallImages = async (event: any) => {
        const files = event.target.files;
        setLocalLoading(true);
      
        const newCroppedImages: string[] = [];
      
        for (const file of files) {
            let imageUrl: string | null;
            const fileIsHeic = 
                file.type === 'image/heic' ||
                file.type === 'image/heif' ||
                (file.type === '' && file.name.toLowerCase().endsWith('.heic'));
        
            if (file.type === 'image/jpeg') {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 999,
                    useWebWorker: true,
                };
                try {
                    const compressedFile = await imageCompression(file, options);
                    imageUrl = URL.createObjectURL(compressedFile);
                } catch (error: any) {
                    toastRef.current?.(`${error.message}`);
                    imageUrl = null;
                }
            } else if (file.type === 'image/png' || file.type === 'image/webp') {
                imageUrl = URL.createObjectURL(file);
            } else if (fileIsHeic) {
                const convertedBlob = await heic2any({ blob: file, toType: 'image/png' }) as Blob[];
                imageUrl = URL.createObjectURL(convertedBlob[0]);
            } else {
                imageUrl = null;
                toastRef.current?.('One of your files is not png, jpg, webp, or heic. It will not be included');
                continue;
            }
        
            try {
                if (imageUrl) {
                    const croppedImg = String(await cropImage(imageUrl));
                    newCroppedImages.push(croppedImg);
                }
            } catch (error: any) {
                if (error.message === cancelError.message) {
                    return;
                } else if (error.message === skippedError.message) {
                    continue;
                } else {
                    toastRef.current?.('Could not complete crop');
                }
            }
        }
      
        event.target.value = null;
        setSmallImages((prev) => [...prev, ...newCroppedImages]);
        setLocalLoading(false);
    };

    const cropIndividualImage = async () => {
        const resolveCrop = cropperRef.current.resolve
        if (!constants || !constants.PPI) {
            toastRef.current?.('Could not get constants');
            return;
        }
        if (resolveCrop) {
            const pixels = constants.PPI;
            const croppedImage = await getCroppedImg(selectedImage, cropArea);
            const file = new File([croppedImage], 'image.png', { type: croppedImage.type });
            const resizedImage = await resizeImage(file, pixels, pixels);
            const croppedImageUrl = URL.createObjectURL(resizedImage);
            resolveCrop(croppedImageUrl);
            resetCropperState();
        }
    };

    const goToCreate = () => {
        setCurrentStep(CollageCreationStep.CreateCollageStep)
    }

    return (
        <div>
            {localLoading ? (
                <div>
                    <div className="fixed top-0 left-0 w-full h-full z-[1000] flex justify-center items-center">
                        <LoadingScreen message="Saving image and preparing next image..."/>
                    </div>
                    {cropperVisible && selectedImage &&
                        <CustomCropper
                            selectedImage={selectedImage}
                            crop={crop}
                            setCrop={setCrop}
                            zoom={zoom}
                            setZoom={setZoom}
                            setCropArea={setCropArea}
                        >
                            <div className="flex flex-wrap justify-center">
                                <CropperButton
                                    onClick={cropIndividualImage}
                                    text="Crop"
                                />
                                <CropperButton
                                    onClick={rotate}
                                    text="Rotate Image"
                                />
                                <CropperButton
                                    onClick={skipImage}
                                    text="Skip Image"
                                />
                                <CropperButton
                                    onClick={confirmCancelCrop}
                                    text="Cancel All"
                                />
                            </div>
                        </CustomCropper>
                    }
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <GeneralButton 
                        text={smallImages.length < 5 ? "Minimum 5 Images" : "Next Step"} 
                        onClick={() => goToCreate()} 
                        disabled={smallImages.length < 5} 
                    />
                    <ImageUpload
                        id="image-upload"
                        title="Add Images"
                        onChange={uploadSmallImages}
                        multiple={true}
                    />
                    {(smallImages.length > 0) && (
                        <BasicButton
                            onClick={confirmClearImages}
                            text="Clear All Images"
                        />
                    )}
                    <div className="flex flex-wrap justify-center">
                        {smallImages.slice().reverse().map((croppedImage, index) => {
                            const originalIndex = smallImages.length - 1 - index;
                            return (
                                <div key={index} className="flex flex-col items-center my-6 mx-12 max-md:my-2.5 max-md:mx-5">
                                    <img src={croppedImage} alt="Cropped" className="max-w-full max-h-[120px] max-md:max-h-[90px]" />
                                    <BasicButton
                                        onClick={() => handleDelete(originalIndex)}
                                        text="Delete"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
