import { Users, Activity, Compass, Heart, BookOpen, Lightbulb } from "lucide-react"

const principles = [
  {
    icon: Users,
    title: "Mixed-Age Classrooms",
    description:
      "Children learn from and teach each other in carefully prepared environments that span three-year age groupings.",
  },
  {
    icon: Activity,
    title: "Hands-On Learning",
    description:
      "Concrete materials allow children to explore abstract concepts through all their senses before moving to abstraction.",
  },
  {
    icon: Compass,
    title: "Child-Centered Approach",
    description:
      "Teachers guide rather than instruct, helping each child follow their own natural path of development.",
  },
  {
    icon: Heart,
    title: "Respect for the Child",
    description:
      "We honor each child's unique timeline and learning style, fostering intrinsic motivation and self-confidence.",
  },
  {
    icon: BookOpen,
    title: "Prepared Environment",
    description:
      "Every element in our classrooms is thoughtfully chosen to promote independence and meaningful learning.",
  },
  {
    icon: Lightbulb,
    title: "Joy of Discovery",
    description:
      "Learning becomes a natural, joyful process when children are free to explore their interests and curiosity.",
  },
]

export default function Philosophy() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Montessori Philosophy
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
            We believe in creating an environment where children can develop their full potential through self-directed
            activity, hands-on learning, and collaborative play.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, index) => {
            const Icon = principle.icon
            return (
              <div key={index} className="bg-card p-8 rounded-lg border border-border hover-lift group">
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-12 h-12" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-card-foreground">{principle.title}</h3>
                <p className="text-muted-foreground text-pretty">{principle.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
