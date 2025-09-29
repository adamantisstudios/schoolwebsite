import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Faculty", href: "/faculty" },
  { name: "Shop", href: "/shop" },
  { name: "Schedule a Tour", href: "/schedule-tour" },
  { name: "Contact", href: "/contact" },
]

const programs = [
  { name: "Toddler Community", href: "/programs/toddler" },
  { name: "Primary Program", href: "/programs/primary" },
  { name: "Elementary Program", href: "/programs/elementary" },
  { name: "Summer Camp", href: "/programs/summer" },
]

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Montessori Bloom</h3>
            <p className="text-secondary-foreground/80 mb-4 text-pretty">
              Nurturing young minds through authentic Montessori education since 2010.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary bg-transparent"
              asChild
            >
              <Link href="/schedule-tour">Schedule a Tour</Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <ul className="space-y-2">
              {programs.map((program) => (
                <li key={program.name}>
                  <Link
                    href={program.href}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-secondary-foreground/60" />
                <div className="text-secondary-foreground/80">
                  <p>No. 15 Osu Oxford Street</p>
                  <p>Accra, Ghana</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary-foreground/60" />
                <p className="text-secondary-foreground/80">024 279 9990</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary-foreground/60" />
                <p className="text-secondary-foreground/80">info@montessoribloomgh.com</p>
              </div>
            </address>

            <div className="mt-6">
              <h5 className="font-semibold mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <Link
                  href="#"
                  className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 text-sm text-center">
          <p className="text-secondary-foreground/60">&copy; 2025 Montessori Bloom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
