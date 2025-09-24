"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TicketCheckout } from "@/components/ticket-checkout"

export default function TicketCheckoutPage(){
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({})
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedTickets")
      if (stored) {
        setSelectedTickets(JSON.parse(stored))
      } else {
        router.replace("/tickets")
      }
    }
  }, [router])

  if (!selectedTickets || Object.values(selectedTickets).every((qty) => qty === 0)) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <TicketCheckout 
      selectedTickets={selectedTickets}
      onBack={() => router.push("/tickets")}
      onClose={() => router.push("/")}
      onUpdateTickets={() => {}} 
    />
    </div>
  )
}
