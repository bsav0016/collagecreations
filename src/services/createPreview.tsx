import { CreatePreviewDTO } from "../dtos/createPreviewDTO/createPreviewDTO";
import { CreatePreviewResponseDTO } from "../dtos/createPreviewDTO/createPreviewResponseDTO";
import NetworkRequest from "../lib/networkClient";
import { APPLICATION_JSON_HEADER, POST } from "../lib/networkRequestConstants";
import { CollageCreationType } from "../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { SymbolOption } from "../pages/Customer/collageCreationPage/interfaces/SymbolOption";


export async function createPreview(
    type: CollageCreationType, 
    size: OutputSize, 
    smallImageSize: SmallImageSize, 
    text?: string, 
    symbol?: SymbolOption
) {
    const createPreviewDTO = CreatePreviewDTO.fromVariables(type, size, smallImageSize, text, symbol);

    const headers = {
        ...APPLICATION_JSON_HEADER,
    };

    const data = await NetworkRequest({
        urlExtension: 'api/preview/',
        method: POST,
        headers: headers,
        body: JSON.stringify(createPreviewDTO)
    });

    const previewData = CreatePreviewResponseDTO.fromResponse(data);
    return previewData.lightDarkArray;
}