class OrderAddDTO {
    firstname: string;
    lastname: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    image: File | null;
    isOrder: boolean;
    quantity: number;
    baseCost: string;
    tax: string;
    shippingCost: string;

    constructor(
        firstname: string = "",
        lastname: string = "",
        email: string = "",
        address1: string = "",
        address2: string = "",
        city: string = "",
        state: string = "",
        zip: string = "",
        image: File | null = null,
        isOrder: boolean = false,
        quantity: number = 1,
        baseCost: string = "",
        tax: string = "",
        shippingCost: string = ""
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

    updateField(fieldName: keyof OrderAddDTO, value: string | number | boolean | File | null): void {
        (this as Record<keyof OrderAddDTO, unknown>)[fieldName] = value;
    }

    createBody(imageData: Blob): FormData {
        const formData = new FormData();
        formData.append("image", imageData);
        formData.append("firstname", this.firstname);
        formData.append("lastname", this.lastname);
        formData.append("email", this.email);
        formData.append("order_type", this.isOrder ? "order" : "download");
        formData.append("quantity", String(this.quantity));
        formData.append("base_cost", this.baseCost);
        formData.append("tax", this.tax);
        formData.append("shipping_cost", this.shippingCost);
        if (this.isOrder) {
            formData.append("address1", this.address1);
            if (this.address2 !== "") {
                formData.append("address2", this.address2);
            }
            formData.append("city", this.city);
            formData.append("state", this.state);
            formData.append("zip", this.zipCode);
            formData.append("order_date", new Date().toISOString());
        }

        return formData;
    }
}

export default OrderAddDTO;
