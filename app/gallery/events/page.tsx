"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const eventImages = [
  { id: 1, src: "/placeholder-ugo36.png", alt: "Graduation Ceremony", title: "Graduation Day 2024" },
  { id: 2, src: "/placeholder-xgg7e.png", alt: "Science Fair", title: "Annual Science Fair" },
  { id: 3, src: "/placeholder-hwodd.png", alt: "Cultural Day", title: "Cultural Celebration" },
  { id: 4, src: "/placeholder-uh4gx.png", alt: "Sports Day", title: "Sports Day Activities" },
  { id: 5, src: "/placeholder-xvdz7.png", alt: "Art Exhibition", title: "Student Art Exhibition" },
  { id: 6, src: "/placeholder-2m6yx.png", alt: "Music Concert", title: "Spring Music Concert" },
  { id: 7, src: "/placeholder-96kq5.png", alt: "Reading Week", title: "Reading Week Celebration" },
  { id: 8, src: "/placeholder-0i5af.png", alt: "Field Trip", title: "Nature Field Trip" },
  { id: 9, src: "/placeholder-1g2wt.png", alt: "Holiday Party", title: "Holiday Celebration" },
  { id: 10, src: "/placeholder-h6yai.png", alt: "Community Service", title: "Community Service Day" },
]

export default function EventsGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof eventImages)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">School Events</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              Celebrating the joy of learning through our vibrant school events and community gatherings.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eventImages.map((image) => (
              <Card
                key={image.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedImage(image)}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sage-900 text-sm">{image.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <img
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-sage-900">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
