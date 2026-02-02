export interface TicketResponse {
    firstname: string;
    lastname: string;
    email: string;
    message: string;
    order_number: string | null;
    creation_date: string;
    in_progress: boolean;
    resolved: boolean;
    notes: string;
    is_custom_order: boolean;
}

class TicketDTO {
    firstname: string;
    lastname: string;
    email: string;
    message: string;
    orderNumber: string;
    creationDate: string;
    inProgress: boolean;
    resolved: boolean;
    notes: string;
    isCustomOrder: boolean;

    constructor(
        firstname: string,
        lastname: string,
        email: string,
        message: string,
        orderNumber: string,
        creationDate: string,
        inProgress: boolean,
        resolved: boolean,
        notes: string,
        isCustomOrder: boolean
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.message = message;
        this.orderNumber = orderNumber;
        this.creationDate = creationDate;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.notes = notes;
        this.isCustomOrder = isCustomOrder;
    }

    updateField(fieldName: keyof TicketDTO, value: string | boolean): void {
        (this as Record<keyof TicketDTO, unknown>)[fieldName] = value;
    }

    jsonified(): string {
        return JSON.stringify({
            in_progress: this.inProgress,
            resolved: this.resolved,
            notes: this.notes,
        });
    }

    static fromResponse(response: TicketResponse): TicketDTO {
        return new TicketDTO(
            response.firstname,
            response.lastname,
            response.email,
            response.message,
            response.order_number ? response.order_number : "N/A",
            new Date(response.creation_date).toLocaleDateString(),
            response.in_progress,
            response.resolved,
            response.notes,
            response.is_custom_order
        );
    }
}

export default TicketDTO;
