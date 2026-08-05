import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Calendar, Microscope, Globe2, BookOpen, Calculator } from "lucide-react"
import Link from "next/link"

const curriculumAreas = [
  {
    name: "Cosmic Education",
    icon: <Globe2 className="h-6 w-6" />,
    description: "Understanding the interconnectedness of all things in the universe",
    focus: ["History of the universe", "Timeline of life", "Human civilizations", "Cultural studies"],
  },
  {
    name: "Mathematics",
    icon: <Calculator className="h-6 w-6" />,
    description: "Advanced mathematical concepts through concrete materials",
    focus: ["Geometry", "Fractions", "Decimals", "Mathematical operations"],
  },
  {
    name: "Language Arts",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Advanced reading, writing, and communication skills",
    focus: ["Creative writing", "Research skills", "Grammar analysis", "Literature study"],
  },
  {
    name: "Science",
    icon: <Microscope className="h-6 w-6" />,
    description: "Hands-on exploration of scientific concepts and methods",
    focus: ["Biology", "Chemistry", "Physics", "Scientific method"],
  },
]

export default function ElementaryProgramPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 border-green-200">
                  Ages 6-12 Years
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Elementary Program</h1>
                <p className="text-xl text-gray-600 mb-8 text-pretty">
                  Our Elementary Program nurtures the reasoning mind through cosmic education, collaborative learning,
                  and independent research that sparks imagination and develops critical thinking skills.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>8:00 AM - 3:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <span>Max 28 children</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>Monday - Friday</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/register-elementary">Apply Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/schedule-tour">Schedule a Tour</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/elementary-program-classroom.jpg"
                  alt="Elementary Program Classroom"
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
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Curriculum Focus Areas</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto text-balance">
                Our Elementary Program integrates all subjects through cosmic education, helping children understand
                their place in the universe and their responsibility to it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {curriculumAreas.map((area, index) => (
                <Card key={area.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg text-green-600">{area.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{area.name}</h3>
                        <p className="text-gray-600 mb-4 text-pretty">{area.description}</p>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Focus Areas:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {area.focus.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                {item}
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

        <section className="py-20 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
              Inspire Your Child's Reasoning Mind
            </h2>
            <p className="text-xl mb-8 text-green-100 text-pretty">
              Our Elementary Program develops critical thinking, creativity, and a deep understanding of the world.
              Schedule a visit to see our cosmic education approach in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/register-elementary">Start Application</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-green-600 bg-transparent"
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
