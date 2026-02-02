export class NewCollageResponseDTO {
    temporaryImageId: number;
    watermarkCollage: string;
    baseCost: number;

    constructor(
        temporaryImageId: number, 
        watermarkCollage: string, 
        baseCost: number
    ) {
        this.temporaryImageId = temporaryImageId;
        this.watermarkCollage = watermarkCollage;
        this.baseCost = baseCost;
    }

    static fromResponse(response: any) {
        return new NewCollageResponseDTO(
            response.temporary_image_id,
            response.watermark_collage,
            response.base_cost
        );
    }
}