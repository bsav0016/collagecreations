class GetTaxDTO {
    constructor(tempImageId) {
        this.tempImageId = tempImageId
    }

    jsonify () {
        return JSON.stringify({ tempImageId: this.tempImageId })
    }
}

export default GetTaxDTO;