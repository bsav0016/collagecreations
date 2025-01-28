import { processImageString } from "../../utils/modifyImage";

class AddWhiteResponseDTO {
    constructor(responseData) {
        this.image = responseData.image;
    }

    async processImage() {
        return await processImageString(this.image);
    }
}

export default AddWhiteResponseDTO;
