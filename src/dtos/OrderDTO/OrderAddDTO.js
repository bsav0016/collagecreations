class OrderAddDTO {
    constructor(
        firstname = '',
        lastname = '',
        email = '',
        address1 = '',
        address2 = '',
        city = '',
        state = '',
        zip = '',
        image = null,
        isOrder = false,
        quantity = 1,
        baseCost = '',
        tax = '',
        shippingCost = ''
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zipCode = zip;
        this.image = image;
        this.isOrder = isOrder;
        this.quantity = quantity;
        this.baseCost = baseCost;
        this.tax = tax;
        this.shippingCost = shippingCost;
    }

    updateField(fieldName, value) {
        this[fieldName] = value;
    }
  
    createBody(imageData) {
        const formData = new FormData();
        formData.append('image', imageData);
        formData.append('firstname', this.firstname);
        formData.append('lastname', this.lastname);
        formData.append('email', this.email);
        formData.append('order_type', this.isOrder ? 'order' : 'download');
        formData.append('quantity', this.quantity);
        formData.append('base_cost', this.baseCost);
        formData.append('tax', this.tax);
        formData.append('shipping_cost', this.shippingCost);
        if (this.isOrder) {
            formData.append('address1', this.address1);
            if (this.address2 !== '') {
                formData.append('address2', this.address2);
            }
            formData.append('city', this.city);
            formData.append('state', this.state);
            formData.append('zip', this.zipCode);
            formData.append('order_date', new Date().toISOString());
        }

        return formData;
    }
}

export default OrderAddDTO;
  