import { convertImageToBlob } from "../../../utils/modifyImage";
import { CollageCreationType } from "./enums/collageCreationType";
import { OutputSize } from "./enums/OutputSize";
import { SmallImageSize } from "./enums/SmallImageSize";
import { SymbolOption } from "./interfaces/SymbolOption";

const typeString: string = "type";
const outputSizeString: string = "outputSize";
const outputTextString: string = "outputText";
const outputSymbolString: string = "outputSymbol";
const smallImageSizeString: string = "smallImageSize";
const lightDarkArrayString: string = "lightDarkArray";
const colorString: string = "color";
const mainImageString: string = "mainImage";
const smallImagesString: string = "smallImages";

export const databaseUtils = (
    setVariable: (key: string, value: any) => Promise<void>, 
    loadVariable: (key: string) => Promise<any>
) => ({
    
    async storeType(type: CollageCreationType) {
        await setVariable(typeString, type);
    },
    async loadType() {
        try {
            const result = await loadVariable(typeString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeOutputSize(outputSize: OutputSize) {
        await setVariable(outputSizeString, outputSize);
    },
    async loadOutputSize() {
        try {
            const result = await loadVariable(outputSizeString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeOutputText(outputText: string) {
        await setVariable(outputTextString, outputText);
    },
    async loadOutputText() {
        try {
            const result = await loadVariable(outputTextString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeOutputSymbol(outputSymbol: SymbolOption) {
        await setVariable(outputSymbolString, outputSymbol);
    },
    async loadOutputSymbol() {
        try {
            const result = await loadVariable(outputSymbolString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeSmallImageSize(smallImageSize: SmallImageSize) {
        await setVariable(smallImageSizeString, smallImageSize);
    },
    async loadSmallImageSize() {
        try {
            const result = await loadVariable(smallImageSizeString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeLightDarkArray(lightDarkArray: boolean[][]) {
        await setVariable(lightDarkArrayString, lightDarkArray);
    },
    async loadLightDarkArray() {
        try {
            const result = await loadVariable(lightDarkArrayString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeColor(color: boolean[][]) {
        await setVariable(colorString, color);
    },
    async loadColor() {
        try {
            const result = await loadVariable(colorString);
            if (result) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeMainImage(mainImage: string) {
        const blob = await convertImageToBlob(mainImage);
        await setVariable(mainImageString, blob);
    },
    async loadMainImage() {
        try {
            const result = await loadVariable(mainImageString);
            if (result) {
                const url = URL.createObjectURL(result);
                return url;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async storeSmallImages(smallImages: string[]) {
        const blobs = [];
        for (const image of smallImages) {
            const blob = await convertImageToBlob(image);
            blobs.push(blob);
        }
        
        await setVariable(smallImagesString, blobs);
    },
    async loadSmallImages() {
        try {
            const result = await loadVariable(smallImagesString);
            const urls = [];
            if (result) {
                for (const blob of result) {
                    const url = URL.createObjectURL(blob);
                    urls.push(url);
                }
                return urls;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }
});
