export class OrderSummaryDTO {
    constructor({ id, order_type, printed, shipped, delivered }) {
        this.id = id;
        this.orderType = order_type;
        this.printed = printed;
        this.shipped = shipped;
        this.delivered = delivered;
    }

    static fromData(data) {
        return new OrderSummaryDTO(
            data.id,
            data.order_type,
            data.printed,
            data.shipped,
            data.delivered
        );
    }
}