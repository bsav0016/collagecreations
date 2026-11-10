import type { Schema } from "../../api/types";

// The server sends money as decimal strings ("8000.00") in cents; the DTO holds numbers.
export type OrderDetailResponse = Schema<"Order">;

class OrderDetailDTO {
    firstname: string;
    lastname: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    orderDate: string;
    printed: boolean;
    printDate: string;
    shipped: boolean;
    shipDate: string;
    shippingNumber: string;
    delivered: boolean;
    deliveryDate: string;
    image: string;
    orderType: string;
    quantity: number;
    baseCost: number;
    shippingCost: number;
    tax: number;
    /** Total refunded so far, in cents. */
    refundAmount: number;
    disputed: boolean;
    /** Paid through Stripe, so it can be refunded from the app. */
    hasStripePayment: boolean;

    constructor(
        firstname: string,
        lastname: string,
        email: string,
        address1: string,
        address2: string,
        city: string,
        state: string,
        zip: string,
        orderDate: string,
        printed: boolean,
        printDate: string,
        shipped: boolean,
        shipDate: string,
        shippingNumber: string,
        delivered: boolean,
        deliveryDate: string,
        image: string,
        orderType: string,
        quantity: number,
        baseCost: number,
        shippingCost: number,
        tax: number,
        refundAmount: number = 0,
        disputed: boolean = false,
        hasStripePayment: boolean = false
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zipCode = zip;
        this.orderDate = orderDate;
        this.printed = printed;
        this.printDate = printDate;
        this.shipped = shipped;
        this.shipDate = shipDate;
        this.shippingNumber = shippingNumber;
        this.delivered = delivered;
        this.deliveryDate = deliveryDate;
        this.image = image;
        this.orderType = orderType;
        this.quantity = quantity;
        this.baseCost = baseCost;
        this.shippingCost = shippingCost;
        this.tax = tax;
        this.refundAmount = refundAmount;
        this.disputed = disputed;
        this.hasStripePayment = hasStripePayment;
    }

    updateField(fieldName: keyof OrderDetailDTO, value: string | number | boolean): void {
        (this as Record<keyof OrderDetailDTO, unknown>)[fieldName] = value;
    }

    jsonify(): string {
        return JSON.stringify({
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            address1: this.address1,
            address2: this.address2,
            city: this.city,
            state: this.state,
            zip: this.zipCode,
            order_date: new Date(this.orderDate).toISOString(),
            printed: this.printed,
            print_date: new Date(this.printDate).toISOString(),
            shipped: this.shipped,
            ship_date: new Date(this.shipDate).toISOString(),
            shipping_number: this.shippingNumber,
            delivered: this.delivered,
            delivery_date: new Date(this.deliveryDate).toISOString(),
        });
    }

    // The Order shape marks most fields optional because the server does not require them when an order is
    // written; a stored order always has them, so the fallbacks below are never used in practice.
    static fromResponse(response: OrderDetailResponse): OrderDetailDTO {
        const day = (value?: string) => new Date(value ?? "").toLocaleDateString();
        return new OrderDetailDTO(
            response.firstname,
            response.lastname,
            response.email,
            response.address1 ?? "",
            response.address2 ?? "",
            response.city ?? "",
            response.state ?? "",
            response.zip ?? "",
            day(response.order_date),
            response.printed ?? false,
            day(response.print_date),
            response.shipped ?? false,
            day(response.ship_date),
            response.shipping_number ?? "",
            response.delivered ?? false,
            day(response.delivery_date),
            response.image ?? "",
            response.order_type ?? "",
            response.quantity ?? 0,
            Number(response.base_cost ?? 0),
            Number(response.shipping_cost ?? 0),
            Number(response.tax ?? 0),
            response.refund_amount,
            response.disputed,
            Boolean(response.stripe_payment_intent)
        );
    }
}

export default OrderDetailDTO;
