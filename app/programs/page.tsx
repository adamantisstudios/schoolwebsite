import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Smile, Star, BookOpen, Sun, Calendar, Users, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const programs = [
  {
    icon: Smile,
    title: "Toddler Community",
    ageRange: "18 months - 3 years",
    schedule: "Monday - Friday, 8:00 AM - 12:00 PM",
    classSize: "8-10 children with 2 guides",
    description:
      "A nurturing environment where toddlers develop independence, language skills, and social awareness through carefully designed activities.",
    curriculum: [
      "Practical life activities (pouring, spooning, cleaning)",
      "Language development through songs and stories",
      "Sensory exploration with natural materials",
      "Grace and courtesy lessons",
      "Toilet learning support",
      "Outdoor exploration and nature connection",
    ],
    href: "/programs/toddler",
    image: "/montessori-prepared-environment-classroom.jpg",
  },
  {
    icon: Star,
    title: "Primary Program",
    ageRange: "3 - 6 years",
    schedule: "Monday - Friday, 8:00 AM - 3:00 PM",
    classSize: "20-25 children with 2 guides",
    description:
      "The foundation of Montessori education with a complete curriculum covering all areas of learning in a mixed-age environment.",
    curriculum: [
      "Practical life skills and independence",
      "Sensorial materials for cognitive development",
      "Mathematics with concrete materials",
      "Language arts including phonics and writing",
      "Cultural studies (geography, history, science)",
      "Peace education and conflict resolution",
    ],
    href: "/programs/primary",
    image: "/montessori-materials-hands-on-learning.jpg",
    featured: true,
  },
  {
    icon: BookOpen,
    title: "Elementary Program",
    ageRange: "6 - 12 years",
    schedule: "Monday - Friday, 8:00 AM - 3:30 PM",
    classSize: "15-20 children with 2 guides",
    description:
      "An integrated cosmic curriculum that explores the interconnectedness of all knowledge through research and collaborative projects.",
    curriculum: [
      "Cosmic education and the Great Lessons",
      "Advanced mathematics and geometry",
      "Research and presentation skills",
      "Scientific experiments and exploration",
      "Cultural studies and timeline work",
      "Community service and social responsibility",
    ],
    href: "/programs/elementary",
    image: "/montessori-classroom-environment.jpg",
  },
]

export default function ProgramsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">Our Programs</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Developmentally appropriate Montessori education for every stage of your child's growth
          </p>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {programs.map((program, index) => {
              const Icon = program.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
                >
                  <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                    <div className="relative">
                      {program.featured && (
                        <Badge className="absolute -top-3 left-0 bg-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      )}

                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-serif text-3xl font-bold text-foreground">{program.title}</h2>
                          <p className="text-primary font-medium text-lg">{program.ageRange}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-lg mb-8 text-pretty">{program.description}</p>

                      <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Schedule</h4>
                            <p className="text-muted-foreground text-sm">{program.schedule}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Class Size</h4>
                            <p className="text-muted-foreground text-sm">{program.classSize}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="font-semibold text-foreground mb-4">Curriculum Highlights</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {program.curriculum.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button asChild size="lg">
                        <Link href={program.href}>Learn More About This Program</Link>
                      </Button>
                    </div>
                  </div>

                  <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                    <img
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      className="w-full rounded-lg shadow-lg hover-lift"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Summer Program */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg border border-border p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Sun className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-card-foreground">Summer Camp Program</h2>
                    <p className="text-primary font-medium text-lg">Ages 3 - 12 years</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-lg mb-8 text-pretty">
                  Our summer camp offers a fun-filled Montessori experience during the summer months, combining outdoor
                  exploration with hands-on learning activities.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">Duration</h4>
                      <p className="text-muted-foreground text-sm">June - August, 8 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">Hours</h4>
                      <p className="text-muted-foreground text-sm">9:00 AM - 3:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-card-foreground mb-4">Summer Activities</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      "Weekly thematic units",
                      "Outdoor exploration and gardening",
                      "Arts and crafts workshops",
                      "Music and movement activities",
                      "Nature walks and discovery",
                      "Water play and sensory activities",
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild size="lg">
                  <Link href="/programs/summer">Learn About Summer Camp</Link>
                </Button>
              </div>

              <div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Children at summer camp"
                  className="w-full rounded-lg shadow-lg hover-lift"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
