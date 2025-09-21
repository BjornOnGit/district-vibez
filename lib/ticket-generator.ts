export interface TicketData {
  attendeeId: string
  attendeeName: string
  attendeeEmail: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketQuantity: number
}

export function generateTicketId(attendeeId: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `DV-${attendeeId.substring(0, 8)}-${timestamp}-${random}`.toUpperCase()
}

export function generateQRCodeData(ticketData: TicketData, ticketId: string): string {
  return JSON.stringify({
    ticketId,
    attendeeId: ticketData.attendeeId,
    eventTitle: ticketData.eventTitle,
    attendeeName: ticketData.attendeeName,
    quantity: ticketData.ticketQuantity,
    timestamp: new Date().toISOString(),
  })
}
