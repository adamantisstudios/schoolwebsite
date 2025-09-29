import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Building2 } from "lucide-react"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-50 to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">Gallery</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              Explore our vibrant school community through photos of our events and beautiful facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/gallery/events">
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-t-lg overflow-hidden">
                    <img
                      src="/placeholder-xp0d6.png"
                      alt="School Events"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-sage-900 mb-3">Events</h3>
                    <p className="text-sage-600 mb-4">
                      Discover the joy and excitement of our school events, celebrations, and special activities that
                      bring our community together.
                    </p>
                    <div className="text-amber-600 font-medium group-hover:text-amber-700 transition-colors">
                      View Event Photos →
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gallery/facilities">
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gradient-to-br from-sage-100 to-green-100 rounded-t-lg overflow-hidden">
                    <img
                      src="/montessori-classroom-facilities-playground.jpg"
                      alt="School Facilities"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-sage-900 mb-3">Facilities</h3>
                    <p className="text-sage-600 mb-4">
                      Tour our beautiful campus with specially designed Montessori classrooms, outdoor spaces, and
                      learning environments.
                    </p>
                    <div className="text-amber-600 font-medium group-hover:text-amber-700 transition-colors">
                      View Facility Photos →
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
