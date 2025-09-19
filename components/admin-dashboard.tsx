"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { LogOut, Users, CreditCard, Calendar, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { signOutAdmin } from "@/lib/supabase/auth"
import { supabase } from "@/lib/supabase/client"

interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  ticket_quantity: number
  amount_paid: number
  payment_status: "pending" | "success" | "failed"
  paystack_ref: string | null
  created_at: string
  paid_at: string | null
}

interface Event {
  id: string
  name: string
  total_tickets: number
  tickets_sold: number
  ticket_price: number
}

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch event data
      const { data: eventData, error: eventError } = await supabase.from("events").select("*").limit(1).single()

      if (eventError) throw eventError
      setEvent(eventData)

      // Fetch attendees
      const { data: attendeesData, error: attendeesError } = await supabase
        .from("attendees")
        .select("*")
        .eq("event_id", eventData.id)
        .order("created_at", { ascending: false })

      if (attendeesError) throw attendeesError
      setAttendees(attendeesData || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOutAdmin()
      onLogout()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const exportAttendees = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Tickets", "Amount", "Status", "Payment Date"].join(","),
      ...attendees.map((attendee) =>
        [
          attendee.name,
          attendee.email,
          attendee.phone,
          attendee.ticket_quantity,
          (attendee.amount_paid / 100).toFixed(2),
          attendee.payment_status,
          attendee.paid_at ? new Date(attendee.paid_at).toLocaleDateString() : "N/A",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendees-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const successfulAttendees = attendees.filter((a) => a.payment_status === "success")
  const pendingAttendees = attendees.filter((a) => a.payment_status === "pending")
  const totalRevenue = successfulAttendees.reduce((sum, a) => sum + a.amount_paid, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">{event?.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulAttendees.length}</div>
              <p className="text-xs text-muted-foreground">{pendingAttendees.length} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{event?.tickets_sold || 0}</div>
              <p className="text-xs text-muted-foreground">of {event?.total_tickets} available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(totalRevenue / 100).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From successful payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendees.length > 0 ? Math.round((successfulAttendees.length / attendees.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Payment success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendees Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendees</CardTitle>
              <Button onClick={exportAttendees} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell className="font-medium">{attendee.name}</TableCell>
                      <TableCell>{attendee.email}</TableCell>
                      <TableCell>{attendee.phone}</TableCell>
                      <TableCell>{attendee.ticket_quantity}</TableCell>
                      <TableCell>₦{(attendee.amount_paid / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            attendee.payment_status === "success"
                              ? "default"
                              : attendee.payment_status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {attendee.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {attendee.paid_at
                          ? new Date(attendee.paid_at).toLocaleDateString()
                          : new Date(attendee.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
