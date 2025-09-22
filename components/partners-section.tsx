"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PartnersSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const partners = [
    { name: "BellaNaija", logo: "/bellanaija-logo.jpg" },
    { name: "British American Tobacco", logo: "/british-american-tobacco-logo.jpg" },
    { name: "Audiomack", logo: "/audiomack-logo.jpg" },
    { name: "Sterling", logo: "/sterling-logo.jpg" },
    { name: "Partner 5", logo: "/music-brand-logo.jpg" },
    { name: "Partner 6", logo: "/entertainment-brand-logo.png" },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, partners.length - 4))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, partners.length - 4)) % Math.max(1, partners.length - 4))
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-2 h-2 bg-accent rounded-full"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-accent rounded-full"></div>
        <div className="absolute bottom-20 left-40 w-2 h-2 bg-accent rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-2 h-2 bg-accent rounded-full"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block border-2 border-dashed border-foreground rounded-full px-8 py-3 mb-8">
            <span className="text-lg font-medium">Our Partners</span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="overflow-hidden mx-12">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 25}%)` }}
            >
              {partners.map((partner, index) => (
                <div key={index} className="flex-shrink-0 w-1/4 px-4">
                  <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24">
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}
