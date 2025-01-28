import Resizer from 'react-image-file-resizer';
import { IS_DESKTOP } from "./constants/constants";
import CropImageService from '../services/CropImageService';
import CropImageDTO from '../dtos/CropImageDTO';
import { toastRef } from '../context/toastContext/toastContext';

export const rotateImage = async (imageSrc) => {
    const file = await fetchUrlAsFile(imageSrc)
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
            file,
            999999999999,
            999999999999,
            'PNG',
            100,
            90,
            (rotatedImage) => {
                const resizedImageURL = URL.createObjectURL(rotatedImage)
                resolve(resizedImageURL);
            },
            'blob',
            (error) => {
                toastRef.current(`Failed to rotate image: ${error.message}`);
                reject(error);
            }
        )
    });
};
  
export const getCroppedImg = async (imageSrc, crop) => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
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
        toastRef.current('Error cropping image: ' + error.message);
        throw error;
    }
};
  
export const cropAndResizeLarge = async (imageSrc, crop, targetWidth, targetHeight) => {
    try {
        const imageResponse = await fetch(imageSrc);
        if (!imageResponse.ok) {
            throw new Error('Failed to fetch image');
        }
        const blob = await imageResponse.blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        const cropImageDTO = new CropImageDTO(file, targetWidth, targetHeight, IS_DESKTOP, crop)        

        return await CropImageService.cropImage(cropImageDTO);
    } catch (error) {
        console.error('Error loading file:', error);
        throw(error);
    }
};

export const resizeImage = async (file, targetWidth, targetHeight) => {
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
                        resolve(resizedImage);
                    } else {
                        reject(new Error('Resized image is null or undefined'));
                    }
                },
                'blob',
                (error) => {
                    console.error('Resizing error:', error);
                    reject(error);
                }
            );
        } catch (error) {
            console.error('Caught exception during resizing:', error);
            reject(error);
        }
    });
};

export const createTempImage = async (file, targetWidth, targetHeight) => {
    const cropImageDTO = new CropImageDTO(file, targetWidth, targetHeight, IS_DESKTOP)
    return await CropImageService.cropImage(cropImageDTO);
};

export const createImgString = async (blob) => {
    new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String)
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.log('Error creating image: ', error)
            reject(error)
        }
    })
};

export const processImageString = async (imageString) => {
    try {
        const decodedData = atob(imageString);
        const bytes = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            bytes[i] = decodedData.charCodeAt(i);
        }
        return new Blob([bytes], { type: 'image/jpeg' });
    } catch (error) {
        throw new Error(`Error processing string: ${error}`)
    }
};

export const createFileFromBlobUrl = async (blobUrl, fileName) => {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        throw new Error(`Error creating file: ${error}`);
    }
};

export const convertImageToBlob = async (imageUrl) => {
    const response = await fetch(imageUrl);
    return response.blob();
};

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (error) => reject(error));
        img.src = url;
    }
);

const fetchUrlAsFile = async (imageUrl) => {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image.');
    const blob = await response.blob();
    return new File([blob], 'image.png', { type: blob.type });
};
