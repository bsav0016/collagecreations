import { processImageString } from "../../utils/modifyImage";

import type { Schema } from "../../api/types";

type AddWhiteResponse = Schema<"AddWhiteResponse">;

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
