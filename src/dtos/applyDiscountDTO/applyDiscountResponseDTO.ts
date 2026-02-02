interface ApplyDiscountResponse {
    discount: number;
}

class ApplyDiscountResponseDTO {
    discount: number;

    constructor(discount: number) {
        this.discount = discount;
    }

    static fromResponse(response: ApplyDiscountResponse): ApplyDiscountResponseDTO {
        return new ApplyDiscountResponseDTO(response.discount);
    }
}

export default ApplyDiscountResponseDTO;
