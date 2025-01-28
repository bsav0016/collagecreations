class TicketDTO {
  constructor(
    firstname, 
    lastname, 
    email, 
    message, 
    orderNumber, 
    creationDate, 
    inProgress,
    resolved, 
    notes,
    isCustomOrder
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

  updateField(fieldName, value) {
    this[fieldName] = value;
  }

  jsonified() {
    return JSON.stringify({
      in_progress: this.inProgress,
      resolved: this.resolved,
      notes: this.notes,
    });
  }

  static fromResponse(response) {
    return new TicketDTO(
      response.firstname,
      response.lastname,
      response.email,
      response.message,
      response.order_number ? response.order_number : 'N/A',
      new Date(response.creation_date).toLocaleDateString(),
      response.in_progress,
      response.resolved,
      response.notes,
      response.is_custom_order
    )
  }
}

export default TicketDTO;
