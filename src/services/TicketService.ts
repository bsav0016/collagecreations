import NetworkRequest from '../lib/networkClient';
import { GET, PATCH, POST, AUTHORIZATION_HEADER, APPLICATION_JSON_HEADER } from '../lib/networkRequestConstants';
import GetTicketsResponseDTO, { TicketData } from '../dtos/getTicketsResponseDTO/getTicketsResponseDTO';
import SupportDTO from '../dtos/supportDTO/supportDTO';
import TicketDTO, { TicketResponse } from '../dtos/TicketDTO/TicketDTO';

interface TicketFormData {
    firstname: string;
    lastname: string;
    email: string;
    orderNumber?: string;
    message: string;
}

interface TicketsListResponse {
    tickets: TicketData[];
}

const TicketService = {
    async getTicket(
        token: string | null, 
        ticketId: number, 
    ): Promise<TicketResponse> {
        const headers = {
            ...(token && AUTHORIZATION_HEADER(token)),
            ...APPLICATION_JSON_HEADER
        };

        const data = await NetworkRequest({
            urlExtension: `api/ticket/${ticketId}/`,
            method: GET,
            headers: headers
        });

        return data as TicketResponse;
    },

    async updateTicket(
        token: string | null, 
        ticketId: number, 
        ticketDTO: TicketDTO
    ): Promise<unknown> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
                ...APPLICATION_JSON_HEADER
            };

            const response = await NetworkRequest({
                urlExtension: `api/ticket/${ticketId}/`,
                method: PATCH,
                headers: headers,
                body: ticketDTO.jsonified(),
            });

            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTickets(token: string | null): Promise<GetTicketsResponseDTO[]> {
        try {
            const headers = {
                ...(token && AUTHORIZATION_HEADER(token)),
            };

            const data = await NetworkRequest<TicketsListResponse>({
                urlExtension: 'api/get-all-tickets/',
                method: GET,
                headers: headers
            });

            return data.tickets.map((ticket) => new GetTicketsResponseDTO(ticket));
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    },

    async submitTicket(formData: TicketFormData, isCustomOrder: boolean): Promise<void> {
        const supportFormData = {
            ...formData,
            orderNumber: formData.orderNumber ?? ''
        };
        const supportDTO = new SupportDTO(supportFormData, isCustomOrder);
        try {
            const headers = {
                ...APPLICATION_JSON_HEADER
            };

            await NetworkRequest({
                urlExtension: 'api/ticket/',
                method: POST,
                headers: headers,
                body: supportDTO.jsonified()
            });
        } catch (error) {
            throw new Error('An error occurred while sending your message. Please try again later.');
        }
    }
};

export default TicketService;
