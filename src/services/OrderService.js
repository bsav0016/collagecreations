import NetworkRequest from '../lib/networkClient';
import { GET, PUT, POST, APPLICATION_JSON_HEADER, AUTHORIZATION_HEADER } from '../lib/networkRequestConstants';


const OrderService = {
    async fetchOrder(token, orderId) {
        try {
            const headers = {
                ...AUTHORIZATION_HEADER(token),
                ...APPLICATION_JSON_HEADER
            };
            
            const response = await NetworkRequest({
                urlExtension: `api/orders/${orderId}/`,
                method: GET,
                headers: headers
            });

            return response;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    async updateOrder(token, id, body) {
        try {
            const headers = {
                ...AUTHORIZATION_HEADER(token),
                ...APPLICATION_JSON_HEADER
            };
            
            const response = await NetworkRequest({
                urlExtension: `api/orders/${id}/`,
                method: PUT,
                headers: headers,
                body: body
            });

            return response;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    },

    async sendShipmentEmail(token, id, shippingNumber, email) {
        try {
            const headers = {
                ...AUTHORIZATION_HEADER(token),
                ...APPLICATION_JSON_HEADER
            };

            console.log("send shipped email");
            
            await NetworkRequest({
                urlExtension: 'api/send-shipment-email/',
                method: POST,
                headers: headers,
                body: JSON.stringify({ id, shippingNumber, email }) //TODO: Need to use DTO here
            });

            return;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    async getOrders(token) {
        try {
        const headers = {
            ...AUTHORIZATION_HEADER(token),
        };

        const data = await NetworkRequest({
            urlExtension: 'api/get-all-orders/',
            method: GET,
            headers: headers
        });

        //TODO: Should use OrderSummaryDTO here instead of having the entire orders
    
        return data.orders
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw(error);
        }
    },

    async newOrder(orderAdd, selectedImage, token) {
        try {
            const body = orderAdd.createBody(selectedImage);
            const headers = {
                ...AUTHORIZATION_HEADER(token)
            };
            const data = await NetworkRequest({
                urlExtension: 'api/orders/',
                method: POST,
                headers: headers,
                body: body
            });

            return data;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    },
}

export default OrderService;
