class OrderDetailDTO {
    constructor(
        firstname,
        lastname,
        email,
        address1,
        address2,
        city,
        state,
        zip,
        orderDate,
        printed,
        printDate,
        shipped,
        shipDate,
        shippingNumber,
        delivered,
        deliveryDate,
        image,
        orderType,
        quantity,
        baseCost,
        shippingCost,
        tax
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
    }

    updateField(fieldName, value) {
        this[fieldName] = value;
    }
  
    jsonify() {
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

    static fromResponse(response) {
        return new OrderDetailDTO(
            response.firstname,
            response.lastname,
            response.email,
            response.address1,
            response.address2,
            response.city,
            response.state,
            response.zip,
            new Date(response.order_date).toLocaleDateString(),
            response.printed,
            new Date(response.print_date).toLocaleDateString(),
            response.shipped,
            new Date(response.ship_date).toLocaleDateString(),
            response.shipping_number,
            response.delivered,
            new Date(response.delivery_date).toLocaleDateString(),
            response.image,
            response.order_type,
            response.quantity,
            response.base_cost,
            response.shipping_cost,
            response.tax
        )
    }
}

export default OrderDetailDTO;
  