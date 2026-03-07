export class CreatePreviewResponseDTO {
    lightDarkArray: boolean[][]

    constructor(lightDarkArray: boolean[][]) {
        this.lightDarkArray = lightDarkArray
    }

    static fromResponse(response: any) {
        return new CreatePreviewResponseDTO(response.light_dark_array)
    }
}