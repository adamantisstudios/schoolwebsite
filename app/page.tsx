import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import WhatsAppChat from "@/components/whatsapp-chat"
import WhatsAppPopup from "@/components/whatsapp-popup"
import Hero from "@/components/sections/hero"
import WelcomeNote from "@/components/sections/welcome-note"
import Philosophy from "@/components/sections/philosophy"
import Programs from "@/components/sections/programs"
import Faculty from "@/components/sections/faculty"
import StudentAwards from "@/components/sections/student-awards"
import Testimonials from "@/components/sections/testimonials"
import Gallery from "@/components/sections/gallery"
import Contact from "@/components/sections/contact"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppChat />
      <WhatsAppPopup />
      <main>
        <Hero />
        <WelcomeNote />
        <Philosophy />
        <Programs />
        <Faculty />
        <StudentAwards />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
