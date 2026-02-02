class GetShippingDTO {
    destinationZIPCode: string;
    quantity: number;
    tempImageId: number;
    mailingDate: string;

    constructor(destinationZIPCode: string, quantity: number, tempImageId: number) {
        this.destinationZIPCode = destinationZIPCode;
        this.quantity = quantity;
        this.tempImageId = tempImageId;

        const today = new Date();
        today.setDate(today.getDate() + 7);
        this.mailingDate = today.toISOString().split("T")[0];
    }

    jsonify(): string {
        return JSON.stringify({
            destinationZIPCode: this.destinationZIPCode,
            mailingDate: this.mailingDate,
            quantity: this.quantity,
            tempImageId: this.tempImageId,
        });
    }
}

export default GetShippingDTO;
