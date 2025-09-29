import { GraduationCap, Award, Clock } from "lucide-react"

const faculty = [
  {
    name: "Maria Johnson",
    role: "Head of School",
    image: "/professional-woman-teacher.png",
    credentials: "AMI Diploma",
    experience: "15 years experience",
    specialization: "Montessori Leadership",
  },
  {
    name: "David Chen",
    role: "Primary Guide",
    image: "/professional-man-teacher.png",
    credentials: "AMI Diploma",
    experience: "8 years experience",
    specialization: "Early Childhood Development",
  },
  {
    name: "Sarah Williams",
    role: "Toddler Guide",
    image: "/professional-woman-teacher-smiling.jpg",
    credentials: "AMI Diploma",
    experience: "5 years experience",
    specialization: "Infant & Toddler Development",
  },
  {
    name: "Michael Brown",
    role: "Elementary Guide",
    image: "/placeholder-bhf0g.png",
    credentials: "AMI Diploma",
    experience: "10 years experience",
    specialization: "Cosmic Education",
  },
]

export default function Faculty() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Meet Our Faculty
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
            Our AMI-certified teachers are passionate about Montessori education and dedicated to each child's
            development.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculty.map((teacher, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <img
                  src={teacher.image || "/placeholder.svg"}
                  alt={teacher.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-border group-hover:border-primary/50 transition-colors duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <h3 className="font-serif text-xl font-bold mb-1 text-foreground">{teacher.name}</h3>
              <p className="text-primary mb-3 font-medium">{teacher.role}</p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{teacher.credentials}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{teacher.experience}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{teacher.specialization}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
