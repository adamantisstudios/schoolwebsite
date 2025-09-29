import Link from "next/link"
import { Smile, Star, BookOpen, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const programs = [
  {
    icon: Smile,
    title: "Toddler Community",
    ageRange: "18 months - 3 years",
    description: "A nurturing environment where toddlers develop independence, language skills, and social awareness.",
    features: [
      "Developing independence and language skills",
      "Practical life activities",
      "Sensory exploration",
      "Grace and courtesy lessons",
    ],
    href: "/programs/toddler",
    featured: false,
  },
  {
    icon: Star,
    title: "Primary Program",
    ageRange: "3 - 6 years",
    description: "The foundation of Montessori education with a complete curriculum covering all areas of learning.",
    features: [
      "Full Montessori curriculum",
      "Reading, writing, and mathematics",
      "Cultural studies and science",
      "Peace education",
    ],
    href: "/programs/primary",
    featured: true,
  },
  {
    icon: BookOpen,
    title: "Elementary Program",
    ageRange: "6 - 12 years",
    description: "An integrated cosmic curriculum that explores the interconnectedness of all knowledge.",
    features: [
      "Integrated cosmic curriculum",
      "Project-based learning",
      "Community engagement",
      "Research and presentation skills",
    ],
    href: "/programs/elementary",
    featured: false,
  },
]

export default function Programs() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Our Programs</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
            We offer developmentally appropriate programs for children from toddlerhood through elementary school.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => {
            const Icon = program.icon
            return (
              <div
                key={index}
                className={`bg-card p-8 rounded-lg border hover-lift relative ${
                  program.featured ? "border-primary/50 shadow-lg scale-105 z-10" : "border-border"
                }`}
              >
                {program.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-serif text-xl font-bold mb-2 text-center text-card-foreground">{program.title}</h3>
                <p className="text-primary text-center mb-4 font-medium">{program.ageRange}</p>
                <p className="text-muted-foreground text-center mb-6 text-pretty">{program.description}</p>

                <ul className="space-y-3 mb-8">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <Button asChild variant={program.featured ? "default" : "outline"}>
                    <Link href={program.href}>Learn More</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summer Program */}
        <div className="bg-card rounded-lg border border-border p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sun className="w-8 h-8 text-primary" />
                <h3 className="font-serif text-2xl font-bold text-card-foreground">Summer Camp Program</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-pretty">
                Our summer camp offers a fun-filled Montessori experience for children ages 3-12 during the summer
                months, combining outdoor exploration with hands-on learning.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Weekly thematic units",
                  "Outdoor exploration and gardening",
                  "Arts and crafts workshops",
                  "Music and movement activities",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/programs/summer">Learn About Summer Camp</Link>
              </Button>
            </div>
            <div>
              <img
                src="/placeholder-5ylxc.png"
                alt="Children at summer camp"
                className="w-full rounded-lg shadow-lg hover-lift"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
