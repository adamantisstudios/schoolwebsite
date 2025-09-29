"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users } from "lucide-react"
import { sendToWhatsApp } from "@/utils/whatsapp"

export default function ScheduleTourPage() {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    childName: "",
    childAge: "",
    program: "",
    preferredDate: "",
    preferredTime: "",
    numberOfChildren: "",
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const message = `🏫 SCHOOL TOUR REQUEST 🏫

👨‍👩‍👧‍👦 PARENT INFORMATION:
• Parent Name: ${formData.parentName}
• Email: ${formData.email}
• Phone: ${formData.phone}

👶 CHILD INFORMATION:
• Child Name: ${formData.childName || "Not provided"}
• Child Age: ${formData.childAge || "Not provided"}
• Number of Children: ${formData.numberOfChildren || "Not provided"}

🏫 TOUR DETAILS:
• Program of Interest: ${formData.program || "Not specified"}
• Preferred Date: ${formData.preferredDate || "Flexible"}
• Preferred Time: ${formData.preferredTime || "Flexible"}

📝 SPECIAL REQUESTS:
${formData.specialRequests || "None"}

📅 Request Date: ${new Date().toLocaleDateString()}

Tour Schedule: Monday-Friday, 9:00 AM - 11:00 AM & 2:00 PM - 4:00 PM
Duration: 45-60 minutes including Q&A`

    try {
      await sendToWhatsApp(message)
      alert("Tour request submitted successfully! We will contact you soon to confirm your tour.")
      // Reset form
      setFormData({
        parentName: "",
        email: "",
        phone: "",
        childName: "",
        childAge: "",
        program: "",
        preferredDate: "",
        preferredTime: "",
        numberOfChildren: "",
        specialRequests: "",
      })
    } catch (error) {
      alert("There was an error submitting your tour request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Schedule a Tour</h1>
            <p className="text-xl text-gray-600 mb-8 text-balance">
              Experience our Montessori environment firsthand. Schedule a personalized tour to see our classrooms, meet
              our teachers, and discover how we nurture your child's love for learning.
            </p>
          </div>
        </section>

        {/* Tour Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Tour Schedule</h3>
                  <p className="text-gray-600">
                    Monday - Friday
                    <br />
                    9:00 AM - 11:00 AM
                    <br />
                    2:00 PM - 4:00 PM
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Duration</h3>
                  <p className="text-gray-600">
                    Approximately 45-60 minutes
                    <br />
                    Including Q&A session
                    <br />
                    with our educators
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Group Size</h3>
                  <p className="text-gray-600">
                    Small groups of 2-4 families
                    <br />
                    Private tours available
                    <br />
                    upon request
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tour Form */}
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Request Your Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                        <Input
                          id="parentName"
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="numberOfChildren">Number of Children</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, numberOfChildren: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 child</SelectItem>
                            <SelectItem value="2">2 children</SelectItem>
                            <SelectItem value="3">3 children</SelectItem>
                            <SelectItem value="4+">4+ children</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="childName">Child's Name</Label>
                        <Input
                          id="childName"
                          value={formData.childName}
                          onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="childAge">Child's Age</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, childAge: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18-36 months">18-36 months</SelectItem>
                            <SelectItem value="3 years">3 years</SelectItem>
                            <SelectItem value="4 years">4 years</SelectItem>
                            <SelectItem value="5 years">5 years</SelectItem>
                            <SelectItem value="6 years">6 years</SelectItem>
                            <SelectItem value="7+ years">7+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="program">Program of Interest</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, program: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toddler">Toddler Community (18 months - 3 years)</SelectItem>
                          <SelectItem value="primary">Primary Program (3-6 years)</SelectItem>
                          <SelectItem value="elementary">Elementary Program (6-12 years)</SelectItem>
                          <SelectItem value="summer">Summer Camp</SelectItem>
                          <SelectItem value="not-sure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredDate">Preferred Date</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                            <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                            <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                            <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                            <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests or Questions</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        placeholder="Any specific areas you'd like to focus on during the tour, accessibility needs, or questions you have..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Request..." : "Request Tour via WhatsApp"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
