class GetShippingDTO {
    constructor(destinationZIPCode, quantity, tempImageId) {
        this.destinationZIPCode = destinationZIPCode
        this.quantity = quantity
        this.tempImageId = tempImageId

        const today = new Date();
        today.setDate(today.getDate() + 7);
        const mailingDate = today.toISOString().split('T')[0];
        this.mailingDate = mailingDate
    }

    jsonify() {
        return JSON.stringify({ 
            destinationZIPCode: this.destinationZIPCode,
            mailingDate: this.mailingDate,
            quantity: this.quantity,
            tempImageId: this.tempImageId 
        })
    }
}

export default GetShippingDTO;