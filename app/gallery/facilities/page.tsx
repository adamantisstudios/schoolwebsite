"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const facilityImages = [
  { id: 1, src: "/montessori-classroom-prepared-environment.jpg", alt: "Primary Classroom", title: "Primary Classroom" },
  { id: 2, src: "/placeholder-72jzz.png", alt: "Toddler Room", title: "Toddler Learning Environment" },
  { id: 3, src: "/school-library-reading-corner.jpg", alt: "Library", title: "School Library" },
  { id: 4, src: "/placeholder.svg?height=300&width=400", alt: "Playground", title: "Outdoor Playground" },
  { id: 5, src: "/placeholder.svg?height=300&width=400", alt: "Cafeteria", title: "Dining Area" },
  { id: 6, src: "/placeholder.svg?height=300&width=400", alt: "Art Room", title: "Creative Arts Studio" },
  { id: 7, src: "/placeholder.svg?height=300&width=400", alt: "Music Room", title: "Music Room" },
  { id: 8, src: "/placeholder.svg?height=300&width=400", alt: "School Garden", title: "Learning Garden" },
  { id: 9, src: "/placeholder.svg?height=300&width=400", alt: "Main Entrance", title: "School Entrance" },
  { id: 10, src: "/placeholder.svg?height=300&width=400", alt: "Hallway", title: "School Corridors" },
]

export default function FacilitiesGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof facilityImages)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-50 to-green-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">Our Facilities</h1>
            <p className="text-xl text-sage-700 leading-relaxed">
              Discover our thoughtfully designed learning environments that inspire curiosity and foster independence.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {facilityImages.map((image) => (
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
