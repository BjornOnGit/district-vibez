"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { EventDetails } from "@/components/event-details"
import { PartnersSection } from "@/components/partners-section"
import { FoundationPlaylistSection } from "@/components/foundation-playlist-section"
import { TicketForm } from "@/components/ticket-form"
import { Modal } from "@/components/modal"
import { Navbar } from "@/components/navbar"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  ticket_price: number
  total_tickets: number
  tickets_sold: number
}

export default function HomePage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase.from("events").select("*").limit(1).single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error("Error fetching event:", error)
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">The event could not be loaded.</p>
        </div>
      </div>
    )
  }

  const availableTickets = event.total_tickets - event.tickets_sold

  return (
    <main className="min-h-screen bg-background">
      <Navbar onBuyTickets={() => setIsTicketModalOpen(true)} />
      <Hero onBuyTickets={() => setIsTicketModalOpen(true)} />
      <EventDetails />
      <PartnersSection />
      <FoundationPlaylistSection />

      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Purchase Tickets">
        <TicketForm eventId={event.id} ticketPrice={event.ticket_price} availableTickets={availableTickets} />
      </Modal>
    </main>
  )
}
