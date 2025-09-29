import type React from "react"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import SkipLink from "@/components/accessibility/skip-link"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Montessori Bloom - Nurturing Young Minds",
  description:
    "A holistic Montessori education that fosters independence, creativity, and lifelong learning in Accra, Ghana.",
  keywords: "Montessori, education, school, children, learning, Accra, Ghana",
  authors: [{ name: "Montessori Bloom" }],
  openGraph: {
    title: "Montessori Bloom - Nurturing Young Minds",
    description: "A holistic Montessori education that fosters independence, creativity, and lifelong learning.",
    type: "website",
    locale: "en_US",
  },
    Developer: 'Adamantis Studios'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <SkipLink />
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
