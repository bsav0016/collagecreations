import { CreatePreviewDTO } from "../dtos/createPreviewDTO/createPreviewDTO";
import { CreatePreviewResponseDTO } from "../dtos/createPreviewDTO/createPreviewResponseDTO";
import NetworkRequest from "../lib/networkClient";
import { POST } from "../lib/networkRequestConstants";
import { CollageCreationType } from "../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { SymbolOption } from "../pages/Customer/collageCreationPage/interfaces/SymbolOption";


export async function createPreview(
    type: CollageCreationType, 
    size: OutputSize, 
    smallImageSize: SmallImageSize, 
    text?: string, 
    symbol?: SymbolOption,
    mainImage?: string | null
) {
    const createPreviewDTO = CreatePreviewDTO.fromVariables(type, size, smallImageSize, text, symbol, mainImage);
    const body = await createPreviewDTO.createBody();

    const data = await NetworkRequest({
        urlExtension: 'api/preview/',
        method: POST,
        body: body
    });

    const previewData = CreatePreviewResponseDTO.fromResponse(data);
    return previewData.lightDarkArray;
}