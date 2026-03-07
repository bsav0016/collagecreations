import { NewCollageDTO } from "../dtos/collageDTO/newCollageDTO";
import NetworkRequest from "../lib/networkClient";
import { AUTHORIZATION_HEADER, POST, GET } from "../lib/networkRequestConstants";
import { CollageCreationType } from "../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { NewCollageResponseDTO } from "../dtos/collageDTO/newCollageResponseDTO";

const POLL_INTERVAL_MS = 3000; // Poll every 3 seconds
const MAX_POLL_ATTEMPTS = 120; // Max 6 minutes of polling

async function pollTaskResult(taskId: string, userToken: string | null): Promise<any> {
    const headers = userToken ? { ...AUTHORIZATION_HEADER(userToken) } : {};
    
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        const response = await NetworkRequest({
            urlExtension: `api/task-result/${taskId}/`,
            method: GET,
            headers: headers,
        });

        if (response.status === 201) {
            // Task completed successfully
            return response.data;
        } else if (response.status === 202) {
            // Task still pending, wait and retry
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
        } else {
            // Unexpected status
            throw new Error('Unexpected response from task status endpoint');
        }
    }
    
    throw new Error('Collage creation timed out. Please try again.');
}

export async function createCollage (
    userToken: string | null,
    isMobile: boolean,
    type: CollageCreationType,
    outputSize: OutputSize,
    smallImageSize: SmallImageSize,
    smallImages: any[],
    mainImage?: any,
    lightDarkArray?: boolean[][],
    color?: boolean | null,
) {
    const collageDTO = NewCollageDTO.fromVariables(
        isMobile,
        type,
        outputSize,
        smallImageSize,
        smallImages,
        mainImage,
        lightDarkArray,
        color
    )

    const formData = await collageDTO.toFormData();

    const headers = userToken ? { ...AUTHORIZATION_HEADER(userToken) } : {};
    
    const response = await NetworkRequest<{ task_id: string }>({
        urlExtension: 'api/collage/',
        headers: headers,
        method: POST,
        body: formData
    });

    if (response.status !== 202) {
        throw new Error('Unexpected response when starting collage creation');
    }

    const taskId = response.data.task_id;
    const resultData = await pollTaskResult(taskId, userToken);
    
    const collageData = NewCollageResponseDTO.fromResponse(resultData);
    return collageData;
}