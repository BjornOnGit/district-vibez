"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard, Shield, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TicketFormProps {
  eventId: string
  ticketPrice: number
  availableTickets: number
}

export function TicketForm({ eventId, ticketPrice, availableTickets }: TicketFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Store form data in sessionStorage and navigate to checkout page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ticketFormData", JSON.stringify({ ...formData, eventId }))
      window.location.href = "/tickets/checkout"
    }
    setIsLoading(false)
  }

  const totalAmount = formData.quantity * ticketPrice
  const formattedPrice = (ticketPrice / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  })
  const formattedTotal = (totalAmount / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  })

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Your Tickets</h2>
            <p className="text-xl text-muted-foreground">Secure your spot at Tech Conference 2024</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Ticket Purchase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Ticket Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ticket Selection</h3>

                  <div>
                    <Label htmlFor="quantity">Number of Tickets</Label>
                    <Select
                      defaultValue={formData.quantity.toString()}
                      onValueChange={(value) => handleInputChange("quantity", Number.parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: Math.min(10, availableTickets) }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Ticket" : "Tickets"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Price per ticket:</span>
                      <span className="font-semibold">{formattedPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-accent">{formattedTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p className="text-muted-foreground">
                        Your payment is processed securely through Paystack. We never store your payment information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Availability Notice */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{availableTickets} tickets remaining</span>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading || availableTickets === 0}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Purchase Tickets - ${formattedTotal}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
