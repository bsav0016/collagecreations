import type { OrderType, Schema } from "../../api/types";

class ApplyDiscountDTO {
    discountCode: string;
    tempImageId: string;
    orderType: OrderType;

    constructor(discountCode: string, tempImageId: string, orderType: OrderType) {
        this.discountCode = discountCode;
        this.tempImageId = tempImageId;
        this.orderType = orderType;
    }

    jsonify(): string {
        const body: Schema<"ApplyDiscountRequest"> = {
            code: this.discountCode,
            temp_image_id: this.tempImageId,
            order_type: this.orderType,
        };
        return JSON.stringify(body);
    }
}

export default ApplyDiscountDTO;
