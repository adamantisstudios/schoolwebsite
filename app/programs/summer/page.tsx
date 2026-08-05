import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Calendar, Sun, Waves, TreePine, Palette } from "lucide-react"
import Link from "next/link"

const summerActivities = [
  {
    name: "Nature Exploration",
    icon: <TreePine className="h-6 w-6" />,
    description: "Outdoor adventures and environmental discovery",
    activities: ["Garden exploration", "Nature walks", "Bug hunting", "Weather observation"],
  },
  {
    name: "Water Play",
    icon: <Waves className="h-6 w-6" />,
    description: "Safe water activities and sensory experiences",
    activities: ["Water table play", "Sprinkler fun", "Bubble exploration", "Sink and float experiments"],
  },
  {
    name: "Arts & Crafts",
    icon: <Palette className="h-6 w-6" />,
    description: "Creative expression through various art mediums",
    activities: ["Painting", "Clay modeling", "Nature crafts", "Collage making"],
  },
  {
    name: "Summer Science",
    icon: <Sun className="h-6 w-6" />,
    description: "Fun science experiments and discoveries",
    activities: ["Solar experiments", "Plant growth studies", "Simple chemistry", "Physics fun"],
  },
]

export default function SummerCampPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">
                  Ages 3-12 Years
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Summer Camp</h1>
                <p className="text-xl text-gray-600 mb-8 text-pretty">
                  Our Summer Camp combines the joy of summer with Montessori learning principles, offering outdoor
                  exploration, creative activities, and fun educational experiences in a nurturing environment.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>8:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <span>Max 20 children per group</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>June - August</span>
                  </div>
                </div>

                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700" asChild>
                  <Link href="/register-summer">Register Now</Link>
                </Button>
              </div>

              <div className="relative">
                <img
                  src="/summer-camp-activities.jpg"
                  alt="Summer Camp Activities"
                  className="rounded-lg shadow-xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Summer Activities</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto text-balance">
                Our summer program offers a perfect blend of outdoor fun, creative expression, and educational discovery
                that keeps children engaged and learning all summer long.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {summerActivities.map((activity, index) => (
                <Card key={activity.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">{activity.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
                        <p className="text-gray-600 mb-4 text-pretty">{activity.description}</p>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Activities Include:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {activity.activities.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-1">•</span>
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

        {/* Registration Info */}
        <section className="py-16 bg-yellow-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Summer Camp Registration</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Session 1</h3>
                <p className="text-gray-600">June 3 - June 28</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">GHS 800</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Session 2</h3>
                <p className="text-gray-600">July 1 - July 26</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">GHS 800</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Full Summer</h3>
                <p className="text-gray-600">June 3 - August 23</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">GHS 1,400</p>
              </div>
            </div>
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700" asChild>
              <Link href="/register-summer">Register for Summer Camp</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
