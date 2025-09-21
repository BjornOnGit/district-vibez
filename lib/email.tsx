import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface TicketEmailData {
  attendeeName: string
  attendeeEmail: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketQuantity: number
  ticketId: string
  qrCodeData: string
}

export async function sendTicketEmail(data: TicketEmailData) {
  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: "District Vibez <onboarding@resend.dev>",
      to: [data.attendeeEmail],
      subject: `Your tickets for ${data.eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your Tickets Are Ready!</h1>
          <p>Hi ${data.attendeeName},</p>
          <p>Thank you for purchasing tickets to <strong>${data.eventTitle}</strong>!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Event Details</h2>
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Location:</strong> ${data.eventLocation}</p>
            <p><strong>Tickets:</strong> ${data.ticketQuantity}</p>
            <p><strong>Ticket ID:</strong> ${data.ticketId}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrCodeData)}" alt="QR Code" />
            <p style="font-size: 12px; color: #666;">Show this QR code at the event entrance</p>
          </div>
          
          <p>We look forward to seeing you at the event!</p>
          <p>Best regards,<br>District Vibez Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      return { success: false, error }
    }

    return { success: true, data: emailResult }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error }
  }
}
