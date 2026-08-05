"use client"

import { useState } from "react"
import { X } from "lucide-react"

const galleryImages = [
 {
    "src": "/images/montessori-classroom-environment.jpg",
    "alt": "Montessori classroom environment",
    "title": "Prepared Environment"
  },
  {
    "src": "/images/children-working-with-materials.jpg",
    "alt": "Children working with materials",
    "title": "Hands-on Learning"
  },
  {
    "src": "/images/outdoor-learning-garden.jpg",
    "alt": "Outdoor learning garden",
    "title": "Nature Connection"
  },
  {
    "src": "/images/practical-life-activities.jpg",
    "alt": "Practical life activities",
    "title": "Practical Life"
  },
  {
    "src": "/images/children-reading-together.jpg",
    "alt": "Children reading together",
    "title": "Language Development"
  },
  {
    "src": "/images/montessori-math-materials-golden-beads.jpg",
    "alt": "Mathematics materials",
    "title": "Mathematical Concepts"
  },
  {
    "src": "/images/creative-arts.jpg",
    "alt": "Creative arts",
    "title": "Creative Expression"
  },
  {
    "src": "/images/collaborative-learning.jpg",
    "alt": "Collaborative learning",
    "title": "Social Learning"
  }
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Learning Environment
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-pretty">
            Take a glimpse into our carefully prepared environments where children explore, discover, and grow.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={galleryImages[selectedImage].src || "/placeholder.svg"}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg">{galleryImages[selectedImage].title}</p>
          </div>
        </div>
      )}
    </section>
  )
}
