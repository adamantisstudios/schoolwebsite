"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "/placeholder.svg?height=800&width=1200",
    title: "Nurturing Young Minds",
    subtitle: "A holistic Montessori education that fosters independence, creativity, and lifelong learning",
    cta: "Enroll Now",
    secondaryCta: "Learn More",
  },
  {
    image: "/placeholder.svg?height=800&width=1200",
    title: "Child-Centered Learning",
    subtitle: "Our carefully prepared environments inspire curiosity and discovery",
    cta: "View Programs",
  },
  {
    image: "/placeholder.svg?height=800&width=1200",
    title: "Hands-On Education",
    subtitle: "Concrete materials make abstract concepts accessible to young learners",
    cta: "Schedule a Tour",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleSlideChange = (newSlide: number | ((prev: number) => number)) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(newSlide)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const nextSlide = () => {
    handleSlideChange((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    handleSlideChange((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background slides with modern parallax effect */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : index === (currentSlide - 1 + slides.length) % slides.length
                ? "opacity-0 scale-105 -translate-x-full"
                : "opacity-0 scale-95 translate-x-full"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Content overlay with modern animations */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-out ${
                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ display: index === currentSlide ? "block" : "none" }}
            >
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white text-balance leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto text-pretty leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {slide.cta}
                </Button>
                {slide.secondaryCta && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-sage-900 backdrop-blur-md transition-all duration-300 transform hover:scale-105"
                  >
                    {slide.secondaryCta}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern navigation arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 disabled:opacity-50 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 disabled:opacity-50 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modern pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            disabled={isAnimating}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide ? "w-12 h-3 bg-white shadow-lg" : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 text-white/70 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-px h-8 bg-white/50" />
          <div className="text-xs uppercase tracking-wider">Scroll</div>
        </div>
      </div>
    </section>
  )
}
