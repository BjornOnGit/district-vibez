"use client"

import { useState } from "react"
import { TicketSelection } from "@/components/ticket-selection"
import { useRouter } from "next/navigation"

export default function TicketsPage() {
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({})
  const router = useRouter()

  const handleGetTickets = (tickets: { [key: string]: number }) => {
    setSelectedTickets(tickets)
    // Store in sessionStorage for checkout page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedTickets", JSON.stringify(tickets))
    }
    router.push("/tickets/checkout")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <TicketSelection onGetTickets={handleGetTickets} />
    </div>
  )
}
