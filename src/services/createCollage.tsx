import { NewCollageDTO } from "../dtos/collageDTO/newCollageDTO";
import NetworkRequest from "../lib/networkClient";
import { POST } from "../lib/networkRequestConstants";
import { CollageCreationType } from "../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { NewCollageResponseDTO } from "../dtos/collageDTO/newCollageResponseDTO";


export async function createCollage (
    isMobile: boolean,
    type: CollageCreationType,
    outputSize: OutputSize,
    smallImageSize: SmallImageSize,
    smallImages: any[],
    mainImage?: any,
    lightDarkArray?: boolean[][],
    color?: boolean | null
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

    const data = await NetworkRequest({
        urlExtension: 'api/collage/',
        method: POST,
        body: formData
    });

    const collageData = NewCollageResponseDTO.fromResponse(data);
    return collageData;
}