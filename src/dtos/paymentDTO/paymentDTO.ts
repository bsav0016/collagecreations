import { PaymentMethod } from "@stripe/stripe-js";

class PaymentDTO {
    paymentMethod: PaymentMethod;
    tempImageId: number;
    type: string;
    firstname: string;
    lastname: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;

    constructor(
        paymentMethod: PaymentMethod,
        tempImageId: number,
        type: string,
        firstname: string,
        lastname: string,
        email: string,
        address1?: string,
        address2?: string,
        city?: string,
        state?: string,
        zip?: string
    ) {
        this.paymentMethod = paymentMethod;
        this.tempImageId = tempImageId;
        this.type = type;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.address1 = address1 ?? '';
        this.address2 = address2 ?? '';
        this.city = city ?? '';
        this.state = state ?? '';
        this.zip = zip ?? '';
    }

    jsonify(): string {
        return JSON.stringify({
            paymentMethod: this.paymentMethod,
            tempImageId: this.tempImageId,
            type: this.type,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            address1: this.address1,
            address2: this.address2,
            city: this.city,
            state: this.state,
            zip: this.zip,
        });
    }
}

export default PaymentDTO;
