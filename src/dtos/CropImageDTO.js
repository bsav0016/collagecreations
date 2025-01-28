class CropImageDTO {
    constructor(file, targetWidth, targetHeight, isDesktop, crop = null) {
        this.file = file
        this.targetWidth = targetWidth
        this.targetHeight = targetHeight
        this.isDesktop = isDesktop
        this.crop = crop
    }

    createBody() {
        const formData = new FormData()
        formData.append('input_image', this.file);
        formData.append('width', this.targetWidth);
        formData.append('height', this.targetHeight);
        if (this.crop) {
            formData.append('croppedArea', `${this.crop.x},${this.crop.y},${this.crop.width},${this.crop.height}`);
        }
        formData.append('isMobile', !this.isDesktop);
        return formData;
    }
}

export default CropImageDTO;