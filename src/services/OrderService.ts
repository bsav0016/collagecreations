import { OrderSummaryDTO } from '../dtos/OrderDTO/OrderSummaryDTO';
import OrderDetailDTO, { OrderDetailResponse } from '../dtos/OrderDTO/OrderDetailDTO';
import OrderAddDTO from '../dtos/OrderDTO/OrderAddDTO';
import type { Schema } from '../api/types';
import NetworkRequest from '../lib/networkClient';
import { GET, PUT, POST, AUTHORIZATION_HEADER, APPLICATION_JSON_HEADER } from '../lib/networkRequestConstants';

// Shapes come from the backend's schema (see src/api/types.ts).
type NewOrderResponse = Schema<'OrderCreated'>;
type OrdersListResponse = Schema<'OrderSummaries'>;

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

            const order = OrderDetailDTO.fromResponse(response.data);
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

            return response.data;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    },

    /** Refund an order through Stripe. Leave the amount out to refund everything that is left. Resolves to the new total refunded, in cents. */
    async refundOrder(token: string | null, id: string, amountCents?: number): Promise<number> {
        const headers = {
            ...(token && AUTHORIZATION_HEADER(token)),
            ...APPLICATION_JSON_HEADER
        };
        const refundBody: Schema<'RefundRequest'> = amountCents === undefined ? {} : { amount_cents: amountCents };
        const response = await NetworkRequest<Schema<'OrderRefunded'>>({
            urlExtension: `api/admin/orders/${id}/refund/`,
            method: POST,
            headers: headers,
            body: JSON.stringify(refundBody)
        });
        return response.data.refund_amount;
    },

    /** Ask the server to email the shipping notice again (it sends it itself the first time). */
    async resendShipmentEmail(token: string | null, id: string): Promise<void> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
                ...APPLICATION_JSON_HEADER
            };
            
            const resendBody: Schema<'SendShipmentEmailRequest'> = { id: Number(id), resend: true };
            await NetworkRequest({
                urlExtension: 'api/send-shipment-email/',
                method: POST,
                headers: headers,
                body: JSON.stringify(resendBody)
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

            const response = await NetworkRequest<OrdersListResponse>({
                urlExtension: 'api/get-all-orders/',
                method: GET,
                headers: headers
            });

            const orders: OrderSummaryDTO[] = [];
            for (const orderData of response.data.orders) {
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
            const response = await NetworkRequest<NewOrderResponse>({
                urlExtension: 'api/orders/',
                method: POST,
                headers: headers,
                body: body
            });

            return response.data;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    },
};

export default OrderService;
