export interface PaymentResponse {
    token: string | null;
    id: number;
}

class PaymentResponseDTO {
    token: string | null;
    id: number;

    constructor(token: string | null, id: number) {
        this.token = token;
        this.id = id;
    }

    static fromResponse(response: PaymentResponse): PaymentResponseDTO {
        return new PaymentResponseDTO(response.token, response.id);
    }
}

export default PaymentResponseDTO;
