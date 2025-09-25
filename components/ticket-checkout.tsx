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

const ticketTypes: TicketType[] = [
  { id: "regular", name: "Regular", price: 500000 },
]

type TicketCheckoutProps = {
  selectedTickets: Record<string, number>
  onUpdateTickets: (ticketId: string, quantity: number) => void
  onBack: () => void
  onCheckout: () => Promise<void>
}

export function TicketCheckout({
  selectedTickets,
  onUpdateTickets,
  onBack,
  onCheckout,
}: TicketCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = Object.entries(selectedTickets).reduce((acc, [ticketId, qty]) => {
    const ticket = ticketTypes.find((t) => t.id === ticketId)
    return ticket ? acc + ticket.price * qty : acc
  }, 0)

  const SERVICE_FEE = 39500
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
      {/* Tickets Selected */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets Selected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
              const ticket = ticketTypes.find((t) => t.id === ticketId)
              if (!ticket || quantity === 0) return null

              return (
                <div key={ticketId} className="flex items-center justify-between">
                  <span className="font-medium">{ticket.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateTickets(ticketId, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateTickets(ticketId, quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Attendee Info (unchanged) */}
        {/* ... */}

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

      {/* Order Summary */}
      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                const ticket = ticketTypes.find((t) => t.id === ticketId)
                if (!ticket || quantity === 0) return null

                return (
                  <div key={ticketId} className="flex justify-between text-sm">
                    <span>{ticket.name} × {quantity}</span>
                    <span>{formatPrice(ticket.price * quantity)}</span>
                  </div>
                )
              })}
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
