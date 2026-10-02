export class NewCollageResponseDTO {
    temporaryImageId: string;
    watermarkCollage: string;
    baseCost: number;
    requiresSignin: boolean;
    expiresAt: string;

    constructor(
        temporaryImageId: string, 
        watermarkCollage: string, 
        baseCost: number,
        requiresSignin: boolean = false,
        expiresAt: string = ""
    ) {
        this.temporaryImageId = temporaryImageId;
        this.watermarkCollage = watermarkCollage;
        this.baseCost = baseCost;
        this.requiresSignin = requiresSignin;
        this.expiresAt = expiresAt;
    }

    static fromResponse(response: any) {
        return new NewCollageResponseDTO(
            response.temporary_image_id,
            response.watermark_collage,
            response.base_cost,
            response.requires_signin === true,
            response.expires_at ?? ""
        );
    }
}