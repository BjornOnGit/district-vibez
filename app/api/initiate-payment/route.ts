import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { initializePaystack } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const { selectedTickets, attendees, subtotal, serviceFee, total, eventId } = await request.json() as {
      selectedTickets: Record<string, number>,
      attendees: Array<{ name: string, email: string, phone?: string }>,
      subtotal: number,
      serviceFee: number,
      total: number,
      eventId?: string
    }

    if (!attendees || attendees.length === 0 || !selectedTickets) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use the first attendee’s details for Paystack (Paystack requires one email)
    const { name, email } = attendees[0]
    const phone = attendees[0].phone || "0000000000"

    // Calculate total quantity from selectedTickets
    const quantity = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)

    if (quantity < 1) {
      return NextResponse.json({ error: "Invalid ticket quantity" }, { status: 400 })
    }

    // Optional: verify event if eventId is provided
    let event = null
    if (eventId) {
      const { data, error } = await supabaseAdmin
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      event = data

      if (event.tickets_sold + quantity > event.total_tickets) {
        return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 })
      }
    }

    const amount = total // already includes service fee, in kobo

    // Save attendees to DB
    const { data: attendeeRecords, error: attendeeError } = await supabaseAdmin
      .from("attendees")
      .insert(
        attendees.map((att) => ({
          event_id: eventId || null,
          name: att.name,
          email: att.email,
          phone: att.phone || null,
          ticket_quantity: 1,
          amount_paid: subtotal / attendees.length, // distribute subtotal per attendee
          payment_status: "pending",
        }))
      )
      .select()

    if (attendeeError || !attendeeRecords) {
      return NextResponse.json({ error: "Failed to create attendee records" }, { status: 500 })
    }

    // Initialize Paystack transaction
   // Inside your call
    const paystackResponse = await initializePaystack({
      email,
      amount,
      metadata: JSON.stringify({
        attendeeIds: attendeeRecords.map((a) => a.id),
        eventId,
        selectedTickets,
      }),
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/payment/verify`,
    })


    if (!paystackResponse.status) {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    return NextResponse.json({
      authorization_url: paystackResponse.data.authorization_url,
      reference: paystackResponse.data.reference,
      attendees: attendeeRecords,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
