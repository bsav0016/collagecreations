class GetTaxDTO {
    tempImageId: number;

    constructor(tempImageId: number) {
        this.tempImageId = tempImageId;
    }

    jsonify(): string {
        return JSON.stringify({ tempImageId: this.tempImageId });
    }
}

export default GetTaxDTO;
