import React from "react";
import Cropper from "react-easy-crop";

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CustomCropperProps {
    children: React.ReactNode;
    selectedImage: string;
    crop: { x: number; y: number };
    setCrop: (crop: { x: number; y: number }) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    setCropArea: (cropArea: CropArea) => void;
    aspect?: number;
}

const CustomCropper: React.FC<CustomCropperProps> = ({
    children,
    selectedImage,
    crop,
    setCrop,
    zoom,
    setZoom,
    setCropArea,
    aspect = 1,
}) => (
    <div className="grid justify-items-center fixed top-0 left-0 w-screen h-screen z-[1000] transition-none">
        <Cropper
            style={{ containerStyle: { backgroundColor: "#282c34" } }}
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => setCropArea(croppedAreaPixels)}
            onZoomChange={setZoom}
            zoomWithScroll={false}
        />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 p-[10px] rounded-[5px] z-[1000] max-md:bottom-[90px] max-md:left-[30%] max-md:w-[70%] max-md:-translate-x-[21.4%]">
            <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full mb-[10px] z-[1000] max-md:h-5"
            />
            <div className="flex flex-wrap justify-center">
                {children}
            </div>
        </div>
    </div>
);

export default CustomCropper;
