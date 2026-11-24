import NetworkRequest from "../lib/networkClient";
import { CUSTOMER_AUTHORIZATION_HEADER, POST } from "../lib/networkRequestConstants";
import CropImageDTO from "../dtos/CropImageDTO";

interface CropImageResponse {
    temporary_image_id: string;
    smaller_image: string;
}

const CropImageService = {
    async cropImage(cropImageDTO: CropImageDTO, customerToken?: string | null): Promise<CropImageResponse> {
        try {
            const response = await NetworkRequest({
                urlExtension: 'api/resize-image/',
                method: POST,
                headers: customerToken ? CUSTOMER_AUTHORIZATION_HEADER(customerToken) : {},
                body: cropImageDTO.createBody()
            });
            return response.data as CropImageResponse;
        } catch (error) {
            console.error('Error during fetch operation:', error);
            throw error;
        }
    }
};

export default CropImageService;
