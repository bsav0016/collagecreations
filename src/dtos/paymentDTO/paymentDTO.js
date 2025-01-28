class PaymentDTO {
    constructor(
        paymentMethod,
        tempImageId,
        type,
        firstname,
        lastname,
        email,
        address1,
        address2,
        city,
        state,
        zip
    ) {
        this.paymentMethod = paymentMethod
        this.tempImageId = tempImageId
        this.type = type
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.address1 = address1
        this.address2 = address2
        this.city = city
        this.state = state
        this.zip = zip
    }

    jsonify () {
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
            zip: this.zip
        })
    }
}

export default PaymentDTO;