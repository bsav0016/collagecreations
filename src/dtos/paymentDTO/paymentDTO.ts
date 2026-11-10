import { PaymentMethod } from "@stripe/stripe-js";
import type { OrderType, Schema } from "../../api/types";

class PaymentDTO {
    paymentMethod: PaymentMethod | null;
    paymentIntentId: string | null;
    tempImageId: string;
    type: OrderType;
    firstname: string;
    lastname: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;

    constructor(
        paymentMethod: PaymentMethod | null,
        tempImageId: string,
        type: OrderType,
        firstname: string,
        lastname: string,
        email: string,
        address1?: string,
        address2?: string,
        city?: string,
        state?: string,
        zip?: string,
        paymentIntentId: string | null = null
    ) {
        this.paymentMethod = paymentMethod;
        this.paymentIntentId = paymentIntentId;
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
        const body: Schema<"PaymentRequest"> = {
            paymentMethod: this.paymentMethod?.id ?? null,
            paymentIntentId: this.paymentIntentId,
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
        };
        return JSON.stringify(body);
    }
}

export default PaymentDTO;
