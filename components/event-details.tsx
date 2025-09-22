import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, Music, Heart } from "lucide-react"

export function EventDetails() {
  const details = [
    {
      icon: Calendar,
      title: "Date",
      description: "Saturday, December 28, 2024",
    },
    {
      icon: Clock,
      title: "Time",
      description: "6:00 PM - 2:00 AM WAT",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Tafawa Balewa Square, Lagos Island, Lagos",
    },
    {
      icon: Users,
      title: "Capacity",
      description: "5,000 Party Lovers",
    },
    {
      icon: Music,
      title: "Artists",
      description: "15+ Top Performers",
    },
    {
      icon: Heart,
      title: "Vibes",
      description: "Non-stop Entertainment",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Event Details</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about District Vibez Block Party 2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  )
}
