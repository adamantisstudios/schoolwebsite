import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "School Calendar | Sunshine Montessori School",
  description: "View important dates, events, and holidays for the Sunshine Montessori School academic year.",
}

const currentMonth = "March 2024"

const calendarEvents = [
  {
    date: "2024-03-15",
    title: "Parent Education Workshop",
    time: "7:00 PM - 8:30 PM",
    location: "School Library",
    type: "workshop",
    description: "Montessori at Home: Supporting Your Child's Independence",
  },
  {
    date: "2024-03-22",
    title: "Spring Parent-Teacher Conferences",
    time: "3:00 PM - 7:00 PM",
    location: "Individual Classrooms",
    type: "conference",
    description: "Individual meetings to discuss your child's progress",
  },
  {
    date: "2024-03-28",
    title: "Family Science Night",
    time: "6:00 PM - 8:00 PM",
    location: "Elementary Building",
    type: "event",
    description: "Hands-on science experiments for the whole family",
  },
  {
    date: "2024-04-05",
    title: "Earth Day Celebration",
    time: "4:00 PM - 6:00 PM",
    location: "School Garden",
    type: "celebration",
    description: "Garden party and environmental awareness activities",
  },
  {
    date: "2024-04-12",
    title: "Spring Break",
    time: "All Day",
    location: "No School",
    type: "holiday",
    description: "School closed for spring break",
  },
  {
    date: "2024-04-19",
    title: "Art Exhibition Opening",
    time: "5:00 PM - 7:00 PM",
    location: "Main Gallery",
    type: "exhibition",
    description: "Showcase of student artwork from all programs",
  },
]

const eventTypes = {
  workshop: { color: "bg-blue-100 text-blue-800", label: "Workshop" },
  conference: { color: "bg-green-100 text-green-800", label: "Conference" },
  event: { color: "bg-purple-100 text-purple-800", label: "Event" },
  celebration: { color: "bg-orange-100 text-orange-800", label: "Celebration" },
  holiday: { color: "bg-red-100 text-red-800", label: "Holiday" },
  exhibition: { color: "bg-amber-100 text-amber-800", label: "Exhibition" },
}

const importantDates = [
  { date: "March 29 - April 12", event: "Spring Break", type: "No School" },
  { date: "May 15", event: "Kindergarten Graduation", type: "Celebration" },
  { date: "May 22", event: "Elementary Moving Up Ceremony", type: "Celebration" },
  { date: "May 29", event: "Last Day of School", type: "Academic" },
  { date: "June 3-7", event: "Summer Camp Week 1", type: "Program" },
  { date: "August 26", event: "New Family Orientation", type: "Orientation" },
  { date: "August 28", event: "First Day of School 2024-25", type: "Academic" },
]

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-50 to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">School Calendar</h1>
            <p className="text-xl text-sage-700 leading-relaxed mb-8">
              Stay informed about important dates, events, and activities throughout the school year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-sage-600 hover:bg-sage-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Calendar
              </Button>
              <Button variant="outline" className="border-sage-300 text-sage-700 hover:bg-sage-100 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Subscribe to Calendar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Month Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-sage-900 mb-4">Upcoming Events</h2>
            <p className="text-sage-600">{currentMonth}</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {calendarEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold text-center min-w-[80px]">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-sage-900">{event.title}</h3>
                        <Badge className={eventTypes[event.type as keyof typeof eventTypes].color}>
                          {eventTypes[event.type as keyof typeof eventTypes].label}
                        </Badge>
                      </div>

                      <p className="text-sage-600 mb-3">{event.description}</p>

                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-sage-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-sage-900 mb-4">Important Dates</h2>
            <p className="text-sage-600">Key dates for the academic year</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {importantDates.map((item, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sage-900 mb-1">{item.event}</h3>
                        <p className="text-sage-600">{item.date}</p>
                      </div>
                      <Badge variant="outline" className="border-amber-200 text-amber-700">
                        {item.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Integration */}
      <section className="py-20 bg-sage-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif mb-6">Never Miss an Event</h2>
          <p className="text-xl text-sage-200 mb-8 max-w-2xl mx-auto">
            Add our school calendar to your personal calendar to stay up-to-date with all events and important dates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-sage-300 text-white hover:bg-sage-800 bg-transparent">
              Add to Google Calendar
            </Button>
            <Button variant="outline" className="border-sage-300 text-white hover:bg-sage-800 bg-transparent">
              Add to Outlook
            </Button>
            <Button variant="outline" className="border-sage-300 text-white hover:bg-sage-800 bg-transparent">
              Download iCal
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
