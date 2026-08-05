import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react"
import ContactForm from "@/components/forms/contact-form"

export const metadata: Metadata = {
  title: "Contact Us | Montessori Bloom School",
  description:
    "Get in touch with Montessori Bloom School. Schedule a tour, ask questions, or learn more about our programs.",
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["No. 15 Osu Oxford Street", "Accra, Ghana"],
    action: "Get Directions",
    link: "https://maps.google.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["Main Office: 024 279 9990", "WhatsApp: 024 279 9990"],
    action: "Call Now",
    link: "tel:+233242799990",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@montessoribloomgh.com", "admissions@montessoribloomgh.com"],
    action: "Send Email",
    link: "mailto:info@montessoribloomgh.com",
  },
  {
    icon: Clock,
    title: "School Hours",
    details: ["Monday - Friday: 7:30 AM - 3:30 PM", "Extended Care: 3:30 PM - 6:00 PM"],
    action: "Schedule Tour",
    link: "/schedule-tour",
  },
]

const departments = [
  { value: "general", label: "General Inquiry" },
  { value: "admissions", label: "Admissions" },
  { value: "programs", label: "Programs & Curriculum" },
  { value: "tuition", label: "Tuition & Financial Aid" },
  { value: "events", label: "Events & Activities" },
  { value: "support", label: "Student Support Services" },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-50 to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">Contact Us</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              We'd love to hear from you! Whether you're interested in learning more about our programs, scheduling a
              tour, or have questions about Montessori education, we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <info.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-900 mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-4">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-sage-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <a
                    href={info.link}
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    {info.action}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.231069257881!2d-0.17456149999999998!3d5.6797033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a81c8f84411%3A0x3c76f82971c9e2f4!2sAdamantis%20Studios!5e0!3m2!1sen!2sgh!4v1759064745697!5m2!1sen!2sgh"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-t-lg"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-sage-900 mb-3">Visit Our Campus</h3>
                    <p className="text-sage-600 mb-4">
                      Our beautiful campus features spacious classrooms, outdoor learning areas, and a playground
                      designed specifically for different age groups.
                    </p>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule a Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="/admissions"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium text-sage-900">Start Application</span>
                      <span className="text-amber-600">→</span>
                    </a>
                    <a
                      href="/programs"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium text-sage-900">View Programs</span>
                      <span className="text-amber-600">→</span>
                    </a>
                    <a
                      href="/calendar"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium text-sage-900">School Calendar</span>
                      <span className="text-amber-600">→</span>
                    </a>
                    <a
                      href="/parent-resources"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium text-sage-900">Parent Resources</span>
                      <span className="text-amber-600">→</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-sage-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our school and programs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-sage-900 mb-2">What ages do you serve?</h3>
                <p className="text-sage-700">
                  We serve children from 18 months through 12 years old across our Toddler, Primary, and Elementary
                  programs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-sage-900 mb-2">Do you offer tours?</h3>
                <p className="text-sage-700">
                  Yes! We offer individual tours by appointment and group information sessions monthly. Contact us to
                  schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-sage-900 mb-2">What are your hours?</h3>
                <p className="text-sage-700">
                  Our school day runs from 8:30 AM to 3:00 PM, with extended care available from 7:30 AM to 6:00 PM.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-sage-900 mb-2">Is financial aid available?</h3>
                <p className="text-sage-700">
                  Yes, we offer need-based financial assistance. Please contact our admissions office for more
                  information about our aid program.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <a
              href="/faq"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              View All FAQs →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
