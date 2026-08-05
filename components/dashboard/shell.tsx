"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string }

export function DashboardShell({
  title,
  nav,
  children,
}: {
  title: string
  nav: NavItem[]
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  async function handleLogout() {
    await logout()
    router.push("/login")
  }

  function isActive(href: string) {
    if (pathname === href) return true
    if (!pathname.startsWith(href + "/")) return false
    // Prefer the most specific matching nav item (so Overview isn't always highlighted)
    const betterMatch = nav.some(
      (n) => n.href !== href && n.href.length > href.length && (pathname === n.href || pathname.startsWith(n.href + "/"))
    )
    return !betterMatch
  }

  return (
    <div className="min-h-screen bg-sage-50/40">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden shrink-0"
              onClick={() => setOpen(!open)}
              aria-label="Toggle sidebar"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="font-serif font-bold text-sage-700 shrink-0 text-sm sm:text-base">
              Montessori Bloom
            </Link>
            <span className="hidden sm:inline text-sage-300">|</span>
            <span className="hidden sm:inline text-sm font-medium text-sage-800 truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-sage-900 truncate max-w-[140px]">{user?.name}</p>
              <p className="text-xs text-sage-500">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile horizontal tab strip */}
        <div className="md:hidden border-t overflow-x-auto scrollbar-none">
          <div className="flex gap-1 px-2 py-2 min-w-max">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                  isActive(item.href)
                    ? "bg-sage-700 text-white"
                    : "bg-sage-100 text-sage-700 hover:bg-sage-200"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-6 relative">
        {open && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/20 md:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={cn(
            "w-56 shrink-0 space-y-1",
            "md:block",
            open
              ? "fixed z-30 left-3 top-[7.5rem] bg-white border rounded-lg p-3 shadow-lg max-h-[70vh] overflow-y-auto"
              : "hidden md:block"
          )}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-sage-100 text-sage-900 font-medium"
                  : "text-sage-600 hover:bg-sage-50 hover:text-sage-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
