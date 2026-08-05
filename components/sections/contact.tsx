"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendWhatsAppMessage } from "@/utils/whatsapp"

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const message = `*New Contact Form Submission*

*Name:* ${formData.firstName} ${formData.lastName}
*Email:* ${formData.email}
*Phone:* ${formData.phone}

*Message:*
${formData.message}

*Submitted from:* Contact Form - Homepage`

    await sendWhatsAppMessage(message)

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">Contact Us</h2>
            <p className="mb-8 text-primary-foreground/90 text-lg text-pretty">
              We'd love to hear from you! Schedule a tour or ask any questions about our programs.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-primary-foreground/90">
                    No. 15 Osu Oxford Street
                    <br />
                    Accra, Ghana
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-primary-foreground/90">024 279 9990</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-primary-foreground/90">info@montessoribloomgh.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">School Hours</h4>
                  <p className="text-primary-foreground/90">
                    Monday - Friday: 7:30 AM - 3:30 PM
                    <br />
                    Extended Care: 3:30 PM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-4">Find Us</h4>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.231069257881!2d-0.17456149999999998!3d5.6797033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a81c8f84411%3A0x3c76f82971c9e2f4!2sAdamantis%20Studios!5e0!3m2!1sen!2sgh!4v1759064745697!5m2!1sen!2sgh"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-background/10 backdrop-blur-sm p-8 rounded-lg border border-primary-foreground/20"
            >
              <h3 className="font-serif text-xl font-bold mb-6">Send us a message</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName" className="text-primary-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                    placeholder="Your first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-primary-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                    placeholder="Your last name"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="email" className="text-primary-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="phone" className="text-primary-foreground">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                  placeholder="Your phone number"
                  required
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="message" className="text-primary-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                  placeholder="Tell us about your child's age, interests, or any questions you have..."
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-background text-primary hover:bg-background/90">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
