import type { Schema } from "../../api/types";

export type TicketData = Schema<"TicketSummary">;

class GetTicketsResponseDTO {
    id: number;
    isCustomOrder: boolean;
    inProgress: boolean;
    resolved: boolean;

    constructor(ticketData: TicketData) {
        this.id = ticketData.id;
        this.isCustomOrder = ticketData.is_custom_order;
        this.inProgress = ticketData.in_progress;
        this.resolved = ticketData.resolved;
    }
}

export default GetTicketsResponseDTO;
