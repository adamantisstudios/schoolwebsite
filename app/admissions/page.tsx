import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Calendar, FileText, Users, CheckCircle, Download, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const admissionSteps = [
  {
    step: 1,
    title: "Schedule a Tour",
    description: "Visit our campus to see our prepared environments and meet our faculty.",
    action: "Book your tour online or call us",
    icon: Calendar,
  },
  {
    step: 2,
    title: "Submit Application",
    description: "Complete our comprehensive application form with your child's information.",
    action: "Download and submit application",
    icon: FileText,
  },
  {
    step: 3,
    title: "Parent Interview",
    description: "Meet with our admissions team to discuss your child's needs and our philosophy.",
    action: "Schedule your interview",
    icon: Users,
  },
  {
    step: 4,
    title: "Child Visit",
    description: "Your child spends time in their prospective classroom to ensure a good fit.",
    action: "Arrange classroom visit",
    icon: CheckCircle,
  },
]

const tuitionRates = [
  {
    program: "Toddler Community",
    ageRange: "18 months - 3 years",
    schedule: "Half Day (8:00 AM - 12:00 PM)",
    monthlyTuition: "$1,200",
    annualTuition: "$12,000",
  },
  {
    program: "Primary Program",
    ageRange: "3 - 6 years",
    schedule: "Full Day (8:00 AM - 3:00 PM)",
    monthlyTuition: "$1,500",
    annualTuition: "$15,000",
    popular: true,
  },
  {
    program: "Elementary Program",
    ageRange: "6 - 12 years",
    schedule: "Full Day (8:00 AM - 3:30 PM)",
    monthlyTuition: "$1,600",
    annualTuition: "$16,000",
  },
]

const documents = [
  {
    name: "Application Form",
    description: "Complete application for admission",
    type: "PDF",
    size: "2.1 MB",
  },
  {
    name: "Health Records Form",
    description: "Medical and immunization records",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    name: "Parent Handbook",
    description: "Comprehensive guide to our policies",
    type: "PDF",
    size: "3.2 MB",
  },
  {
    name: "Tuition Payment Plan",
    description: "Payment options and financial aid info",
    type: "PDF",
    size: "1.5 MB",
  },
]

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">Admissions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join our Montessori community and give your child the foundation for lifelong learning
          </p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Admission Process
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
              Our admission process is designed to ensure the best fit for your child and family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {step.step}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-pretty">{step.description}</CardDescription>
                    <p className="text-primary font-medium text-sm">{step.action}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="mr-4 bg-sage-600 hover:bg-sage-700" asChild>
              <Link href="/contact">Schedule a Tour</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-sage-300 text-sage-700 hover:bg-sage-100 bg-transparent"
              asChild
            >
              <Link href="/apply">Start Application</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tuition & Fees */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Tuition & Fees
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
              Transparent pricing for quality Montessori education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tuitionRates.map((rate, index) => (
              <Card key={index} className={`relative ${rate.popular ? "border-primary/50 shadow-lg" : ""}`}>
                {rate.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{rate.program}</CardTitle>
                  <CardDescription>{rate.ageRange}</CardDescription>
                  <div className="text-2xl font-bold text-primary mt-4">
                    {rate.monthlyTuition}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{rate.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Annual: {rate.annualTuition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    {[
                      "All Montessori materials and supplies",
                      "Nutritious snacks and lunch",
                      "Field trips and special events",
                      "Progress reports and conferences",
                      "Extended care options available",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Financial Aid</h4>
                  <p className="text-muted-foreground text-sm mb-4 text-pretty">
                    We believe quality education should be accessible. Limited financial aid is available based on need
                    and availability.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn About Financial Aid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Required Documents
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
              Download the forms you'll need for the admission process
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{doc.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2 text-pretty">{doc.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-sage-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            Ready to Begin Your Montessori Journey?
          </h2>
          <p className="text-xl mb-8 text-sage-200 text-pretty">
            We'd love to welcome your family to our community. Start with a tour to see our beautiful learning
            environments in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600" asChild>
              <Link href="/contact">Schedule Your Tour</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-sage-300 text-white hover:bg-sage-800 bg-transparent"
              asChild
            >
              <Link href="/apply">Start Application</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
