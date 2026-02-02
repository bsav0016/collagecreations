class AddWhiteDTO {
    selectedImage: File;

    constructor(selectedImage: File) {
        this.selectedImage = selectedImage;
    }

    createBody(): FormData {
        const formData = new FormData();
        formData.append("input_image", this.selectedImage);
        return formData;
    }
}

export default AddWhiteDTO;
