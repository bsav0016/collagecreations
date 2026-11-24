import { CreatePreviewDTO } from "../dtos/createPreviewDTO/createPreviewDTO";
import { CreatePreviewResponseDTO } from "../dtos/createPreviewDTO/createPreviewResponseDTO";
import NetworkRequest from "../lib/networkClient";
import type { Schema } from "../api/types";
import { CUSTOMER_AUTHORIZATION_HEADER, POST } from "../lib/networkRequestConstants";
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
    mainImage?: string | null,
    customerToken?: string | null,
) {
    const createPreviewDTO = CreatePreviewDTO.fromVariables(type, size, smallImageSize, text, symbol, mainImage);
    const body = await createPreviewDTO.createBody();

    const response = await NetworkRequest<Schema<"CreatePreviewResponse">>({
        urlExtension: 'api/preview/',
        method: POST,
        // Signed-in customers are counted per account at a higher rate than guests per address.
        headers: customerToken ? CUSTOMER_AUTHORIZATION_HEADER(customerToken) : {},
        body: body
    });

    const previewData = CreatePreviewResponseDTO.fromResponse(response.data);
    return previewData.lightDarkArray;
}