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
import { sendToWhatsApp } from "@/utils/whatsapp"
import { GraduationCap, Clock, Users } from "lucide-react"

export default function RegisterElementaryPage() {
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    parentName: "",
    email: "",
    phone: "",
    address: "",
    startDate: "",
    schedule: "",
    previousSchool: "",
    academicLevel: "",
    medicalInfo: "",
    emergencyContact: "",
    emergencyPhone: "",
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const message = `🎓 ELEMENTARY PROGRAM APPLICATION 🎓

👶 CHILD INFORMATION:
• Name: ${formData.childName}
• Age: ${formData.childAge}
• Preferred Start Date: ${formData.startDate}
• Schedule: ${formData.schedule}
• Previous School: ${formData.previousSchool || "None"}
• Academic Level: ${formData.academicLevel}

👨‍👩‍👧‍👦 PARENT INFORMATION:
• Parent Name: ${formData.parentName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Address: ${formData.address}

🚨 EMERGENCY CONTACT:
• Name: ${formData.emergencyContact}
• Phone: ${formData.emergencyPhone}

🏥 MEDICAL INFORMATION:
${formData.medicalInfo || "None provided"}

📅 Application Date: ${new Date().toLocaleDateString()}

Program: Elementary Program (Ages 6-12 years)
Schedule: Monday - Friday, 8:00 AM - 3:30 PM
Monthly Fee: GHS 1,500`

    try {
      await sendToWhatsApp(message)
      alert("Application submitted successfully! We will contact you soon.")
      // Reset form
      setFormData({
        childName: "",
        childAge: "",
        parentName: "",
        email: "",
        phone: "",
        address: "",
        startDate: "",
        schedule: "",
        previousSchool: "",
        academicLevel: "",
        medicalInfo: "",
        emergencyContact: "",
        emergencyPhone: "",
        agreeTerms: false,
      })
    } catch (error) {
      alert("There was an error submitting your application. Please try again.")
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
              <div className="bg-blue-100 p-3 rounded-full">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold text-foreground">Elementary Program Application</h1>
                <p className="text-blue-600 font-medium text-xl">Ages 6-12 years</p>
              </div>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete this application to enroll your child in our advanced Elementary Program.
            </p>
          </div>

          {/* Program Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Monday - Friday
                  <br />
                  8:00 AM - 3:30 PM
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Class Size</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Max 28 children
                  <br />
                  with 2 trained guides
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Monthly Fee</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-600">GHS 1,500</p>
                <p className="text-sm text-muted-foreground">Includes lunch & materials</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>Please fill out all required fields to complete your application.</CardDescription>
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
                    <div>
                      <Label htmlFor="startDate">Preferred Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="schedule">Preferred Schedule *</Label>
                      <Select
                        value={formData.schedule}
                        onValueChange={(value) => setFormData({ ...formData, schedule: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time (5 days)</SelectItem>
                          <SelectItem value="part-time-4">Part Time (4 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="previousSchool">Previous School *</Label>
                      <Input
                        id="previousSchool"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        placeholder="Name of previous school"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="academicLevel">Current Academic Level *</Label>
                      <Select
                        value={formData.academicLevel}
                        onValueChange={(value) => setFormData({ ...formData, academicLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="grade-1">Grade 1</SelectItem>
                          <SelectItem value="grade-2">Grade 2</SelectItem>
                          <SelectItem value="grade-3">Grade 3</SelectItem>
                          <SelectItem value="grade-4">Grade 4</SelectItem>
                          <SelectItem value="grade-5">Grade 5</SelectItem>
                          <SelectItem value="grade-6">Grade 6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                    I agree to the school's terms and conditions and enrollment policies *
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || !formData.agreeTerms}
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
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
