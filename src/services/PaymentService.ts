import { APPLICATION_JSON_HEADER, POST } from "../lib/networkRequestConstants";
import NetworkRequest from "../lib/networkClient";
import GetTaxDTO from "../dtos/getTaxDTO/getTaxDTO";
import GetTaxResponseDTO, { GetTaxResponse } from "../dtos/getTaxDTO/getTaxResponseDTO";
import GetShippingDTO from '../dtos/getShippingDTO/getShippingDTO';
import GetShippingResponseDTO, { GetShippingResponse } from '../dtos/getShippingDTO/getShippingResponseDTO';
import PaymentDTO from "../dtos/paymentDTO/paymentDTO";
import PaymentResponseDTO, { PaymentResponse } from "../dtos/paymentDTO/paymentResponseDTO";
import { PaymentMethod } from "@stripe/stripe-js";

interface FormData {
    firstname: string;
    lastname: string;
    email: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode: string;
}

const PaymentService = {
    async calculateTax(tempImageId: number): Promise<GetTaxResponseDTO> {
        const getTaxDTO = new GetTaxDTO(tempImageId);
        try {
            const headers = {
                ...APPLICATION_JSON_HEADER,
            };

            const data = await NetworkRequest<GetTaxResponse>({
                urlExtension: 'api/get-tax/',
                method: POST,
                headers: headers,
                body: getTaxDTO.jsonify(),
            });
            const taxData = GetTaxResponseDTO.fromResponse(data);
            return taxData;
        } catch {
            throw new Error('Could not get tax');
        }
    },

    async calculateShipping(
        formData: FormData, 
        tempImageId: number, 
        quantity: number
    ): Promise<GetShippingResponseDTO> {
        const dto = new GetShippingDTO(formData.zipCode, quantity, tempImageId);

        try {
            const headers = {
                ...APPLICATION_JSON_HEADER,
            };

            const data = await NetworkRequest<GetShippingResponse>({
                urlExtension: 'api/get-shipping-cost/',
                method: POST,
                headers: headers,
                body: dto.jsonify()
            });

            const responseDTO = GetShippingResponseDTO.fromResponse(data);
            return responseDTO;
        } catch {
            throw new Error('Could not get shipping cost');
        }
    },

    async createPayment(
        paymentMethod: PaymentMethod,
        tempImageId: number,
        type: string,
        formData: FormData
    ): Promise<PaymentResponseDTO> {
        const dto = new PaymentDTO(
            paymentMethod,
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
        );

        const headers = {
            ...APPLICATION_JSON_HEADER,
        };

        try {
            const data = await NetworkRequest<PaymentResponse>({
                urlExtension: 'api/payment/',
                method: POST,
                headers: headers,
                body: dto.jsonify(),
            });

            const responseData = PaymentResponseDTO.fromResponse(data);
            return responseData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            throw new Error(errorMessage);
        }
    }
};

export default PaymentService;
