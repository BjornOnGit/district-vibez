"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X } from "lucide-react"

interface NavbarProps {
  onBuyTickets: () => void
}

export function Navbar({ onBuyTickets }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-black tracking-tight">
              DISTRICT VIBEZ
              <br />
              <span className="text-sm font-medium">BLOCK PARTY</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#culture" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">
              Culture
            </a>
            <a href="#music" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">
              Music
            </a>
            <a href="#community" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">
              Community
            </a>

            <div className="flex items-center space-x-4">
              <ShoppingBag className="h-5 w-5 text-gray-900" />
              <Button
                onClick={onBuyTickets}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full transition-colors"
              >
                🎫 Tickets
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-gray-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#culture" className="block px-3 py-2 text-gray-900 hover:text-gray-600 font-medium">
                Culture
              </a>
              <a href="#music" className="block px-3 py-2 text-gray-900 hover:text-gray-600 font-medium">
                Music
              </a>
              <a href="#community" className="block px-3 py-2 text-gray-900 hover:text-gray-600 font-medium">
                Community
              </a>
              <div className="px-3 py-2">
                <Button
                  onClick={onBuyTickets}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-full"
                >
                  🎫 Tickets
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
