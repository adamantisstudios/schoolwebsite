"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { ROLE_HOME, type UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type NavItem = {
  name: string
  href: string
  submenu?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  { name: "About", href: "/about" },
  {
    name: "Programs",
    href: "/programs",
    submenu: [
      { name: "All Programs", href: "/programs" },
      { name: "Toddler", href: "/programs/toddler" },
      { name: "Primary", href: "/programs/primary" },
      { name: "Elementary", href: "/programs/elementary" },
      { name: "Summer Camp", href: "/programs/summer" },
    ],
  },
  { name: "Admissions", href: "/admissions" },
  {
    name: "School Life",
    href: "/gallery",
    submenu: [
      { name: "Faculty", href: "/faculty" },
      { name: "Gallery", href: "/gallery" },
      { name: "Events", href: "/gallery/events" },
      { name: "Facilities", href: "/gallery/facilities" },
      { name: "Shop", href: "/shop" },
      { name: "Parent Resources", href: "/parent-resources" },
    ],
  },
  { name: "Contact", href: "/contact" },
]

const ROLE_LABELS: Record<UserRole, string> = {
  TEACHER: "Dashboard",
  SECURITY: "Dashboard",
  PARENT: "Portal",
  ACCOUNTANT: "Portal",
  PRINCIPAL: "Dashboard",
}

export default function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null)
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDesktopMenu(null)
  }, [pathname])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [mobileMenuOpen])

  function openMenu(name: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDesktopMenu(name)
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenDesktopMenu(null), 150)
  }

  async function handleLogout() {
    await logout()
    window.location.href = "/"
  }

  function isActive(item: NavItem) {
    if (item.href === "/") return pathname === "/"
    if (pathname === item.href) return true
    if (item.submenu?.some((s) => pathname === s.href || pathname.startsWith(s.href + "/"))) return true
    return pathname.startsWith(item.href + "/")
  }

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 gap-3">
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-bold text-sage-700 hover:text-sage-800 transition-colors shrink-0 z-10"
          >
            Montessori Bloom
          </Link>

          {/* Desktop: truly centered links */}
          <div className="hidden lg:flex absolute inset-x-0 justify-center pointer-events-none">
            <div className="flex items-center gap-0.5 xl:gap-1 pointer-events-auto">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => (item.submenu ? openMenu(item.name) : undefined)}
                  onMouseLeave={scheduleClose}
                >
                  {item.submenu ? (
                    <>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-md px-2.5 xl:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                          isActive(item) ? "text-sage-900 bg-sage-50" : "text-sage-600 hover:text-sage-900 hover:bg-sage-50/80"
                        )}
                        aria-expanded={openDesktopMenu === item.name}
                        onClick={() => setOpenDesktopMenu(openDesktopMenu === item.name ? null : item.name)}
                      >
                        {item.name}
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 opacity-70 transition-transform",
                            openDesktopMenu === item.name && "rotate-180"
                          )}
                        />
                      </button>
                      {openDesktopMenu === item.name && (
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50"
                          onMouseEnter={() => openMenu(item.name)}
                          onMouseLeave={scheduleClose}
                        >
                          <div className="w-52 rounded-lg border border-border bg-white py-1.5 shadow-lg text-left shadow-black/10">
                            {item.submenu.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  "block px-4 py-2 text-sm transition-colors",
                                  pathname === sub.href
                                    ? "bg-sage-50 text-sage-900 font-medium"
                                    : "text-sage-600 hover:bg-sage-50 hover:text-sage-900"
                                )}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center rounded-md px-2.5 xl:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                        isActive(item) ? "text-sage-900 bg-sage-50" : "text-sage-600 hover:text-sage-900 hover:bg-sage-50/80"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0 z-10">
            {user ? (
              <>
                <Button size="sm" variant="outline" className="h-9" asChild>
                  <Link href={ROLE_HOME[user.role]}>{ROLE_LABELS[user.role]}</Link>
                </Button>
                <Button size="sm" variant="ghost" className="h-9" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" className="h-9" asChild>
                <Link href="/login">Portal</Link>
              </Button>
            )}
            <Button size="sm" className="h-9 bg-amber-500 hover:bg-amber-600 text-white" asChild>
              <Link href="/apply">Apply</Link>
            </Button>
          </div>

          {/* Mobile / tablet hamburger */}
          <div className="lg:hidden z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border bg-background max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="px-3 py-3 space-y-1">
            <Link
              href="/"
              className={cn(
                "block rounded-md px-3 py-2.5 text-base font-medium",
                pathname === "/" ? "bg-sage-50 text-sage-900" : "text-sage-700 hover:bg-sage-50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base font-medium",
                        isActive(item) ? "bg-sage-50 text-sage-900" : "text-sage-700 hover:bg-sage-50"
                      )}
                      onClick={() => setOpenMobileSub(openMobileSub === item.name ? null : item.name)}
                      aria-expanded={openMobileSub === item.name}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openMobileSub === item.name && "rotate-180"
                        )}
                      />
                    </button>
                    {openMobileSub === item.name && (
                      <div className="ml-2 mt-1 space-y-0.5 border-l border-sage-100 pl-2">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm",
                              pathname === sub.href
                                ? "bg-sage-50 text-sage-900 font-medium"
                                : "text-sage-600 hover:bg-sage-50 hover:text-sage-900"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-base font-medium",
                      isActive(item) ? "bg-sage-50 text-sage-900" : "text-sage-700 hover:bg-sage-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-3 mt-2 border-t border-border space-y-2">
              {user ? (
                <>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href={ROLE_HOME[user.role]} onClick={() => setMobileMenuOpen(false)}>
                      {ROLE_LABELS[user.role]}
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Staff & Parent Portal
                  </Link>
                </Button>
              )}
              <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white" asChild>
                <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
