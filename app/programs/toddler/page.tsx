import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Smile, Clock, Users, Heart, Utensils, Palette, Music, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const dailySchedule = [
  { time: "8:00 - 8:30 AM", activity: "Arrival & Free Choice Work" },
  { time: "8:30 - 9:30 AM", activity: "Practical Life Activities" },
  { time: "9:30 - 10:00 AM", activity: "Snack & Community Time" },
  { time: "10:00 - 11:00 AM", activity: "Outdoor Exploration" },
  { time: "11:00 - 11:30 AM", activity: "Language & Music" },
  { time: "11:30 AM - 12:00 PM", activity: "Cleanup & Departure" },
]

const curriculumAreas = [
  {
    icon: Heart,
    title: "Practical Life",
    description: "Real-world activities that develop independence, concentration, and fine motor skills",
    activities: ["Pouring water", "Food preparation", "Cleaning activities", "Self-care routines"],
  },
  {
    icon: Palette,
    title: "Sensorial",
    description: "Materials that refine the senses and prepare for academic learning",
    activities: ["Color tablets", "Sound cylinders", "Texture fabrics", "Geometric solids"],
  },
  {
    icon: Music,
    title: "Language",
    description: "Rich language experiences through songs, stories, and conversation",
    activities: ["Vocabulary enrichment", "Listening games", "Story time", "Simple books"],
  },
  {
    icon: Leaf,
    title: "Nature & Science",
    description: "Exploration of the natural world through hands-on discovery",
    activities: ["Garden care", "Animal observation", "Weather awareness", "Seasonal changes"],
  },
]

export default function ToddlerProgramPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Smile className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
                    Toddler Community
                  </h1>
                  <p className="text-primary font-medium text-xl">Ages 18 months - 3 years</p>
                </div>
              </div>

              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                A nurturing environment where toddlers develop independence, language skills, and social awareness
                through carefully designed activities that respect their natural development.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/register-toddler">Apply Now</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/schedule-tour">Schedule a Tour</Link>
                </Button>
              </div>
            </div>

            <div>
              <img
                src="/montessori-prepared-environment-classroom.jpg"
                alt="Toddler classroom environment"
                className="w-full rounded-lg shadow-lg hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Monday - Friday
                  <br />
                  8:00 AM - 12:00 PM
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>Class Size</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  8-10 children
                  <br />
                  with 2 trained guides
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Utensils className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>Meals</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Healthy snacks
                  <br />
                  provided daily
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Why Choose Our Toddler Program?
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
              Our toddler environment is specially prepared to meet the unique needs of children in this crucial
              developmental stage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Developmental Focus</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Independence",
                    description: "Children learn to care for themselves and their environment",
                  },
                  {
                    title: "Language Development",
                    description: "Rich vocabulary building through songs, stories, and conversation",
                  },
                  {
                    title: "Social Skills",
                    description: "Grace and courtesy lessons help children interact respectfully",
                  },
                  {
                    title: "Motor Skills",
                    description: "Fine and gross motor development through purposeful activities",
                  },
                ].map((focus, index) => (
                  <div key={index} className="border-l-4 border-primary/30 pl-4">
                    <h4 className="font-semibold text-foreground mb-1">{focus.title}</h4>
                    <p className="text-muted-foreground text-sm text-pretty">{focus.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Toddler activities"
                className="w-full rounded-lg shadow-lg hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Areas */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Curriculum Areas
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
              Our curriculum is designed around the toddler's natural interests and developmental needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {curriculumAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <Card key={index} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{area.title}</CardTitle>
                        <CardDescription className="text-pretty">{area.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {area.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              A Day in Our Toddler Community
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              Our daily routine provides structure while allowing for individual exploration
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                {dailySchedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div className="bg-primary/10 px-4 py-2 rounded-lg min-w-fit">
                      <span className="font-medium text-primary">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            Give Your Toddler the Best Start
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 text-pretty">
            Our toddler program provides the perfect foundation for your child's lifelong love of learning. Schedule a
            visit to see our nurturing environment in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90" asChild>
              <Link href="/register-toddler">Start Application</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/schedule-tour">Schedule a Tour</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
