"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, X, Edit, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TicketType {
  id: string
  name: string
  price: number
}

interface AttendeeInfo {
  name: string
  email: string
}

interface TicketCheckoutProps {
  selectedTickets: { [key: string]: number }
  onBack: () => void
  onClose: () => void
  onUpdateTickets: (ticketId: string, quantity: number) => void
}

const ticketTypes: TicketType[] = [
  {
    id: "rockstar-earlybird",
    name: "Rockstar - Earlybird",
    price: 750000,
  },
  {
    id: "legend-earlybird",
    name: "Legend - Earlybird",
    price: 2500000,
  },
]

const SERVICE_FEE = 49500 // 495.00 in kobo

export function TicketCheckout({ selectedTickets, onBack, onClose }: TicketCheckoutProps) {
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Calculate totals
  const subtotal = Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
    const ticket = ticketTypes.find((t) => t.id === ticketId)
    return total + (ticket ? ticket.price * quantity : 0)
  }, 0)

  const totalQuantity = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  const total = subtotal + SERVICE_FEE

  // Initialize attendees array
  useState(() => {
    const initialAttendees: AttendeeInfo[] = []
    for (let i = 0; i < totalQuantity; i++) {
      initialAttendees.push({ name: "", email: "" })
    }
    setAttendees(initialAttendees)
  })

  const updateAttendee = (index: number, field: keyof AttendeeInfo, value: string) => {
    setAttendees((prev) => prev.map((attendee, i) => (i === index ? { ...attendee, [field]: value } : attendee)))
  }

  const removeAttendee = (index: number) => {
    setAttendees((prev) => prev.filter((_, i) => i !== index))
  }

  const formatPrice = (price: number) => {
    return `₦ ${(price / 100).toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const getSelectedTicketName = () => {
    const firstTicketId = Object.keys(selectedTickets).find((id) => selectedTickets[id] > 0)
    const ticket = ticketTypes.find((t) => t.id === firstTicketId)
    return ticket?.name || "Ticket"
  }

  const handleCheckout = async () => {
    // Validate all attendees have required info
    const invalidAttendees = attendees.some((attendee) => !attendee.name.trim() || !attendee.email.trim())

    if (invalidAttendees) {
      toast({
        title: "Missing Information",
        description: "Please fill in all attendee details",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedTickets,
          attendees,
          subtotal,
          serviceFee: SERVICE_FEE,
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment")
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function onUpdateTickets(firstTicketId: string | undefined, quantity: number) {
    if (!firstTicketId) return
    // Call the prop function to update ticket quantity
    // Clamp quantity to minimum 0
    const newQuantity = Math.max(0, quantity)
    // Call the parent handler
    if (typeof (TicketCheckout as any).props?.onUpdateTickets === "function") {
      (TicketCheckout as any).props.onUpdateTickets(firstTicketId, newQuantity)
    }
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">District Vibez Block Party Presents Respect the DJ – Vol.2 Tickets</h1>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Ticket Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{getSelectedTicketName()}</h3>
                  <p className="text-gray-600">More ▼</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent" onClick={() => {
                      const firstTicketId = Object.keys(selectedTickets).find((id) => selectedTickets[id] > 0)
                      {firstTicketId !== undefined &&
                        onUpdateTickets(firstTicketId, Math.max(0, selectedTickets[firstTicketId] - 1))
                      }
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{totalQuantity}</span>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent" onClick={() => {
                      const firstTicketId = Object.keys(selectedTickets).find((id) => selectedTickets[id] > 0)
                      if (!firstTicketId) return
                      onUpdateTickets(firstTicketId, selectedTickets[firstTicketId] + 1)
                    }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span>Quantity: {totalQuantity}</span>
                  <span>Total: {formatPrice(subtotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendee Forms */}
          <Card>
            <CardHeader>
              <CardTitle>{getSelectedTicketName()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {attendees.map((attendee, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Attendee {index + 1}</h4>
                    {attendees.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttendee(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        Remove <X className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name *</Label>
                      <Input
                        id={`name-${index}`}
                        value={attendee.name}
                        onChange={(e) => updateAttendee(index, "name", e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`email-${index}`}>Email *</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={attendee.email}
                        onChange={(e) => updateAttendee(index, "email", e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <p className="text-sm text-gray-600">
                Each attendee specified will receive an email with their individual ticket included.
              </p>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 bg-transparent"
                >
                  Save and View Cart
                </Button>
                <span className="text-gray-500">or</span>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                >
                  {isLoading ? "Processing..." : "Checkout Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 w-full">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                Your Order
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Return to cart
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit attendee info
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="space-y-3">
                <div className="flex justify-between font-medium">
                  <span className="font-medium">Product</span>
                  <span className="font-medium">Subtotal</span>
                </div>

                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
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
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
