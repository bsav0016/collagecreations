import NetworkRequest from '../lib/networkClient';
import { GET, PATCH, POST, AUTHORIZATION_HEADER, APPLICATION_JSON_HEADER } from '../lib/networkRequestConstants';
import GetTicketsResponseDTO from '../dtos/getTicketsResponseDTO/getTicketsResponseDTO';
import SupportDTO from '../dtos/supportDTO/supportDTO';


const TicketService = {
  async getTicket(token, ticketId, isCustomOrder) {
    const headers = {
      ...AUTHORIZATION_HEADER(token),
      ...APPLICATION_JSON_HEADER
    };

    const data = await NetworkRequest({
      urlExtension: `api/ticket/${ticketId}/`,
      method: GET,
      headers: headers
    });

    return data
  },

  async updateTicket(token, ticketId, ticketDTO) {
    try {
      const headers = {
        ...AUTHORIZATION_HEADER(token),
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
      throw(error);
    }
  },

  async getTickets(token) {
    try {
      const headers = {
        ...AUTHORIZATION_HEADER(token),
      };
  
      const data = await NetworkRequest({
        urlExtension: 'api/get-all-tickets/',
        method: GET,
        headers: headers
      });
      
      return data.tickets.map(ticket => new GetTicketsResponseDTO(ticket));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw(error);
    }
  },

  async submitTicket(formData, isCustomOrder) {
    const supportDTO = new SupportDTO(formData, isCustomOrder);
    try {
      const headers = {
        ...APPLICATION_JSON_HEADER
      }

      await NetworkRequest({
        urlExtension: 'api/ticket/',
        method: POST,
        headers: headers,
        body: supportDTO.jsonified()
      });
    } catch (error) {
      throw(new Error('An error occurred while sending your message. Please try again later.'));
    }
  }
};

export default TicketService;
