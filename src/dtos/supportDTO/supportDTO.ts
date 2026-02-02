interface SupportFormData {
    firstname: string;
    lastname: string;
    email: string;
    orderNumber: string;
    message: string;
}

class SupportDTO {
    firstname: string;
    lastname: string;
    email: string;
    order_number: string;
    message: string;
    isCustomOrder: boolean;

    constructor(formData: SupportFormData, isCustomOrder: boolean) {
        this.firstname = formData.firstname;
        this.lastname = formData.lastname;
        this.email = formData.email;
        this.order_number = formData.orderNumber;
        this.message = formData.message;
        this.isCustomOrder = isCustomOrder;
    }

    jsonified(): string {
        return JSON.stringify({
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            order_number: this.order_number,
            message: this.message,
            is_custom_order: this.isCustomOrder,
        });
    }
}

export default SupportDTO;
