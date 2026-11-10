import type { Schema } from "../../api/types";

class GetTaxDTO {
    tempImageId: string;

    constructor(tempImageId: string) {
        this.tempImageId = tempImageId;
    }

    jsonify(): string {
        const body: Schema<"GetTaxRequest"> = { tempImageId: this.tempImageId };
        return JSON.stringify(body);
    }
}

export default GetTaxDTO;
