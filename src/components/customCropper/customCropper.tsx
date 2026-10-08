import React from "react";
import Cropper from "react-easy-crop";
import { ZoomIn, ZoomOut } from "lucide-react";
import CropperButton from "../cropperButton/cropperButton";

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CustomCropperProps {
    /** The buttons for the right-hand side of the bar (Rotate, Skip, the primary action...). */
    actions: React.ReactNode;
    onCancel: () => void;
    cancelText?: string;
    /** Heading above the photo, e.g. "Photo 2 of 6". */
    title?: string;
    /** One line of instructions under the heading. */
    hint?: string;
    disabled?: boolean;
    selectedImage: string;
    crop: { x: number; y: number };
    setCrop: (crop: { x: number; y: number }) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    setCropArea: (cropArea: CropArea) => void;
    aspect?: number;
}

// Full-screen cropper: heading, then the photo in whatever space is left, then a control bar below it
// (so the controls never cover the photo). On a phone the actions sit in a 2-column grid with the
// primary action full width; on a wider screen everything is on one row.
const CustomCropper: React.FC<CustomCropperProps> = ({
    actions,
    onCancel,
    cancelText = "Cancel",
    title,
    hint,
    disabled = false,
    selectedImage,
    crop,
    setCrop,
    zoom,
    setZoom,
    setCropArea,
    aspect = 1,
}) => (
    <div className="fixed inset-0 z-[1000] flex flex-col bg-[#282c34] text-white transition-none">
        {(title || hint) && (
            <div className="shrink-0 px-4 pb-2 pt-3 text-center">
                {title && <div className="text-base font-semibold">{title}</div>}
                {hint && <div className="text-xs text-white/70">{hint}</div>}
            </div>
        )}
        <div className="relative min-h-0 flex-1">
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
        </div>
        <div className="shrink-0 bg-neutral-950 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
                <div className="flex items-center gap-3">
                    <ZoomOut className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        aria-label="Zoom"
                        className="h-6 w-full cursor-pointer accent-primary"
                    />
                    <ZoomIn className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CropperButton variant="ghost" text={cancelText} onClick={onCancel} disabled={disabled} />
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">{actions}</div>
                </div>
            </div>
        </div>
    </div>
);

export default CustomCropper;
