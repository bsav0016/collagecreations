import type { Schema } from "../../api/types";

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
        const body: Schema<"SupportTicketRequest"> = {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            order_number: this.order_number,
            message: this.message,
            is_custom_order: this.isCustomOrder,
        };
        return JSON.stringify(body);
    }
}

export default SupportDTO;
