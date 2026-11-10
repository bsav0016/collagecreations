import type { Schema } from "../../api/types";

type ApplyDiscountResponse = Schema<"ApplyDiscountResponse">;

class ApplyDiscountResponseDTO {
    discount: number;

    constructor(discount: number) {
        this.discount = discount;
    }

    static fromResponse(response: ApplyDiscountResponse): ApplyDiscountResponseDTO {
        return new ApplyDiscountResponseDTO(response.discount);
    }
}

export default ApplyDiscountResponseDTO;
