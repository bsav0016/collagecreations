import NetworkRequest from "../lib/networkClient";
import { POST } from "../lib/networkRequestConstants";
import CropImageDTO from "../dtos/CropImageDTO";

interface CropImageResponse {
    temporary_image_id: number;
    smaller_image: string;
}

const CropImageService = {
    async cropImage(cropImageDTO: CropImageDTO): Promise<CropImageResponse> {
        try {
            const data = await NetworkRequest({
                urlExtension: 'api/resize-image/',
                method: POST,
                body: cropImageDTO.createBody()
            });
            return data as CropImageResponse;
        } catch (error) {
            console.error('Error during fetch operation:', error);
            throw error;
        }
    }
};

export default CropImageService;
