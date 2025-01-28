import NetworkRequest from "../lib/networkClient";
import { POST } from "../lib/networkRequestConstants";

const CropImageService = {
    async cropImage(cropImageDTO) {
        try {
            const data = await NetworkRequest({
                urlExtension: 'api/resize-image/',
                method: POST,
                body: cropImageDTO.createBody()
            });
            return data;
        } catch (error) {
            console.error('Error during fetch operation:', error);
            throw error;
        }
    }
}

export default CropImageService;