import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, GraduationCap, Heart, Users, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Faculty | Sunshine Montessori School",
  description:
    "Meet our dedicated Montessori-trained educators who guide children through their learning journey with expertise and care.",
}

const facultyMembers = [
  {
    name: "Dr. Maria Rodriguez",
    role: "Head of School",
    image: "/faculty-maria-rodriguez.jpg",
    credentials: ["Ph.D. in Early Childhood Education", "AMI Montessori Diploma", "15+ years experience"],
    specialties: ["Montessori Philosophy", "Educational Leadership", "Parent Education"],
    bio: "Dr. Rodriguez brings over 15 years of Montessori education experience to our school. She holds a Ph.D. in Early Childhood Education and is passionate about creating environments where children can flourish naturally.",
    email: "maria@sunshinemontessori.edu",
    phone: "(555) 123-4567",
  },
  {
    name: "Sarah Chen",
    role: "Primary Program Director",
    image: "/faculty-sarah-chen.jpg",
    credentials: ["M.Ed. Early Childhood", "AMI Primary Diploma", "12 years experience"],
    specialties: ["Language Development", "Mathematics", "Cultural Studies"],
    bio: "Sarah specializes in the Primary program and has a gift for helping children develop independence and confidence. Her classroom is a model of the prepared environment.",
    email: "sarah@sunshinemontessori.edu",
    phone: "(555) 123-4568",
  },
  {
    name: "Michael Thompson",
    role: "Elementary Program Director",
    image: "/faculty-michael-thompson.jpg",
    credentials: ["M.A. Elementary Education", "AMI Elementary Diploma", "10 years experience"],
    specialties: ["Science", "History", "Project-Based Learning"],
    bio: "Michael brings enthusiasm and creativity to elementary education. He excels at fostering the natural curiosity of elementary-aged children through engaging, hands-on experiences.",
    email: "michael@sunshinemontessori.edu",
    phone: "(555) 123-4569",
  },
  {
    name: "Lisa Park",
    role: "Toddler Program Director",
    image: "/faculty-lisa-park.jpg",
    credentials: ["B.A. Child Development", "AMI Assistants to Infancy", "8 years experience"],
    specialties: ["Infant Development", "Practical Life", "Movement"],
    bio: "Lisa has a special gift for working with our youngest learners. She creates nurturing environments that support toddlers as they develop independence and language skills.",
    email: "lisa@sunshinemontessori.edu",
    phone: "(555) 123-4570",
  },
  {
    name: "David Kim",
    role: "Music & Movement Specialist",
    image: "/faculty-david-kim.jpg",
    credentials: ["B.M. Music Education", "Orff Certification", "6 years experience"],
    specialties: ["Music Education", "Movement", "Cultural Arts"],
    bio: "David brings joy and creativity to our school through music and movement. He helps children express themselves and develop rhythm, coordination, and appreciation for the arts.",
    email: "david@sunshinemontessori.edu",
    phone: "(555) 123-4571",
  },
  {
    name: "Jennifer Walsh",
    role: "Learning Support Specialist",
    image: "/faculty-jennifer-walsh.jpg",
    credentials: ["M.Ed. Special Education", "Montessori Training", "9 years experience"],
    specialties: ["Learning Differences", "Individual Support", "Family Collaboration"],
    bio: "Jennifer ensures that every child receives the support they need to succeed. She works closely with families and teachers to create individualized learning plans.",
    email: "jennifer@sunshinemontessori.edu",
    phone: "(555) 123-4572",
  },
]

const stats = [
  { icon: GraduationCap, label: "Average Experience", value: "10+ Years" },
  { icon: Heart, label: "Montessori Trained", value: "100%" },
  { icon: Users, label: "Student-Teacher Ratio", value: "8:1" },
  { icon: BookOpen, label: "Continuing Education", value: "Annual" },
]

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-50 to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">Meet Our Dedicated Faculty</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              Our passionate educators are the heart of our Montessori community. Each teacher brings specialized
              training, years of experience, and a deep commitment to nurturing every child's potential.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-sage-900 mb-2">{stat.value}</div>
                <div className="text-sage-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:gap-12">
            {facultyMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}>
                    <div className={`relative h-80 md:h-auto ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-4">
                        <h3 className="text-2xl font-serif text-sage-900 mb-2">{member.name}</h3>
                        <p className="text-lg text-amber-600 font-medium mb-4">{member.role}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-sage-800 mb-2">Credentials</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {member.credentials.map((credential, credIndex) => (
                            <Badge key={credIndex} variant="secondary" className="bg-sage-100 text-sage-700">
                              {credential}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-sage-800 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {member.specialties.map((specialty, specIndex) => (
                            <Badge key={specIndex} variant="outline" className="border-amber-200 text-amber-700">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sage-600 leading-relaxed mb-6">{member.bio}</p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-2 text-sage-600 hover:text-amber-600 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </a>
                        <a
                          href={`tel:${member.phone}`}
                          className="inline-flex items-center gap-2 text-sage-600 hover:text-amber-600 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 bg-sage-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Join Our Teaching Community</h2>
          <p className="text-xl text-sage-200 mb-8 max-w-2xl mx-auto">
            Are you a passionate educator interested in Montessori education? We're always looking for dedicated
            teachers to join our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/careers"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="mailto:careers@sunshinemontessori.edu"
              className="border border-sage-300 hover:bg-sage-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Send Your Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
