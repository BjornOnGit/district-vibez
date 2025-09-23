"use client"

import { useState, useEffect } from "react"
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
  onUpdateTickets: () => void
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

  const TicketCheckout = ({ onBack, onClose }: TicketCheckoutProps) => {
    const [attendees, setAttendees] = useState<AttendeeInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<any>(null)
    const { toast } = useToast()

  // Read form data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("ticketFormData")
      if (stored) {
        const parsed = JSON.parse(stored)
        setFormData(parsed)
        setAttendees([{ name: parsed.name, email: parsed.email }])
      }
    }
  }, [])

  // Calculate totals
  const subtotal = formData ? (formData.quantity * (formData.ticketPrice || 0)) : 0
  const totalQuantity = formData ? formData.quantity : 0
  const total = subtotal + SERVICE_FEE

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

  // Removed getSelectedTicketName function as it is no longer needed

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
          ...formData,
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
    // Removed onUpdateTickets function as it is no longer needed
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
        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 w-full">
          <Card className="sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-col gap-2 items-start text-xl">
                <span>Your Order</span>
                <div className="flex flex-col gap-2 w-full">
                  <Button variant="ghost" size="sm" onClick={onBack} className="justify-start w-full">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Return to cart
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start w-full">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit attendee info
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base p-6">
              <div className="space-y-4">
                <div className="flex justify-between font-medium text-base pb-2 border-b">
                  <span className="font-medium">Product</span>
                  <span className="font-medium">Subtotal</span>
                </div>

                <div className="space-y-3 pt-2">
                  {formData && (
                    <div className="flex justify-between text-sm py-1">
                      <span>
                        Ticket × {formData.quantity}
                      </span>
                      <span>{formatPrice((formData.ticketPrice || 0) * formData.quantity)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Service Fee</span>
                  <span>{formatPrice(SERVICE_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Attendee Info Form */}
        <div className="lg:col-span-3 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Attendee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-6">
                {attendees.map((attendee, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-2 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">
                        Attendee {index + 1}
                      </span>
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
              </div>
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
      </div>
    </div>
  )
}

export default TicketCheckout
