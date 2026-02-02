import { processImageString } from "../../utils/modifyImage";

interface AddWhiteResponse {
    image: string;
}

class AddWhiteResponseDTO {
    image: string;

    constructor(responseData: AddWhiteResponse) {
        this.image = responseData.image;
    }

    async processImage(): Promise<Blob> {
        return await processImageString(this.image);
    }
}

export default AddWhiteResponseDTO;
