class GetTaxDTO {
    tempImageId: string;

    constructor(tempImageId: string) {
        this.tempImageId = tempImageId;
    }

    jsonify(): string {
        return JSON.stringify({ tempImageId: this.tempImageId });
    }
}

export default GetTaxDTO;
