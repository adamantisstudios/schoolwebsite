import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Ama Oforiwaa",
    role: "Mother of a Primary student",
    image: "/images/ama-oforiwaa.jpg",
    content:
      "My daughter’s confidence and passion for learning have grown so much. The Montessori method truly cares for the whole child—heart, mind, and spirit.",
    rating: 5,
  },
  {
    name: "Kwabena Owusu",
    role: "Father of an Elementary student",
    image: "/images/kwabena-owusu.jpg",
    content:
      "Our son has become so independent and thinks critically now. The mixed-age classroom has also helped him build strong social skills and respect for others.",
    rating: 5,
  },
  {
    name: "Abena Serwaa",
    role: "Mother of a Toddler student",
    image: "/images/abena-serwaa.jpg",
    content:
      "The patience and respect the teachers show for each child’s natural pace is exactly what we wanted. My toddler is always excited to go to school!",
    rating: 5,
  },
  {
    name: "Kwame Nkansah",
    role: "Father of a Primary student",
    image: "/images/kwame-nkansah.jpg",
    content:
      "The teachers here really understand and support each child’s unique journey. The progress reports reflect growth not just in academics, but in character and social skills too.",
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
