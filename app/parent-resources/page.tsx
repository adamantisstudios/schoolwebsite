import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  FileText,
  Users,
  MessageSquare,
  Download,
  Clock,
  Bell,
  Heart,
  GraduationCap,
  Home,
  Utensils,
  MapPin,
  Mail,
  Phone,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Parent Resources | Sunshine Montessori School",
  description: "Access important resources, forms, calendars, and information for Sunshine Montessori School parents.",
}

const quickLinks = [
  { icon: Calendar, title: "School Calendar", href: "/calendar", description: "View important dates and events" },
  { icon: FileText, title: "Parent Handbook", href: "/handbook.pdf", description: "Complete guide to school policies" },
  { icon: Clock, title: "Daily Schedule", href: "/schedule", description: "Typical day structure by program" },
  { icon: Utensils, title: "Lunch Menu", href: "/lunch-menu", description: "Weekly meal plans and nutrition info" },
  { icon: Bell, title: "School Announcements", href: "/announcements", description: "Latest news and updates" },
  { icon: Users, title: "Parent Portal", href: "/portal", description: "Access grades, attendance, and more" },
]

const resources = [
  {
    category: "Getting Started",
    icon: Home,
    items: [
      { title: "New Family Orientation Guide", type: "PDF", size: "2.1 MB" },
      { title: "First Day Checklist", type: "PDF", size: "0.8 MB" },
      { title: "School Supply Lists by Program", type: "PDF", size: "1.2 MB" },
      { title: "Transportation Information", type: "PDF", size: "0.9 MB" },
    ],
  },
  {
    category: "Academic Resources",
    icon: GraduationCap,
    items: [
      { title: "Understanding Montessori Assessment", type: "PDF", size: "1.8 MB" },
      { title: "Supporting Learning at Home", type: "PDF", size: "2.3 MB" },
      { title: "Reading List by Age Group", type: "PDF", size: "1.1 MB" },
      { title: "Math Materials Guide for Parents", type: "PDF", size: "3.2 MB" },
    ],
  },
  {
    category: "Health & Wellness",
    icon: Heart,
    items: [
      { title: "Health and Safety Policies", type: "PDF", size: "1.9 MB" },
      { title: "Medication Administration Forms", type: "PDF", size: "0.7 MB" },
      { title: "Emergency Contact Forms", type: "PDF", size: "0.5 MB" },
      { title: "Allergy Management Plan", type: "PDF", size: "1.4 MB" },
    ],
  },
  {
    category: "Community & Events",
    icon: Users,
    items: [
      { title: "Parent Volunteer Opportunities", type: "PDF", size: "1.6 MB" },
      { title: "Field Trip Permission Forms", type: "PDF", size: "0.8 MB" },
      { title: "Fundraising Event Information", type: "PDF", size: "2.0 MB" },
      { title: "Parent Education Workshop Schedule", type: "PDF", size: "1.3 MB" },
    ],
  },
]

const upcomingEvents = [
  {
    date: "Mar 15",
    title: "Parent Education Workshop: Montessori at Home",
    time: "7:00 PM - 8:30 PM",
    location: "School Library",
  },
  {
    date: "Mar 22",
    title: "Spring Parent-Teacher Conferences",
    time: "3:00 PM - 7:00 PM",
    location: "Individual Classrooms",
  },
  {
    date: "Mar 28",
    title: "Family Science Night",
    time: "6:00 PM - 8:00 PM",
    location: "Elementary Building",
  },
  {
    date: "Apr 5",
    title: "Earth Day Celebration & Garden Party",
    time: "4:00 PM - 6:00 PM",
    location: "School Garden",
  },
]

const communicationChannels = [
  {
    icon: MessageSquare,
    title: "Weekly Newsletter",
    description: "Stay updated with classroom news, upcoming events, and important announcements.",
    action: "Subscribe",
    href: "/newsletter",
  },
  {
    icon: Users,
    title: "Parent Facebook Group",
    description: "Connect with other families, share experiences, and get quick answers to questions.",
    action: "Join Group",
    href: "https://facebook.com/groups/sunshinemontessori",
  },
  {
    icon: Bell,
    title: "School App Notifications",
    description: "Get instant alerts about weather closures, schedule changes, and urgent updates.",
    action: "Download App",
    href: "/app",
  },
]

export default function ParentResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-sage-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">Parent Resources</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              Everything you need to support your child's Montessori journey and stay connected with our school
              community.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-sage-900 mb-4">Quick Access</h2>
            <p className="text-sage-600">Frequently used resources and information</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <link.icon className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sage-900 mb-2">{link.title}</h3>
                      <p className="text-sm text-sage-600 mb-3">{link.description}</p>
                      <a
                        href={link.href}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                      >
                        Access →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Library */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-sage-900 mb-4">Document Library</h2>
            <p className="text-sage-600">Download important forms, guides, and resources</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resources.map((category, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-sage-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-sage-900">{category.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-sage-500" />
                          <div>
                            <p className="font-medium text-sage-900 text-sm">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-sage-500">{item.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Channels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-sage-900 mb-4">Stay Connected</h2>
            <p className="text-sage-600">Multiple ways to stay informed and engaged with our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {communicationChannels.map((channel, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <channel.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-900 mb-3">{channel.title}</h3>
                  <p className="text-sage-600 mb-6">{channel.description}</p>
                  <Button asChild className="bg-sage-600 hover:bg-sage-700">
                    <a href={channel.href}>{channel.action}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-sage-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Upcoming Events</h2>
            <p className="text-sage-200">Mark your calendar for these important dates</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-sage-800 border-sage-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-center flex-shrink-0">
                        <div className="bg-amber-500 text-sage-900 px-3 py-2 rounded-lg font-bold">{event.date}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sage-200">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="border-sage-300 text-white hover:bg-sage-800 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Calendar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-sage-900 mb-6">Need Additional Support?</h2>
          <p className="text-xl text-sage-600 mb-8 max-w-2xl mx-auto">
            Our parent coordinator is here to help you navigate resources and connect with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-sage-600 hover:bg-sage-700">
              <a href="mailto:parents@sunshinemontessori.edu">
                <Mail className="w-4 h-4 mr-2" />
                Email Parent Coordinator
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-sage-300 text-sage-700 hover:bg-sage-100 bg-transparent"
            >
              <a href="tel:+15551234569">
                <Phone className="w-4 h-4 mr-2" />
                Call (555) 123-4569
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
