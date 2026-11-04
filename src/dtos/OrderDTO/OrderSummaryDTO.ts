export interface OrderSummaryData {
    id: number;
    order_type: string;
    printed: boolean;
    shipped: boolean;
    delivered: boolean;
    status?: string;
}

export class OrderSummaryDTO {
    id: number;
    orderType: string;
    printed: boolean;
    shipped: boolean;
    delivered: boolean;
    status?: string;

    constructor({ id, order_type, printed, shipped, delivered, status }: OrderSummaryData) {
        this.id = id;
        this.orderType = order_type;
        this.printed = printed;
        this.shipped = shipped;
        this.delivered = delivered;
        this.status = status;
    }

    static fromData(data: OrderSummaryData): OrderSummaryDTO {
        return new OrderSummaryDTO(data);
    }
}
