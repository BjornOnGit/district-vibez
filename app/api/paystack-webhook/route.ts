import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { verifyPaystackWebhook } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    if (!verifyPaystackWebhook(body, signature)) {
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
