"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { sendToWhatsApp } from "@/utils/whatsapp"
import { Sun, Calendar, Clock } from "lucide-react"

export default function RegisterSummerPage() {
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    parentName: "",
    email: "",
    phone: "",
    address: "",
    session: "",
    medicalInfo: "",
    emergencyContact: "",
    emergencyPhone: "",
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const getSessionDetails = (session: string) => {
    switch (session) {
      case "session1":
        return { name: "Session 1", dates: "June 3 - June 28", cost: "GHS 800" }
      case "session2":
        return { name: "Session 2", dates: "July 1 - July 26", cost: "GHS 800" }
      case "full-summer":
        return { name: "Full Summer", dates: "June 3 - August 23", cost: "GHS 1,400" }
      default:
        return { name: "", dates: "", cost: "" }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const sessionDetails = getSessionDetails(formData.session)

    const message = `☀️ SUMMER CAMP REGISTRATION ☀️

👶 CHILD INFORMATION:
• Name: ${formData.childName}
• Age: ${formData.childAge}

👨‍👩‍👧‍👦 PARENT INFORMATION:
• Parent Name: ${formData.parentName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Address: ${formData.address}

🏕️ CAMP SESSION:
• Session: ${sessionDetails.name}
• Dates: ${sessionDetails.dates}
• Cost: ${sessionDetails.cost}

🚨 EMERGENCY CONTACT:
• Name: ${formData.emergencyContact}
• Phone: ${formData.emergencyPhone}

🏥 MEDICAL INFORMATION:
${formData.medicalInfo || "None provided"}

📅 Registration Date: ${new Date().toLocaleDateString()}

Program: Summer Camp (Ages 3-12 years)
Schedule: 8:00 AM - 4:00 PM`

    try {
      await sendToWhatsApp(message)
      alert("Summer camp registration submitted successfully! We will contact you soon.")
      // Reset form
      setFormData({
        childName: "",
        childAge: "",
        parentName: "",
        email: "",
        phone: "",
        address: "",
        session: "",
        medicalInfo: "",
        emergencyContact: "",
        emergencyPhone: "",
        agreeTerms: false,
      })
    } catch (error) {
      alert("There was an error submitting your registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />

      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Sun className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold text-foreground">Summer Camp Registration</h1>
                <p className="text-yellow-600 font-medium text-xl">Ages 3-12 years</p>
              </div>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Register your child for an exciting summer of learning, exploration, and fun!
            </p>
          </div>

          {/* Session Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <CardTitle>Session 1</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-2">June 3 - June 28</p>
                <p className="text-2xl font-bold text-yellow-600">GHS 800</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <CardTitle>Session 2</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-2">July 1 - July 26</p>
                <p className="text-2xl font-bold text-yellow-600">GHS 800</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <CardTitle>Full Summer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-2">June 3 - August 23</p>
                <p className="text-2xl font-bold text-yellow-600">GHS 1,400</p>
                <p className="text-sm text-yellow-700 font-medium">Save GHS 200!</p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>Please fill out all required fields to complete your registration.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Child Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Child Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="childName">Child's Full Name *</Label>
                      <Input
                        id="childName"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="childAge">Child's Age *</Label>
                      <Select
                        value={formData.childAge}
                        onValueChange={(value) => setFormData({ ...formData, childAge: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-years">3 years</SelectItem>
                          <SelectItem value="4-years">4 years</SelectItem>
                          <SelectItem value="5-years">5 years</SelectItem>
                          <SelectItem value="6-years">6 years</SelectItem>
                          <SelectItem value="7-years">7 years</SelectItem>
                          <SelectItem value="8-years">8 years</SelectItem>
                          <SelectItem value="9-years">9 years</SelectItem>
                          <SelectItem value="10-years">10 years</SelectItem>
                          <SelectItem value="11-years">11 years</SelectItem>
                          <SelectItem value="12-years">12 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Session Selection */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Camp Session Selection *</h3>
                  <RadioGroup
                    value={formData.session}
                    onValueChange={(value) => setFormData({ ...formData, session: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="session1" id="session1" />
                      <Label htmlFor="session1" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Session 1</p>
                            <p className="text-sm text-muted-foreground">June 3 - June 28</p>
                          </div>
                          <p className="font-bold text-yellow-600">GHS 800</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="session2" id="session2" />
                      <Label htmlFor="session2" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Session 2</p>
                            <p className="text-sm text-muted-foreground">July 1 - July 26</p>
                          </div>
                          <p className="font-bold text-yellow-600">GHS 800</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
                      <RadioGroupItem value="full-summer" id="full-summer" />
                      <Label htmlFor="full-summer" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Full Summer (Best Value!)</p>
                            <p className="text-sm text-muted-foreground">June 3 - August 23</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-yellow-600">GHS 1,400</p>
                            <p className="text-xs text-yellow-700">Save GHS 200</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Parent Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Parent/Guardian Information</h3>
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
                      <Label htmlFor="address">Home Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <Label htmlFor="medicalInfo">Medical Information & Allergies</Label>
                  <Textarea
                    id="medicalInfo"
                    placeholder="Please list any medical conditions, allergies, or special needs..."
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    I agree to the summer camp terms and conditions and payment policies *
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  disabled={isSubmitting || !formData.agreeTerms || !formData.session}
                >
                  {isSubmitting ? "Submitting Registration..." : "Register for Summer Camp"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
