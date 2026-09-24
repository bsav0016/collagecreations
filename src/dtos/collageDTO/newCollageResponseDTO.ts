export class NewCollageResponseDTO {
    temporaryImageId: string;
    watermarkCollage: string;
    baseCost: number;

    constructor(
        temporaryImageId: string, 
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