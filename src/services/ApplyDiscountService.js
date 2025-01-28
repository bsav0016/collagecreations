import { APPLICATION_JSON_HEADER, POST } from "../lib/networkRequestConstants";
import NetworkRequest from "../lib/networkClient";
import ApplyDiscountDTO from "../dtos/applyDiscountDTO/applyDiscountDTO";
import ApplyDiscountResponseDTO from "../dtos/applyDiscountDTO/applyDiscountResponseDTO";

const applyDiscountService = async (discountCode, tempImageId, orderType) => {
    const headers = {
        ...APPLICATION_JSON_HEADER
    }
    
    const applyDiscountDTO = new ApplyDiscountDTO(discountCode, tempImageId, orderType);

    try {
        const data = await NetworkRequest({
            urlExtension: 'api/apply-discount/',
            method: POST,
            headers: headers,
            body: applyDiscountDTO.jsonify()
        });

        const applyDiscountResponseDTO = ApplyDiscountResponseDTO.fromResponse(data);
        const discount = applyDiscountResponseDTO.discount;
        return discount;
    } catch (error) {
        throw(error);
    }
}

export default applyDiscountService;