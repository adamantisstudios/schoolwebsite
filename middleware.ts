import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { ROLE_HOME, type UserRole } from "./lib/roles"

const COOKIE_NAME = "mbs_session"

const PUBLIC_PREFIXES = [
  "/",
  "/about",
  "/programs",
  "/admissions",
  "/faculty",
  "/gallery",
  "/shop",
  "/parent-resources",
  "/contact",
  "/apply",
  "/schedule-tour",
  "/register-toddler",
  "/register-primary",
  "/register-elementary",
  "/register-summer",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
]

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.includes(".")) {
    return true
  }
  if (pathname === "/") return true
  return PUBLIC_PREFIXES.some((p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/")))
}

function isDashboardPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/api/")
}

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    if (!payload.sub || !payload.role) return null
    return {
      id: payload.sub as string,
      role: payload.role as UserRole,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Auth APIs that must stay public
  if (
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/logout" ||
    pathname === "/api/auth/me"
  ) {
    if (pathname === "/api/auth/login") return NextResponse.next()
    return NextResponse.next()
  }

  const user = await getUserFromRequest(req)

  if (pathname === "/login") {
    if (user) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role], req.url))
    }
    return NextResponse.next()
  }

  if (pathname === "/register") {
    if (user) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role], req.url))
    }
    return NextResponse.next()
  }

  if (isDashboardPath(pathname) && !isPublicPath(pathname)) {
    if (!user) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 })
      }
      const login = new URL("/login", req.url)
      login.searchParams.set("next", pathname)
      return NextResponse.redirect(login)
    }

    // Role-gate dashboard sections
    const roleRoutes: Record<string, UserRole> = {
      "/dashboard/teacher": "TEACHER",
      "/dashboard/security": "SECURITY",
      "/dashboard/parent": "PARENT",
      "/dashboard/accountant": "ACCOUNTANT",
      "/dashboard/principal": "PRINCIPAL",
    }

    for (const [prefix, role] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(prefix) && user.role !== role) {
        return NextResponse.redirect(new URL(ROLE_HOME[user.role], req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/api/:path*"],
}
