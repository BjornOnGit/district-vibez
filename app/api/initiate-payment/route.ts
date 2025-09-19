import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { initializePaystack } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, quantity, eventId } = await request.json()

    // Validate input
    if (!name || !email || !phone || !quantity || !eventId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: "Invalid ticket quantity" }, { status: 400 })
    }

    // Get event details
    const { data: event, error: eventError } = await supabaseAdmin.from("events").select("*").eq("id", eventId).single()

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check ticket availability
    if (event.tickets_sold + quantity > event.total_tickets) {
      return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 })
    }

    const amount = quantity * event.ticket_price

    // Create pending attendee record
    const { data: attendee, error: attendeeError } = await supabaseAdmin
      .from("attendees")
      .insert({
        event_id: eventId,
        name,
        email,
        phone,
        ticket_quantity: quantity,
        amount_paid: amount,
        payment_status: "pending",
      })
      .select()
      .single()

    if (attendeeError || !attendee) {
      return NextResponse.json({ error: "Failed to create attendee record" }, { status: 500 })
    }

    // Initialize Paystack transaction
    const paystackResponse = await initializePaystack({
      email,
      amount,
      metadata: {
        attendeeId: attendee.id,
        eventId,
        quantity,
      },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}?payment=success`,
    })

    if (!paystackResponse.status) {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    return NextResponse.json({
      authorization_url: paystackResponse.data.authorization_url,
      reference: paystackResponse.data.reference,
      attendeeId: attendee.id,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
