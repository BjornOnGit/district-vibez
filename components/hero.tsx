"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/district-vibez-hero.jpg" alt="District Vibez" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">District Vibez Vol. 1.0</h1>
          <p className="text-xl md:text-2xl mb-8 text-balance opacity-90">
            Experience the ultimate fusion of music, culture, and vibes at District Vibez Vol. 1.0 – Lagos' premier
            music festival!
          </p>

          {/* Quick Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>October 11, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Lagos Convention Centre</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>500 Attendees</span>
            </div>
          </div>

          <Button
            onClick={() => router.push("/tickets")}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold"
          >
            Get Your Tickets Now
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
