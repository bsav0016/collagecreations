interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

class CropImageDTO {
    file: File;
    targetWidth: number;
    targetHeight: number;
    isDesktop: boolean;
    crop: CropArea | null;

    constructor(
        file: File,
        targetWidth: number,
        targetHeight: number,
        isDesktop: boolean,
        crop: CropArea | null = null
    ) {
        this.file = file;
        this.targetWidth = targetWidth;
        this.targetHeight = targetHeight;
        this.isDesktop = isDesktop;
        this.crop = crop;
    }

    createBody(): FormData {
        const formData = new FormData();
        formData.append("input_image", this.file);
        formData.append("width", String(this.targetWidth));
        formData.append("height", String(this.targetHeight));
        if (this.crop) {
            formData.append(
                "croppedArea",
                `${this.crop.x},${this.crop.y},${this.crop.width},${this.crop.height}`
            );
        }
        formData.append("isMobile", String(!this.isDesktop));
        return formData;
    }
}

export default CropImageDTO;
