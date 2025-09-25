import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { sendTicketEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      )
    }

    // 1. Verify transaction with Paystack
    const verification = await verifyPaystackTransaction(reference)

    if (!verification.status) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      )
    }

    const { data: transaction } = verification
    const email = transaction.customer?.email

    if (!email) {
      return NextResponse.json(
        { error: "No customer email found in Paystack transaction" },
        { status: 400 }
      )
    }

    // 2. Find attendee by email
    const { data: attendee, error: attendeeError } = await supabaseAdmin
      .from("attendees")
      .select("*")
      .eq("email", email)
      .single()

    if (attendeeError || !attendee) {
      return NextResponse.json({ error: "Attendee record not found" }, { status: 404 })
    }

    // 3. Insert payment log (idempotent)
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
          amount: transaction.amount / 100, // kobo → naira
          status: transaction.status,
          paid_at: transaction.paid_at,
        },
      ])
    }

    // 4. Update attendee with ticket + paystack_ref
    const ticketId =
      attendee.ticket_id || `EVT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    await supabaseAdmin
      .from("attendees")
      .update({
        payment_status: "paid",
        ticket_id: ticketId,
        paystack_ref: reference,
      })
      .eq("id", attendee.id)

    // 5. Send ticket email
    await sendTicketEmail({
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      eventTitle: "District Vibez",
      eventDate: "Oct 11, 2025", // TODO: dynamic later
      eventLocation: "VSP Lounge, Ikeja", // TODO: dynamic later
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
        paystack_ref: reference,
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
