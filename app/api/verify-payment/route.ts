import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { sendTicketEmail } from "@/lib/email" // <-- adjust import path if needed

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    // Verify transaction with Paystack
    const verification = await verifyPaystackTransaction(reference)

    if (!verification.status) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    const { data: transaction } = verification

    // Find attendee by reference
    const { data: attendee, error: attendeeError } = await supabaseAdmin
      .from("attendees")
      .select("*")
      .eq("paystack_ref", reference)
      .single()

    if (attendeeError || !attendee) {
      return NextResponse.json({ error: "Attendee record not found" }, { status: 404 })
    }

    // 1. Insert payment log (idempotent: check first)
    const { data: existingLog } = await supabaseAdmin
      .from("payment_logs")
      .select("*")
      .eq("reference", reference)
      .maybeSingle()

    if (!existingLog) {
      await supabaseAdmin.from("payment_logs").insert([
        {
          attendee_id: attendee.id,
          reference,
          amount: transaction.amount / 100, // convert kobo → naira
          status: transaction.status,
          paid_at: transaction.paid_at,
        },
      ])
    }

    // 2. Generate Ticket ID (only if not already set)
    const ticketId = attendee.ticket_id || `EVT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    if (!attendee.ticket_id) {
      await supabaseAdmin
        .from("attendees")
        .update({
          payment_status: "paid",
          ticket_id: ticketId,
        })
        .eq("id", attendee.id)
    }

    // 3. Send email (only if not sent before)
    await sendTicketEmail({
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      eventTitle: "District Vibez Block Party Vol.2",
      eventDate: "Dec 21, 2025", // TODO: dynamically fetch from DB if multiple events
      eventLocation: "Lagos, Nigeria", // TODO: fetch from DB
      ticketQuantity: attendee.ticket_quantity,
      ticketId,
      qrCodeData: ticketId,
    })

    return NextResponse.json({
      success: true,
      status: transaction.status,
      amount: transaction.amount,
      paid_at: transaction.paid_at,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        ticket_quantity: attendee.ticket_quantity,
        payment_status: "paid",
        ticket_id: ticketId,
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
