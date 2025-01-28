class ApplyDiscountDTO {
    constructor(discountCode, tempImageId, orderType) {
        this.discountCode = discountCode
        this.tempImageId = tempImageId
        this.orderType = orderType
    }

    jsonify() {
        return JSON.stringify({ 
            code: this.discountCode,
            temp_image_id: this.tempImageId,
            order_type: this.orderType
        })
    }
}

export default ApplyDiscountDTO;