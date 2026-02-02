export interface PaymentResponse {
    collage: string;
    id: number;
}

class PaymentResponseDTO {
    collage: string;
    id: number;

    constructor(collage: string, id: number) {
        this.collage = collage;
        this.id = id;
    }

    static fromResponse(response: PaymentResponse): PaymentResponseDTO {
        return new PaymentResponseDTO(response.collage, response.id);
    }
}

export default PaymentResponseDTO;
