import type { Schema } from "../../api/types";

export type GetTaxResponse = Schema<"GetTaxResponse">;

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
