interface CollageResponse {
    temporary_image_id: number;
    watermark_collage: string;
    base_cost: number;
}

class CollageResponseDTO {
    temporaryImageId: number;
    watermarkCollage: string;
    baseCost: number;

    constructor(temporaryImageId: number, watermarkCollage: string, baseCost: number) {
        this.temporaryImageId = temporaryImageId;
        this.watermarkCollage = watermarkCollage;
        this.baseCost = baseCost;
    }

    static fromResponse(response: CollageResponse): CollageResponseDTO {
        return new CollageResponseDTO(
            response.temporary_image_id,
            response.watermark_collage,
            response.base_cost
        );
    }
}

export default CollageResponseDTO;
