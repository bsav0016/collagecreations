class ApplyDiscountResponseDTO {
    constructor(discount) {
        this.discount = discount
    }

    static fromResponse(response) {
        return new ApplyDiscountResponseDTO(
            response.discount
        );
    }
}

export default ApplyDiscountResponseDTO;