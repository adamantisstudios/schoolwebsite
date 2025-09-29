"use client"

import { useState, useEffect } from "react"
import { X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WhatsAppPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 60000) // Show popup after 1 minute

    return () => clearTimeout(timer)
  }, [])

  const handleJoinChannel = () => {
    window.open("https://whatsapp.com/channel/0029VbBEcM0CBtxHDTZq1h0p", "_blank")
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm">
      <Card className="shadow-xl border-green-200 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Stay Connected!</CardTitle>
                <CardDescription className="text-xs">Get school updates</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">
            Join our WhatsApp channel for important school announcements and updates.
          </p>
          <Button onClick={handleJoinChannel} className="w-full bg-green-500 hover:bg-green-600 text-white" size="sm">
            Join WhatsApp Channel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
