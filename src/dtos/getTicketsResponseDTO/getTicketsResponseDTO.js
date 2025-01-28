class GetTicketsResponseDTO {
    constructor(ticketData) {
        this.id = ticketData.id;
        this.isCustomOrder = ticketData.is_custom_order;
        this.inProgress = ticketData.in_progress;
        this.resolved = ticketData.resolved;
    }  
}
  
export default GetTicketsResponseDTO;