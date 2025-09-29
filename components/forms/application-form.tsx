"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, User, Baby, GraduationCap, FileText } from "lucide-react"
import React from "react"

interface FormData {
  // Child Information
  childFirstName: string
  childLastName: string
  childDateOfBirth: string
  childGender: string

  // Parent/Guardian Information
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentAddress: string
  parentCity: string
  parentState: string
  parentZip: string

  // Program Information
  desiredProgram: string
  startDate: string
  fullTime: boolean

  // Additional Information
  previousSchool: string
  specialNeeds: string
  allergies: string
  emergencyContact: string
  emergencyPhone: string

  // Agreements
  handbookAgreement: boolean
  tuitionAgreement: boolean
  photoConsent: boolean
}

const initialFormData: FormData = {
  childFirstName: "",
  childLastName: "",
  childDateOfBirth: "",
  childGender: "",
  parentFirstName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhone: "",
  parentAddress: "",
  parentCity: "",
  parentState: "",
  parentZip: "",
  desiredProgram: "",
  startDate: "",
  fullTime: false,
  previousSchool: "",
  specialNeeds: "",
  allergies: "",
  emergencyContact: "",
  emergencyPhone: "",
  handbookAgreement: false,
  tuitionAgreement: false,
  photoConsent: false,
}

const steps = [
  { id: 1, title: "Child Information", icon: Baby },
  { id: 2, title: "Parent Information", icon: User },
  { id: 3, title: "Program Selection", icon: GraduationCap },
  { id: 4, title: "Additional Details", icon: FileText },
]

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    switch (step) {
      case 1:
        if (!formData.childFirstName) newErrors.childFirstName = "First name is required"
        if (!formData.childLastName) newErrors.childLastName = "Last name is required"
        if (!formData.childDateOfBirth) newErrors.childDateOfBirth = "Date of birth is required"
        if (!formData.childGender) newErrors.childGender = "Gender is required"
        break
      case 2:
        if (!formData.parentFirstName) newErrors.parentFirstName = "First name is required"
        if (!formData.parentLastName) newErrors.parentLastName = "Last name is required"
        if (!formData.parentEmail) newErrors.parentEmail = "Email is required"
        if (!formData.parentPhone) newErrors.parentPhone = "Phone is required"
        if (!formData.parentAddress) newErrors.parentAddress = "Address is required"
        break
      case 3:
        if (!formData.desiredProgram) newErrors.desiredProgram = "Program selection is required"
        if (!formData.startDate) newErrors.startDate = "Start date is required"
        break
      case 4:
        if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact is required"
        if (!formData.emergencyPhone) newErrors.emergencyPhone = "Emergency phone is required"
        if (!formData.handbookAgreement) newErrors.handbookAgreement = "Agreement is required"
        if (!formData.tuitionAgreement) newErrors.tuitionAgreement = "Agreement is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const progress = (currentStep / steps.length) * 100

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-sage-900 mb-4">Application Submitted Successfully!</h2>
          <p className="text-sage-600 mb-6">
            Thank you for your application. We will review your submission and contact you within 2-3 business days to
            schedule a tour and discuss next steps.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 font-medium">
              Application ID: #MS-2024-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </p>
            <p className="text-amber-700 text-sm mt-1">Please save this ID for your records</p>
          </div>
          <Button onClick={() => (window.location.href = "/")} className="bg-sage-600 hover:bg-sage-700">
            Return to Homepage
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif text-sage-900">Application Form</h2>
            <span className="text-sm text-sage-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${step.id <= currentStep ? "text-sage-900" : "text-sage-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                        ? "bg-amber-500 text-white"
                        : "bg-sage-200 text-sage-500"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep - 1].icon &&
              React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 text-amber-600" })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Step 1: Child Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childFirstName">Child's First Name *</Label>
                  <Input
                    id="childFirstName"
                    value={formData.childFirstName}
                    onChange={(e) => updateFormData("childFirstName", e.target.value)}
                    className={errors.childFirstName ? "border-red-500" : ""}
                    aria-describedby={errors.childFirstName ? "childFirstName-error" : undefined}
                  />
                  {errors.childFirstName && (
                    <p id="childFirstName-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.childFirstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="childLastName">Child's Last Name *</Label>
                  <Input
                    id="childLastName"
                    value={formData.childLastName}
                    onChange={(e) => updateFormData("childLastName", e.target.value)}
                    className={errors.childLastName ? "border-red-500" : ""}
                    aria-describedby={errors.childLastName ? "childLastName-error" : undefined}
                  />
                  {errors.childLastName && (
                    <p id="childLastName-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.childLastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childDateOfBirth">Date of Birth *</Label>
                  <Input
                    id="childDateOfBirth"
                    type="date"
                    value={formData.childDateOfBirth}
                    onChange={(e) => updateFormData("childDateOfBirth", e.target.value)}
                    className={errors.childDateOfBirth ? "border-red-500" : ""}
                    aria-describedby={errors.childDateOfBirth ? "childDateOfBirth-error" : undefined}
                  />
                  {errors.childDateOfBirth && (
                    <p id="childDateOfBirth-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.childDateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Gender *</Label>
                  <RadioGroup
                    value={formData.childGender}
                    onValueChange={(value) => updateFormData("childGender", value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                  {errors.childGender && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.childGender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Parent Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentFirstName">Parent/Guardian First Name *</Label>
                  <Input
                    id="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={(e) => updateFormData("parentFirstName", e.target.value)}
                    className={errors.parentFirstName ? "border-red-500" : ""}
                  />
                  {errors.parentFirstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.parentFirstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="parentLastName">Parent/Guardian Last Name *</Label>
                  <Input
                    id="parentLastName"
                    value={formData.parentLastName}
                    onChange={(e) => updateFormData("parentLastName", e.target.value)}
                    className={errors.parentLastName ? "border-red-500" : ""}
                  />
                  {errors.parentLastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.parentLastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => updateFormData("parentEmail", e.target.value)}
                    className={errors.parentEmail ? "border-red-500" : ""}
                  />
                  {errors.parentEmail && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.parentEmail}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => updateFormData("parentPhone", e.target.value)}
                    className={errors.parentPhone ? "border-red-500" : ""}
                  />
                  {errors.parentPhone && (
                    <p id="parentPhone-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.parentPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="parentAddress">Address *</Label>
                <Input
                  id="parentAddress"
                  value={formData.parentAddress}
                  onChange={(e) => updateFormData("parentAddress", e.target.value)}
                  className={errors.parentAddress ? "border-red-500" : ""}
                />
                {errors.parentAddress && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.parentAddress}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="parentCity">City</Label>
                  <Input
                    id="parentCity"
                    value={formData.parentCity}
                    onChange={(e) => updateFormData("parentCity", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="parentState">State</Label>
                  <Input
                    id="parentState"
                    value={formData.parentState}
                    onChange={(e) => updateFormData("parentState", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="parentZip">ZIP Code</Label>
                  <Input
                    id="parentZip"
                    value={formData.parentZip}
                    onChange={(e) => updateFormData("parentZip", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Program Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="desiredProgram">Desired Program *</Label>
                <Select
                  value={formData.desiredProgram}
                  onValueChange={(value) => updateFormData("desiredProgram", value)}
                >
                  <SelectTrigger className={errors.desiredProgram ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toddler">Toddler Program (18 months - 3 years)</SelectItem>
                    <SelectItem value="primary">Primary Program (3 - 6 years)</SelectItem>
                    <SelectItem value="elementary">Elementary Program (6 - 12 years)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.desiredProgram && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.desiredProgram}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Desired Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData("startDate", e.target.value)}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p id="startDate-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="fullTime"
                    checked={formData.fullTime}
                    onCheckedChange={(checked) => updateFormData("fullTime", checked as boolean)}
                  />
                  <Label htmlFor="fullTime">Full-time enrollment (8:30 AM - 3:00 PM)</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="previousSchool">Previous School/Childcare Experience</Label>
                <Textarea
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => updateFormData("previousSchool", e.target.value)}
                  placeholder="Please describe any previous educational or childcare experiences..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                    className={errors.emergencyContact ? "border-red-500" : ""}
                  />
                  {errors.emergencyContact && (
                    <p id="emergencyContact-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                    className={errors.emergencyPhone ? "border-red-500" : ""}
                  />
                  {errors.emergencyPhone && (
                    <p id="emergencyPhone-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="specialNeeds">Special Needs or Accommodations</Label>
                <Textarea
                  id="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={(e) => updateFormData("specialNeeds", e.target.value)}
                  placeholder="Please describe any special needs, learning differences, or accommodations..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="allergies">Allergies or Medical Conditions</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  placeholder="Please list any allergies, medical conditions, or dietary restrictions..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-sage-900">Required Agreements</h3>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="handbookAgreement"
                    checked={formData.handbookAgreement}
                    onCheckedChange={(checked) => updateFormData("handbookAgreement", checked as boolean)}
                    className={errors.handbookAgreement ? "border-red-500" : ""}
                  />
                  <Label htmlFor="handbookAgreement" className="text-sm leading-relaxed">
                    I have read and agree to the Parent Handbook policies and procedures *
                  </Label>
                </div>
                {errors.handbookAgreement && (
                  <p className="text-red-500 text-sm flex items-center gap-1 ml-6">
                    <AlertCircle className="w-4 h-4" />
                    {errors.handbookAgreement}
                  </p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="tuitionAgreement"
                    checked={formData.tuitionAgreement}
                    onCheckedChange={(checked) => updateFormData("tuitionAgreement", checked as boolean)}
                    className={errors.tuitionAgreement ? "border-red-500" : ""}
                  />
                  <Label htmlFor="tuitionAgreement" className="text-sm leading-relaxed">
                    I understand and agree to the tuition and fee structure *
                  </Label>
                </div>
                {errors.tuitionAgreement && (
                  <p className="text-red-500 text-sm flex items-center gap-1 ml-6">
                    <AlertCircle className="w-4 h-4" />
                    {errors.tuitionAgreement}
                  </p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="photoConsent"
                    checked={formData.photoConsent}
                    onCheckedChange={(checked) => updateFormData("photoConsent", checked as boolean)}
                  />
                  <Label htmlFor="photoConsent" className="text-sm leading-relaxed">
                    I consent to my child being photographed for school activities and promotional materials
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent">
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="bg-sage-600 hover:bg-sage-700">
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-sage-600 hover:bg-sage-700">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
