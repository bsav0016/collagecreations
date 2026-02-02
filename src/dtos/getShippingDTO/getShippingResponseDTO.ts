export interface GetShippingResponse {
    base_cost: number;
    shipping_cost: number;
    tax: number;
}

class GetShippingResponseDTO {
    baseCost: number;
    shippingCost: number;
    tax: number;

    constructor(baseCost: number, shippingCost: number, tax: number) {
        this.baseCost = baseCost;
        this.shippingCost = shippingCost;
        this.tax = tax;
    }

    static fromResponse(response: GetShippingResponse): GetShippingResponseDTO {
        return new GetShippingResponseDTO(
            response.base_cost,
            response.shipping_cost,
            response.tax
        );
    }
}

export default GetShippingResponseDTO;
