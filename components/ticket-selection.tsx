"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Calendar } from "lucide-react"

interface TicketType {
  id: string
  name: string
  description: string
  price: number
}

interface TicketSelectionProps {
  onGetTickets: (selectedTickets: { [key: string]: number }) => void
}

const ticketTypes: TicketType[] = [
  {
    id: "regular",
    name: "Regular",
    description: "General Access",
    price: 500000, // 5,000.00 in kobo
  },
]

export function TicketSelection({ onGetTickets }: TicketSelectionProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

  const updateQuantity = (ticketId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + change),
    }))
  }

  const formatPrice = (price: number) => {
    return `₦ ${(price / 100).toLocaleString()}.00`
  }

  const hasSelectedTickets = Object.values(quantities).some((qty) => qty > 0)

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Add to Calendar Button */}
      {/* <div className="mb-6">
        <Button variant="outline" className="border-yellow-400 text-black hover:bg-yellow-50 bg-transparent">
          <Calendar className="w-4 h-4 mr-2" />
          Add to calendar
        </Button>
      </div> */}

      {/* Tickets Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Tickets</h2>

          <div className="space-y-6">
            {ticketTypes.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{ticket.name}</h3>
                  <p className="text-gray-600">{ticket.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">{formatPrice(ticket.price)}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updateQuantity(ticket.id, -1)}
                      disabled={(quantities[ticket.id] || 0) === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="w-8 text-center font-semibold">{quantities[ticket.id] || 0}</span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => updateQuantity(ticket.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg"
              onClick={() => onGetTickets(quantities)}
              disabled={!hasSelectedTickets}
            >
              Get Tickets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reservation Note */}
      <div className="max-w-2xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-gray-800 font-medium">
          For table reservations (4 or 6 people), please call{" "}
          <span className="font-bold text-black">+2347037435892, +2349030771023, +2348175276395</span>.
        </p>
      </div>
    </div>
  )
}
