class GetTaxResponseDTO {
    constructor(tax) {
        this.tax = tax
    }

    static fromResponse(response) {
        return new GetTaxResponseDTO(
            response.tax
        );
    }
}

export default GetTaxResponseDTO;