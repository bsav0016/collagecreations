class GetShippingResponseDTO {
    constructor(baseCost, shippingCost, tax) {
        this.tax = tax
        this.baseCost = baseCost
        this.shippingCost = shippingCost
    }

    static fromResponse(response) {
        return new GetShippingResponseDTO(
            response.base_cost,
            response.shipping_cost,
            response.tax
        );
    }
}

export default GetShippingResponseDTO;