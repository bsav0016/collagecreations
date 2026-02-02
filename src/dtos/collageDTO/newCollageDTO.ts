import { CollageCreationType } from "../../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../../pages/Customer/collageCreationPage/enums/SmallImageSize";
import { createFileFromBlobUrl } from "../../utils/modifyImage";

export class NewCollageDTO {
    isMobile: boolean;
    type: string;
    output_width: number;
    output_height: number;
    smallImageSize: string;
    smallImages: any[];
    mainImage?: any;
    lightDarkArray?: number[][]
    color?: boolean | null

    constructor(
        isMobile: boolean,
        type: string,
        output_width: number,
        output_height: number,
        smallImageSize: string,
        smallImages: any[],
        mainImage?: any,
        lightDarkArray?: boolean[][],
        color?: boolean | null
    ) {
        this.isMobile = isMobile
        this.type = type
        this.output_width = output_width
        this.output_height =  output_height
        this.smallImageSize = smallImageSize
        this.smallImages = smallImages
        this.mainImage = mainImage
        if (lightDarkArray) {
            const newLightDarkArray: number[][] = lightDarkArray.map((lightDarkRow) => (
                lightDarkRow.map((lightDarkCell) => (
                    lightDarkCell === true ? 255 : lightDarkCell === false ? 0 : lightDarkCell
                ))
            ));
            this.lightDarkArray = newLightDarkArray;
        }
        this.color = color
    }

    static fromVariables(
        isMobile: boolean,
        type: CollageCreationType,
        outputSize: OutputSize,
        smallImageSize: SmallImageSize,
        smallImages: any[],
        mainImage?: any,
        lightDarkArray?: boolean[][],
        color?: boolean | null
    ) {
        const typeString = type === CollageCreationType.Image
            ? "image"
            : type === CollageCreationType.Text
            ? "text"
            : "symbol"

        const outputSizes = outputSize.split('x')
        const width = parseFloat(outputSizes[0])
        const height = parseFloat(outputSizes[1])

        const smallSize = smallImageSize === SmallImageSize.Large
            ? "large"
            : smallImageSize === SmallImageSize.Medium
            ? "medium"
            : "small"

        return new NewCollageDTO(
            isMobile,
            typeString,
            width,
            height,
            smallSize,
            smallImages,
            mainImage,
            lightDarkArray,
            color
        )
    }

    async toFormData(): Promise<FormData> {
        const formData = new FormData();
        formData.append("is_mobile", String(this.isMobile));
        formData.append('type', this.type);

        if (this.mainImage) {
            const mainImageFile = await createFileFromBlobUrl(this.mainImage, "main_image.jpg");
            formData.append("large_image", mainImageFile);
        }
        if (this.lightDarkArray) {
            formData.append("light_dark_array", JSON.stringify(this.lightDarkArray));
        }
    
        const smallImageFiles = await Promise.all(
            this.smallImages.map((imageUrl, index) => {
                return createFileFromBlobUrl(imageUrl, `cropped_image_${index}.jpg`);
            })
        );
        smallImageFiles.forEach((file) => {
            formData.append("small_images", file);
        });

        formData.append("small_image_size", this.smallImageSize.toString());
    
        formData.append("output_width", this.output_width.toString());
        formData.append("output_height", this.output_height.toString());

        formData.append("color", String(this.color) ?? "false");
    
        return formData;
    }
}