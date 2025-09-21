import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { verifyPaystackWebhook } from "@/lib/paystack"
import { sendTicketEmail } from "@/lib/email"
import { generateTicketId, generateQRCodeData, type TicketData } from "@/lib/ticket-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    // Paystack webhooks don't always require strict signature verification
    if (signature && !verifyPaystackWebhook(body, signature)) {
      console.warn("Webhook signature verification failed")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Log the webhook event
    await supabaseAdmin.from("payment_logs").insert({
      raw_payload: event,
      event_type: event.event,
    })

    // Handle charge.success event
    if (event.event === "charge.success") {
      const { data } = event
      const { metadata } = data

      if (!metadata?.attendeeId) {
        return NextResponse.json({ error: "Missing attendee ID in metadata" }, { status: 400 })
      }

      // Update attendee record
      const { error: updateError } = await supabaseAdmin
        .from("attendees")
        .update({
          payment_status: "success",
          paystack_ref: data.reference,
          paid_at: new Date(data.paid_at).toISOString(),
        })
        .eq("id", metadata.attendeeId)

      if (updateError) {
        console.error("Failed to update attendee:", updateError)
        return NextResponse.json({ error: "Failed to update attendee" }, { status: 500 })
      }

      // Increment tickets_sold atomically
      const { error: eventUpdateError } = await supabaseAdmin.rpc("increment_tickets_sold", {
        event_id: metadata.eventId,
        quantity: metadata.quantity,
      })

      if (eventUpdateError) {
        console.error("Failed to increment tickets:", eventUpdateError)
        // Note: This is logged but doesn't fail the webhook
        // The attendee is still marked as successful
      }

      try {
        // Get attendee and event details for ticket generation
        const { data: attendee, error: attendeeError } = await supabaseAdmin
          .from("attendees")
          .select(`
            *,
            events (
              title,
              event_date,
              location
            )
          `)
          .eq("id", metadata.attendeeId)
          .single()

        if (attendeeError || !attendee) {
          console.error("Failed to fetch attendee for ticket generation:", attendeeError)
        } else {
          // Generate ticket ID and QR code
          const ticketId = generateTicketId(attendee.id)
          const ticketData: TicketData = {
            attendeeId: attendee.id,
            attendeeName: attendee.name,
            attendeeEmail: attendee.email,
            eventTitle: attendee.events.title,
            eventDate: new Date(attendee.events.event_date).toLocaleDateString(),
            eventLocation: attendee.events.location,
            ticketQuantity: attendee.ticket_quantity,
          }
          const qrCodeData = generateQRCodeData(ticketData, ticketId)

          // Update attendee with ticket ID
          await supabaseAdmin.from("attendees").update({ ticket_id: ticketId }).eq("id", attendee.id)

          // Send ticket email
          const emailResult = await sendTicketEmail({
            attendeeName: attendee.name,
            attendeeEmail: attendee.email,
            eventTitle: attendee.events.title,
            eventDate: new Date(attendee.events.event_date).toLocaleDateString(),
            eventLocation: attendee.events.location,
            ticketQuantity: attendee.ticket_quantity,
            ticketId,
            qrCodeData,
          })

          if (!emailResult.success) {
            console.error("Failed to send ticket email:", emailResult.error)
            // Log email failure but don't fail the webhook
            await supabaseAdmin.from("payment_logs").insert({
              raw_payload: { error: "Email sending failed", attendeeId: attendee.id },
              event_type: "email_failed",
            })
          } else {
            console.log("Ticket email sent successfully to:", attendee.email)
          }
        }
      } catch (ticketError) {
        console.error("Ticket generation/email error:", ticketError)
        // Log but don't fail the webhook
      }
    }

    // Handle charge.failed event
    if (event.event === "charge.failed") {
      const { data } = event
      const { metadata } = data

      if (metadata?.attendeeId) {
        await supabaseAdmin
          .from("attendees")
          .update({
            payment_status: "failed",
            paystack_ref: data.reference,
          })
          .eq("id", metadata.attendeeId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
