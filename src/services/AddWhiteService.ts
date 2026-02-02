import { AUTHORIZATION_HEADER, POST } from "../lib/networkRequestConstants";
import NetworkRequest from "../lib/networkClient";
import AddWhiteResponseDTO from '../dtos/addWhiteDTO/addWhiteResponseDTO';
import AddWhiteDTO from "../dtos/addWhiteDTO/addWhiteDTO";

const addWhiteService = async (selectedFile: File, token: string): Promise<string> => {
    const headers = {
        ...AUTHORIZATION_HEADER(token)
    };
    
    const addWhiteDTO = new AddWhiteDTO(selectedFile);

    const data = await NetworkRequest<AddWhiteResponseDTO>({
        urlExtension: 'api/add-white/',
        method: POST,
        headers: headers,
        body: addWhiteDTO.createBody()
    });

    try {
        const addWhiteResponseDTO = new AddWhiteResponseDTO(data);
        const img = await addWhiteResponseDTO.processImage();
        return URL.createObjectURL(img);
    } catch {
        throw new Error('Failed processing image');
    }
};

export default addWhiteService;
