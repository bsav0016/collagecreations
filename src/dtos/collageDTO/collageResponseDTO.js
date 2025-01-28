class CollageResponseDTO {
    constructor(temporaryImageId, watermarkCollage, baseCost) {
        this.temporaryImageId = temporaryImageId;
        this.watermarkCollage = watermarkCollage;
        this.baseCost = baseCost;
    }

    static fromResponse(response) {
        return new CollageResponseDTO(
            response.temporary_image_id,
            response.watermark_collage,
            response.base_cost
        );
    }
}

export default CollageResponseDTO;