import React from 'react';
import styles from './customCropper.module.css';
import Cropper from 'react-easy-crop';


const CustomCropper = ({
    children, 
    selectedImage, 
    crop,
    setCrop,
    zoom,
    setZoom,
    setCropArea,
    aspect = 1
}) => (
    <div className={styles.cropperContainer}>
        <Cropper
            style={{ containerStyle: { backgroundColor: '#282c34' } }}
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => setCropArea(croppedAreaPixels)}
            onZoomChange={setZoom}
            zoomWithScroll={false}
        />
        <div className={styles.controls}>
            <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <div className={styles.wrapRowContainer}>
                {children}
            </div>
        </div>
    </div>
);

export default CustomCropper;