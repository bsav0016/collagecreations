import { CollageCreationType } from "../../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { SymbolOption } from "../../pages/Customer/collageCreationPage/interfaces/SymbolOption";
import { convertImageToBlob, createFileFromBlobUrl, processImageString } from "../../utils/modifyImage";

export class CreatePreviewDTO {
    type: string;
    width: number;
    height: number;
    smallImageSize: number;
    text?: string;
    symbol?: string;
    mainImageUrl?: string | null

    constructor(
        type: string,
        width: number,
        height: number,
        smallImageSize: number,
        text?: string,
        symbol?: string,
        mainImageUrl?: string | null
    ) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.smallImageSize = smallImageSize;
        this.text = text;
        this.symbol = symbol;
        this.mainImageUrl = mainImageUrl;
    }

    static fromVariables(
        type: CollageCreationType,
        size: OutputSize,
        smallImageSize: SmallImageSize,
        text?: string,
        symbol?: SymbolOption,
        mainImageUrl?: string | null
    ) {
        const typeString = type === CollageCreationType.Symbol
            ? "symbol"
            : "text"

        const sizes = size.split('x')
        const width = parseFloat(sizes[0])
        const height = parseFloat(sizes[1])

        const smallSize = smallImageSize === SmallImageSize.Large
            ? 1
            : smallImageSize === SmallImageSize.Medium
            ? 0.6
            : 0.3

        return new CreatePreviewDTO(
            typeString,
            width,
            height,
            smallSize,
            text,
            symbol?.text,
            mainImageUrl
        )
    }

    async createBody() {
        const formData = new FormData();
        formData.append('type', this.type);
        formData.append('width', this.width.toString());
        formData.append('height', this.height.toString());
        if (this.smallImageSize) {
            formData.append('small_image_size', this.smallImageSize.toString());
        }
        if (this.text) {
            formData.append('text', this.text);
        }
        if (this.symbol) {
            formData.append('symbol', this.symbol);
        }
        if (this.mainImageUrl) {
            const symbolImage = await createFileFromBlobUrl(this.mainImageUrl);
            console.log(symbolImage);
            formData.append('symbol_image', symbolImage);
        }
        return formData;
    }
}