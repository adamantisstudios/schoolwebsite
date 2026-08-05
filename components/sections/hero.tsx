"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "/images/hero1.jpg",
    title: "Nurturing Young Minds",
    subtitle: "A holistic Montessori education that fosters independence, creativity, and lifelong learning.",
    primary: { label: "Apply Now", href: "/apply" },
    secondary: { label: "Our Programs", href: "/programs" },
  },
  {
    image: "/images/hero2.jpg",
    title: "Child-Centered Learning",
    subtitle: "Carefully prepared environments that inspire curiosity, confidence, and discovery.",
    primary: { label: "View Programs", href: "/programs" },
    secondary: { label: "About Us", href: "/about" },
  },
  {
    image: "/images/hero3.jpg",
    title: "Hands-On Education",
    subtitle: "Concrete materials that make abstract ideas clear and joyful for young learners.",
    primary: { label: "Schedule a Tour", href: "/schedule-tour" },
    secondary: { label: "Admissions", href: "/admissions" },
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [paused])

  const slide = slides[current]

  return (
    <section
      className="relative h-[min(92vh,820px)] min-h-[520px] w-full overflow-hidden bg-sage-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage highlights"
    >
      {/* Slides — simple opacity crossfade */}
      {slides.map((s, index) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === current ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== current}
        >
          <img
            src={s.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/35" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-[2] flex h-full items-center">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white drop-shadow-md">
            Montessori Bloom
          </p>
          <h1
            key={`title-${current}`}
            className="mt-3 font-serif text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-balance drop-shadow-md animate-in fade-in duration-500"
          >
            {slide.title}
          </h1>
          <p
            key={`sub-${current}`}
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-white/95 leading-relaxed text-pretty drop-shadow animate-in fade-in duration-500"
          >
            {slide.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg px-8"
              asChild
            >
              <Link href={slide.primary.href}>{slide.primary.label}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-sage-900 backdrop-blur-sm px-8"
              asChild
            >
              <Link href={slide.secondary.href}>{slide.secondary.label}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Arrows — kept clear of WhatsApp FAB (bottom-right) */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 sm:left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white shadow-md backdrop-blur-sm transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 sm:right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white shadow-md backdrop-blur-sm transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  )
}
