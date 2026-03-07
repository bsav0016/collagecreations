import { createFileFromBlobUrl } from "../../utils/modifyImage";

class CollageDTO {
    size: string;
    type: string;
    text: string;
    mainImageUrl: string;
    croppedImageUrls: string[];
    largerImages: boolean;
    color: string;

    constructor(
        size: string,
        type: string,
        text: string,
        mainImageUrl: string,
        croppedImageUrls: string[],
        largerImages: boolean,
        color: string
    ) {
        this.size = size;
        this.type = type;
        this.text = text;
        this.mainImageUrl = mainImageUrl;
        this.croppedImageUrls = croppedImageUrls;
        this.largerImages = largerImages;
        this.color = color;
    }

    async toFormData(): Promise<FormData> {
        const formData = new FormData();
        if (this.type === "text") {
            formData.append("type", "text");
            formData.append("word", this.text);
            formData.append("large_images", String(this.largerImages));
            formData.append("color", this.color);
        } else {
            const mainImageFile = await createFileFromBlobUrl(this.mainImageUrl, "main_image.jpg");
            formData.append("type", "image");
            formData.append("large_image", mainImageFile);
        }

        const croppedImageFiles = await Promise.all(
            this.croppedImageUrls.map((croppedImageUrl, index) => {
                const fileName = `cropped_image_${index}.jpg`;
                return createFileFromBlobUrl(croppedImageUrl, fileName);
            })
        );

        croppedImageFiles.forEach((file) => {
            formData.append("small_images", file);
        });

        formData.append("output_width", this.size.split("x")[0]);
        formData.append("output_height", this.size.split("x")[1]);

        return formData;
    }
}

export default CollageDTO;
