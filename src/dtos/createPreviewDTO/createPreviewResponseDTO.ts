import type { Schema } from "../../api/types";

export class CreatePreviewResponseDTO {
    lightDarkArray: boolean[][]

    constructor(lightDarkArray: boolean[][]) {
        this.lightDarkArray = lightDarkArray
    }

    // The server sends 255 for a light cell and 0 for a dark one.
    static fromResponse(response: Schema<"CreatePreviewResponse">) {
        return new CreatePreviewResponseDTO(response.light_dark_array.map((row) => row.map((cell) => cell !== 0)))
    }
}