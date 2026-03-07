export interface GetTaxResponse {
    tax: number;
}

class GetTaxResponseDTO {
    tax: number;

    constructor(tax: number) {
        this.tax = tax;
    }

    static fromResponse(response: GetTaxResponse): GetTaxResponseDTO {
        return new GetTaxResponseDTO(response.tax);
    }
}

export default GetTaxResponseDTO;
