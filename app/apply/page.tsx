import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ApplicationForm from "@/components/forms/application-form"

export const metadata: Metadata = {
  title: "Apply Now | Sunshine Montessori School",
  description:
    "Submit your application to join our Montessori community. Start your child's journey of discovery and learning.",
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">Apply to Sunshine Montessori</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              Begin your child's Montessori journey with us. Complete the application below to start the admission
              process.
            </p>
          </div>

          <ApplicationForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
