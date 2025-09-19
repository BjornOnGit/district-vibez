import { Card, CardContent } from "../components/ui/card"
import { Calendar, Clock, MapPin, Users, Mic, Coffee } from "lucide-react"

export function EventDetails() {
  const details = [
    {
      icon: Calendar,
      title: "Date",
      description: "Saturday, June 15, 2024",
    },
    {
      icon: Clock,
      title: "Time",
      description: "9:00 AM - 6:00 PM WAT",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Lagos Convention Centre, Victoria Island, Lagos",
    },
    {
      icon: Users,
      title: "Capacity",
      description: "500 Tech Professionals",
    },
    {
      icon: Mic,
      title: "Speakers",
      description: "20+ Industry Experts",
    },
    {
      icon: Coffee,
      title: "Networking",
      description: "Lunch & Coffee Breaks",
    },
  ]

  const schedule = [
    { time: "9:00 AM", title: "Registration & Welcome Coffee" },
    { time: "10:00 AM", title: "Opening Keynote: The Future of AI" },
    { time: "11:00 AM", title: "Panel: Cloud Computing Trends" },
    { time: "12:30 PM", title: "Networking Lunch" },
    { time: "2:00 PM", title: "Workshop: Building Scalable APIs" },
    { time: "3:30 PM", title: "Talk: Cybersecurity Best Practices" },
    { time: "4:30 PM", title: "Startup Pitch Competition" },
    { time: "5:30 PM", title: "Closing Remarks & Networking" },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Event Details</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Tech Conference 2024
          </p>
        </div>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {details.map((detail, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <detail.icon className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h3 className="text-lg font-semibold mb-2">{detail.title}</h3>
                <p className="text-muted-foreground">{detail.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Event Schedule</h3>
            <p className="text-muted-foreground">A full day packed with learning and networking</p>
          </div>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {item.time}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Location Map */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Venue Location</h3>
            <p className="text-muted-foreground">Lagos Convention Centre, Victoria Island</p>
          </div>

          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-accent" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-muted-foreground">Lagos Convention Centre, Victoria Island, Lagos</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
