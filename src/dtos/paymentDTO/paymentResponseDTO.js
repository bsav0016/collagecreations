class PaymentResponseDTO {
    constructor(collage, id) {
        this.collage = collage
        this.id = id
    }

    static fromResponse(response) {
        return new PaymentResponseDTO(
            response.collage,
            response.id,
        );
    }
}

export default PaymentResponseDTO;