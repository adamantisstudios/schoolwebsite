"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/233242799990?text=Hello! I would like to know more about your Montessori school programs.",
      "_blank",
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    </div>
  )
}
