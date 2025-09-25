"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, ArrowLeft, Edit } from "lucide-react"

type TicketType = {
  id: string
  name: string
  price: number
}

type TicketCheckoutProps = {
  selectedTickets: Record<string, number>
  ticketTypes?: TicketType[] // <-- make optional for safety
  onUpdateTickets: (ticketId: string, quantity: number) => void
  onBack: () => void
  onCheckout: () => Promise<void>
}

export function TicketCheckout({
  selectedTickets,
  ticketTypes = [], // <-- default to empty array
  onUpdateTickets,
  onBack,
  onCheckout,
}: TicketCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  // ✅ safeguard subtotal reduce
  const subtotal = Object.entries(selectedTickets).reduce((acc, [ticketId, qty]) => {
    if (!ticketTypes?.length) return acc
    const ticket = ticketTypes.find((t) => t.id === ticketId)
    return ticket ? acc + ticket.price * qty : acc
  }, 0)

  const SERVICE_FEE = 200
  const total = subtotal + SERVICE_FEE

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      await onCheckout()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Ticket Details + Attendee Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets Selected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticketTypes?.length > 0 ? (
              Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                const ticket = ticketTypes.find((t) => t.id === ticketId)
                if (!ticket || quantity === 0) return null

                return (
                  <div key={ticketId} className="flex items-center justify-between">
                    <span className="font-medium">{ticket.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => onUpdateTickets(ticketId, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => onUpdateTickets(ticketId, quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 text-sm">No tickets loaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your phone number" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            {isLoading ? "Processing..." : "Checkout Now"}
          </Button>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              {ticketTypes?.length > 0 ? (
                Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  const ticket = ticketTypes.find((t) => t.id === ticketId)
                  if (!ticket || quantity === 0) return null

                  return (
                    <div key={ticketId} className="flex justify-between text-sm">
                      <span>
                        {ticket.name} × {quantity}
                      </span>
                      <span>{formatPrice(ticket.price * quantity)}</span>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-sm">No tickets in order.</p>
              )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>{formatPrice(SERVICE_FEE)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Return to cart
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" /> Edit attendee info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
