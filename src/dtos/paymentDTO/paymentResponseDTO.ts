export interface PaymentResponse {
    token?: string | null;
    id?: number;
    requires_action?: boolean;
    client_secret?: string;
}

class PaymentResponseDTO {
    token: string | null;
    id: number;
    requiresAction: boolean;
    clientSecret: string | null;

    constructor(token: string | null, id: number, requiresAction = false, clientSecret: string | null = null) {
        this.token = token;
        this.id = id;
        this.requiresAction = requiresAction;
        this.clientSecret = clientSecret;
    }

    static fromResponse(response: PaymentResponse): PaymentResponseDTO {
        return new PaymentResponseDTO(
            response.token ?? null,
            response.id ?? 0,
            Boolean(response.requires_action),
            response.client_secret ?? null
        );
    }
}

export default PaymentResponseDTO;
