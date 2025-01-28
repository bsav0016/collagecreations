import { CollageCreationType } from "../../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { SymbolOption } from "../../pages/Customer/collageCreationPage/interfaces/SymbolOption";

export class CreatePreviewDTO {
    type: string;
    width: number;
    height: number;
    smallImageSize: number;
    text?: string;
    symbol?: string;

    constructor(
        type: string,
        width: number,
        height: number,
        smallImageSize: number,
        text?: string,
        symbol?: string
    ) {
        this.type = type
        this.width = width
        this.height = height
        this.smallImageSize = smallImageSize
        this.text = text
        this.symbol = symbol
    }

    static fromVariables(
        type: CollageCreationType,
        size: OutputSize,
        smallImageSize: SmallImageSize,
        text?: string,
        symbol?: SymbolOption
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
            symbol?.text
        )
    }
}