class SupportDTO {
    constructor(formData, isCustomOrder) {
        this.firstname = formData.firstname;
        this.lastname = formData.lastname;
        this.email = formData.email;
        this.order_number = formData.orderNumber;
        this.message = formData.message;
        this.isCustomOrder = isCustomOrder;
    }

    jsonified() {
        return JSON.stringify({
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            order_number: this.order_number,
            message: this.message,
            is_custom_order: this.isCustomOrder
        });
    }
}

export default SupportDTO;