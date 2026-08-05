import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award, Heart, BookOpen, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Sunshine Montessori School",
  description:
    "Learn about our history, mission, and commitment to authentic Montessori education that nurtures the whole child.",
}

const milestones = [
  { year: "2010", event: "Sunshine Montessori School founded with 15 students" },
  { year: "2012", event: "Expanded to include Elementary program" },
  { year: "2015", event: "Added Toddler program and new campus building" },
  { year: "2018", event: "Achieved AMI recognition and accreditation" },
  { year: "2020", event: "Launched outdoor education program" },
  { year: "2023", event: "Celebrating 13 years of Montessori excellence" },
]

const values = [
  {
    icon: Heart,
    title: "Respect for the Child",
    description: "We honor each child as a unique individual with their own timeline for development and learning.",
  },
  {
    icon: BookOpen,
    title: "Prepared Environment",
    description: "Our carefully designed spaces encourage independence, exploration, and natural learning.",
  },
  {
    icon: Users,
    title: "Community Partnership",
    description: "We work closely with families to create a supportive community that extends beyond the classroom.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "We cultivate appreciation for diversity and understanding of our interconnected world.",
  },
  {
    icon: Award,
    title: "Excellence in Education",
    description:
      "We maintain the highest standards in Montessori education through continuous learning and improvement.",
  },
  {
    icon: Calendar,
    title: "Lifelong Learning",
    description: "We foster a love of learning that extends far beyond the school years.",
  },
]

const accreditations = [
  { name: "Association Montessori Internationale (AMI)", logo: "/ami-logo.jpg" },
  { name: "American Montessori Society (AMS)", logo: "/ams-logo.jpg" },
  { name: "National Association for the Education of Young Children", logo: "/naeyc-logo.jpg" },
  { name: "Independent Schools Association", logo: "/isa-logo.jpg" },
]

const leadershipTeam = [
  {
    name: "Dr. Akosua Mensah",
    role: "Head of School",
    image: "/leadership-akosua-mensah.jpg",
    credentials: "Ph.D. Education, AMI Diploma",
    experience: "20+ years",
  },
  {
    name: "Kwame Asante",
    role: "Academic Director",
    image: "/leadership-kwame-asante.jpg",
    credentials: "M.Ed. Curriculum, AMI Primary",
    experience: "15+ years",
  },
  {
    name: "Ama Osei",
    role: "Student Affairs Director",
    image: "/leadership-ama-osei.jpg",
    credentials: "M.A. Child Psychology",
    experience: "12+ years",
  },
  {
    name: "Kofi Boateng",
    role: "Operations Manager",
    image: "/leadership-kofi-boateng.jpg",
    credentials: "MBA, Educational Leadership",
    experience: "10+ years",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-sage-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">About Sunshine Montessori School</h1>
              <p className="text-xl text-sage-700 leading-relaxed mb-8">
                For over a decade, we have been dedicated to providing authentic Montessori education that honors the
                natural development of children and fosters a lifelong love of learning.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2">Founded 2010</Badge>
                <Badge className="bg-sage-100 text-sage-800 px-4 py-2">AMI Recognized</Badge>
                <Badge className="bg-stone-100 text-stone-800 px-4 py-2">150+ Students</Badge>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about-school-building.jpg"
                alt="Sunshine Montessori School building"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif text-sage-900 mb-4">Our Mission</h2>
                <p className="text-sage-700 leading-relaxed">
                  To provide an authentic Montessori education that respects the natural development of each child,
                  fostering independence, creativity, and a lifelong love of learning within a nurturing community
                  environment.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-4">Our Vision</h2>
                <p className="text-amber-700 leading-relaxed">
                  To cultivate confident, compassionate, and capable individuals who will contribute positively to their
                  communities and the world, equipped with the skills and character to thrive in an ever-changing global
                  society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-sage-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do and shape the culture of our school community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-900 mb-3">{value.title}</h3>
                  <p className="text-sage-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-sage-900 mb-6">Our Journey</h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              From humble beginnings to becoming a recognized leader in Montessori education.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-amber-200 transform md:-translate-x-0.5"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-amber-500 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 z-10"></div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="bg-sage-50 border-sage-200">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-amber-600 mb-2">{milestone.year}</div>
                        <p className="text-sage-700">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 bg-sage-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Accreditations & Memberships</h2>
            <p className="text-xl text-sage-200 max-w-3xl mx-auto">
              We maintain the highest standards through our affiliations with leading educational organizations.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {accreditations.map((accreditation, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 mb-4 h-24 flex items-center justify-center">
                  <Image
                    src={accreditation.logo || "/placeholder.svg"}
                    alt={accreditation.name}
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-sage-200">{accreditation.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-sage-900 mb-6">Meet Our Leadership Team</h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              Our experienced leadership team brings decades of Montessori expertise and educational excellence to guide
              our school community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((leader, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={leader.image || "/placeholder.svg?height=128&width=128&query=professional teacher portrait"}
                      alt={leader.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-900 mb-2">{leader.name}</h3>
                  <p className="text-amber-600 font-medium mb-3">{leader.role}</p>
                  <div className="space-y-1 text-sm text-sage-600">
                    <p>{leader.credentials}</p>
                    <p>{leader.experience}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team CTA */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-sage-900 mb-6">Meet Our Leadership Team</h2>
          <p className="text-xl text-sage-600 mb-8 max-w-2xl mx-auto">
            Learn more about the dedicated educators and administrators who guide our school community.
          </p>
          <a
            href="/faculty"
            className="inline-flex items-center bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Meet Our Faculty
          </a>
        </div>
      </section>
    </div>
  )
}
