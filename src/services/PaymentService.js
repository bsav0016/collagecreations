import { APPLICATION_JSON_HEADER, POST } from "../lib/networkRequestConstants";
import NetworkRequest from "../lib/networkClient";
import GetTaxDTO from "../dtos/getTaxDTO/getTaxDTO";
import GetTaxResponseDTO from "../dtos/getTaxDTO/getTaxResponseDTO";
import GetShippingDTO from '../dtos/getShippingDTO/getShippingDTO';
import GetShippingResponseDTO from '../dtos/getShippingDTO/getShippingResponseDTO';
import PaymentDTO from "../dtos/paymentDTO/paymentDTO";
import PaymentResponseDTO from "../dtos/paymentDTO/paymentResponseDTO";

const PaymentService = {
    async calculateTax(tempImageId) {
        const getTaxDTO = new GetTaxDTO(tempImageId)
        try {
          const headers = {
            ...APPLICATION_JSON_HEADER,
          };
    
          const data = await NetworkRequest({
            urlExtension: 'api/get-tax/',
            method: POST,
            headers: headers,
            body: getTaxDTO.jsonify(),
          });
          const taxData = GetTaxResponseDTO.fromResponse(data);
          return taxData;
        } catch {
          throw(new Error('Could not get tax'));
        }
    },

    async calculateShipping(formData, tempImageId, quantity) {
        const dto = new GetShippingDTO(formData.zipCode, quantity, tempImageId);
    
        try {
          const headers = {
            ...APPLICATION_JSON_HEADER,
          };
    
          const data = await NetworkRequest({
            urlExtension: 'api/get-shipping-cost/',
            method: POST,
            headers: headers,
            body: dto.jsonify()
          });
    
          const responseDTO = GetShippingResponseDTO.fromResponse(data);
          return responseDTO;
        } catch {
            throw(new Error('Could not get shipping cost'));
        }
    },

    async createPayment (
        paymentMethod,
        tempImageId,
        type,
        formData
    ) {
        const dto = new PaymentDTO(
            paymentMethod.id,
            tempImageId,
            type,
            formData.firstname,
            formData.lastname,
            formData.email,
            formData.address1,
            formData.address2,
            formData.city,
            formData.state,
            formData.zipCode
        )
      
        const headers = {
            ...APPLICATION_JSON_HEADER,
        };
      
        try {
            const data = await NetworkRequest({
                urlExtension: 'api/payment/',
                method: POST,
                headers: headers,
                body: dto.jsonify(),
            });
      
            const responseData = PaymentResponseDTO.fromResponse(data)
            return responseData;
        } catch (error) {
          console.log(error.message)
            throw(new Error(error));
        }
    }
}

export default PaymentService;