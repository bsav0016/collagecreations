import Resizer from 'react-image-file-resizer';
import { IS_DESKTOP } from "./constants/constants";
import CropImageService from '../services/CropImageService';
import CropImageDTO from '../dtos/CropImageDTO';
import { toastRef } from '../context/toastContext/toastContext';
import { CropArea } from '../pages/Customer/collageCreationPage/interfaces/CropArea';

export const rotateImage = async (imageSrc: string | null): Promise<string> => {
    if (!imageSrc) throw new Error('No image source provided');
    const file = await fetchUrlAsFile(imageSrc);
    return new Promise((resolve, reject) => {
        try {
            Resizer.imageFileResizer(
                file,
                999999999999,
                999999999999,
                'PNG',
                100,
                90,
                (rotatedImage) => {
                    if (rotatedImage) {
                        const resizedImageURL = URL.createObjectURL(rotatedImage as Blob);
                        resolve(resizedImageURL);
                    } else {
                        const error = new Error('Failed to rotate image');
                        toastRef.current?.(error.message);
                        reject(error);
                    }
                },
                'blob'
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toastRef.current?.(`Failed to rotate image: ${errorMessage}`);
            reject(error);
        }
    });
};

export const getCroppedImg = async (imageSrc: string | null, crop: CropArea): Promise<Blob> => {
    if (!imageSrc) throw new Error('No image source provided');
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        const image = await createImage(imageSrc);
        const imageBitmap = await createImageBitmap(image);

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            imageBitmap,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    reject(new Error('Failed to create blob.'));
                    return;
                }
                resolve(blob);
            }, 'image/png', 1);
        });
    } catch (error) {
        console.error('Error cropping image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toastRef.current?.('Error cropping image: ' + errorMessage);
        throw error;
    }
};

interface CropAndResizeResponse {
    temporary_image_id: number;
    smaller_image: string;
}

export const cropAndResizeLarge = async (
    imageSrc: string, 
    crop: CropArea, 
    targetWidth: number, 
    targetHeight: number
): Promise<CropAndResizeResponse> => {
    try {
        const imageResponse = await fetch(imageSrc);
        if (!imageResponse.ok) {
            throw new Error('Failed to fetch image');
        }
        const blob = await imageResponse.blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        const cropImageDTO = new CropImageDTO(file, targetWidth, targetHeight, IS_DESKTOP, crop);

        return await CropImageService.cropImage(cropImageDTO);
    } catch (error) {
        console.error('Error loading file:', error);
        throw error;
    }
};

export const resizeImage = async (
    file: File, 
    targetWidth: number, 
    targetHeight: number
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        try {
            Resizer.imageFileResizer(
                file,
                targetWidth,
                targetHeight,
                'PNG',
                100,
                0,
                (resizedImage) => {
                    if (resizedImage) {
                        resolve(resizedImage as Blob);
                    } else {
                        reject(new Error('Resized image is null or undefined'));
                    }
                },
                'blob'
            );
        } catch (error) {
            console.error('Caught exception during resizing:', error);
            reject(error);
        }
    });
};

export const createTempImage = async (
    file: File, 
    targetWidth: number, 
    targetHeight: number
): Promise<CropAndResizeResponse> => {
    const cropImageDTO = new CropImageDTO(file, targetWidth, targetHeight, IS_DESKTOP);
    return await CropImageService.cropImage(cropImageDTO);
};

export const createImgString = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1];
                resolve(base64String);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.log('Error creating image: ', error);
            reject(error);
        }
    });
};

export const processImageString = async (
    imageString: string, 
    type: string = 'image/jpeg'
): Promise<Blob> => {
    try {
        const decodedData = atob(imageString);
        const bytes = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            bytes[i] = decodedData.charCodeAt(i);
        }
        return new Blob([bytes], { type: type });
    } catch (error) {
        throw new Error(`Error processing string: ${error}`);
    }
};

export const createFileFromBlobUrl = async (
    blobUrl: string, 
    fileName: string
): Promise<File> => {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        throw new Error(`Error creating file: ${error}`);
    }
};

export const convertImageToBlob = async (imageUrl: string): Promise<Blob> => {
    const response = await fetch(imageUrl);
    return response.blob();
};

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (error) => reject(error));
        img.src = url;
    });

const fetchUrlAsFile = async (imageUrl: string): Promise<File> => {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image.');
    const blob = await response.blob();
    return new File([blob], 'image.png', { type: blob.type });
};
