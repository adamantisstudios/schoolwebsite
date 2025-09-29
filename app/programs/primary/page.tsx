import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Calendar, BookOpen, Palette, Globe, Calculator } from "lucide-react"
import Link from "next/link"
import WhatsAppChat from "@/components/whatsapp-chat"

const curriculumAreas = [
  {
    name: "Practical Life",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Daily living skills that build independence and concentration",
    activities: ["Food preparation", "Care of environment", "Grace and courtesy", "Care of self"],
  },
  {
    name: "Sensorial",
    icon: <Palette className="h-6 w-6" />,
    description: "Refinement of the senses through hands-on exploration",
    activities: ["Color tablets", "Sound boxes", "Geometric solids", "Texture fabrics"],
  },
  {
    name: "Mathematics",
    icon: <Calculator className="h-6 w-6" />,
    description: "Concrete to abstract mathematical concepts",
    activities: ["Golden beads", "Number rods", "Sandpaper numbers", "Addition strip board"],
  },
  {
    name: "Language",
    icon: <Globe className="h-6 w-6" />,
    description: "Reading, writing, and communication skills development",
    activities: ["Sandpaper letters", "Moveable alphabet", "Reading series", "Creative writing"],
  },
]

export default function PrimaryProgramPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                  Ages 3-6 Years
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Primary Program</h1>
                <p className="text-xl text-gray-600 mb-8 text-pretty">
                  Our Primary Program provides a carefully prepared environment where children develop independence,
                  concentration, and a love for learning through hands-on exploration of concrete materials.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>8:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <span>Max 24 children</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>Monday - Friday</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/register-primary">Apply Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/schedule-tour">Schedule a Tour</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/primary-program-classroom.jpg"
                  alt="Primary Program Classroom"
                  className="rounded-lg shadow-xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Areas */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Curriculum Areas</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto text-balance">
                Our Primary Program is built around four core curriculum areas that work together to support your
                child's holistic development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {curriculumAreas.map((area, index) => (
                <Card key={area.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 p-3 rounded-lg text-amber-600">{area.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{area.name}</h3>
                        <p className="text-gray-600 mb-4 text-pretty">{area.description}</p>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Activities:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {area.activities.map((activity, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">•</span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-amber-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
              Nurture Your Child's Natural Love of Learning
            </h2>
            <p className="text-xl mb-8 text-amber-100 text-pretty">
              Our Primary Program provides the perfect foundation for academic success and lifelong learning. Schedule a
              visit to see our prepared environment in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100" asChild>
                <Link href="/register-primary">Start Application</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-amber-600 bg-transparent"
                asChild
              >
                <Link href="/schedule-tour">Schedule a Tour</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
