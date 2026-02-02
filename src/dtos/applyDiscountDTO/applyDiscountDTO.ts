class ApplyDiscountDTO {
    discountCode: string;
    tempImageId: number;
    orderType: string;

    constructor(discountCode: string, tempImageId: number, orderType: string) {
        this.discountCode = discountCode;
        this.tempImageId = tempImageId;
        this.orderType = orderType;
    }

    jsonify(): string {
        return JSON.stringify({
            code: this.discountCode,
            temp_image_id: this.tempImageId,
            order_type: this.orderType,
        });
    }
}

export default ApplyDiscountDTO;
