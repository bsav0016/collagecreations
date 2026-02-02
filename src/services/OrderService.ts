import { OrderSummaryDTO, OrderSummaryData } from '../dtos/OrderDTO/OrderSummaryDTO';
import OrderDetailDTO, { OrderDetailResponse } from '../dtos/OrderDTO/OrderDetailDTO';
import OrderAddDTO from '../dtos/OrderDTO/OrderAddDTO';
import NetworkRequest from '../lib/networkClient';
import { GET, PUT, POST, AUTHORIZATION_HEADER, APPLICATION_JSON_HEADER } from '../lib/networkRequestConstants';

interface NewOrderResponse {
    order_id: string;
}

interface OrdersListResponse {
    orders: OrderSummaryData[];
}

const OrderService = {
    async fetchOrder(token: string | null, orderId: string): Promise<OrderDetailDTO> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
                ...APPLICATION_JSON_HEADER
            };
            
            const response = await NetworkRequest<OrderDetailResponse>({
                urlExtension: `api/orders/${orderId}/`,
                method: GET,
                headers: headers
            });

            const order = OrderDetailDTO.fromResponse(response);
            return order;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    async updateOrder(token: string | null, id: string, body: string): Promise<unknown> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
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

    async sendShipmentEmail(
        token: string | null, 
        id: string, 
        shippingNumber: string, 
        email: string
    ): Promise<void> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
                ...APPLICATION_JSON_HEADER
            };
            
            await NetworkRequest({
                urlExtension: 'api/send-shipment-email/',
                method: POST,
                headers: headers,
                body: JSON.stringify({ id, shippingNumber, email })
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    async getOrders(token: string | null): Promise<OrderSummaryDTO[]> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
            };

            const data = await NetworkRequest<OrdersListResponse>({
                urlExtension: 'api/get-all-orders/',
                method: GET,
                headers: headers
            });

            const orders: OrderSummaryDTO[] = [];
            for (const orderData of data.orders) {
                orders.push(OrderSummaryDTO.fromData(orderData));
            }

            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    async newOrder(
        orderAdd: OrderAddDTO, 
        selectedImage: File, 
        token: string
    ): Promise<NewOrderResponse> {
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

            return data as NewOrderResponse;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    },
};

export default OrderService;
