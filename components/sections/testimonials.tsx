import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Emily Rodriguez",
    role: "Parent of Primary student",
    image: "/placeholder-v5ohj.png",
    content:
      "The transformation in my daughter's confidence and love for learning has been remarkable. The Montessori approach truly nurtures the whole child.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Parent of Elementary student",
    image: "/happy-parent-man.jpg",
    content:
      "Our son has developed such independence and critical thinking skills. The mixed-age classroom has been wonderful for his social development too.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Parent of Toddler student",
    image: "/happy-parent-woman-smiling.jpg",
    content:
      "The gentle guidance and respect for children's natural development is exactly what we were looking for. Our toddler loves coming to school every day.",
    rating: 5,
  },
  {
    name: "Robert Kim",
    role: "Parent of Primary student",
    image: "/happy-parent-man-professional.jpg",
    content:
      "The teachers truly understand each child's unique needs. The progress reports show not just academic growth but emotional and social development too.",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            What Parents Say
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
            Hear from our Montessori Bloom families about their experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-lg border border-border hover-lift relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

              <div className="flex items-start gap-4 mb-6">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-muted-foreground italic mb-6 text-pretty">"{testimonial.content}"</p>

              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
