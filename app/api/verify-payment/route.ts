import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { verifyPaystackTransaction } from "@/lib/paystack"

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

    return NextResponse.json({
      status: transaction.status,
      amount: transaction.amount,
      paid_at: transaction.paid_at,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        ticket_quantity: attendee.ticket_quantity,
        payment_status: attendee.payment_status,
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
