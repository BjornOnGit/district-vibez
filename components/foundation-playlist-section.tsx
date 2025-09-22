import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play } from "lucide-react"

export function FoundationPlaylistSection() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-16 left-16 w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-40 right-24 w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-16 right-16 w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-24 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Foundation Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">BLOCK PARTY is LOVE</h2>
              <h3 className="text-3xl font-script italic text-foreground/80 mb-6">foundation</h3>
              <div
                className="w-full h-1 bg-gradient-to-r from-red-500 via-red-400 to-transparent mb-6"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 8px, transparent 8px, transparent 16px)",
                }}
              ></div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              The corporate social responsibility arm of District Vibez Block Party is 'BLOCKPARTY IS LOVE FOUNDATION'.
              It came into existence as part of the District Vibez Block Party's desire to give back to its audience.
            </p>

            <Button variant="outline" className="group bg-transparent">
              Learn more
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Yellow Heart */}
            <div className="flex justify-center lg:justify-start mt-8">
              <div className="w-32 h-28 bg-yellow-400 rounded-t-full relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full"></div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Playlist Section */}
          <div className="flex justify-center lg:justify-end">
            <Card className="bg-green-900 text-white border-0 max-w-sm w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">BlockParty Playlist</h3>
                </div>

                <p className="text-green-100 mb-6 text-sm leading-relaxed">
                  Enjoy premium vibes from our playlists specially curated for you
                </p>

                <Button className="bg-green-500 hover:bg-green-400 text-green-900 font-semibold w-full mb-4">
                  <Play className="mr-2 w-4 h-4" />
                  Listen Now
                </Button>

                <div className="relative">
                  <img
                    src="/person-wearing-jacket-with-music-patches-and-badge.jpg"
                    alt="Person with music patches"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
