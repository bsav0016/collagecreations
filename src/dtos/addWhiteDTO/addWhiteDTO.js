class AddWhiteDTO {
    constructor(selectedImage) {
        this.selectedImage = selectedImage
    }

    createBody() {
        const formData = new FormData();
        formData.append('input_image', this.selectedImage);
        return formData
    }
}

export default AddWhiteDTO;