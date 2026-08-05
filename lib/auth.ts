import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createHash, randomBytes } from "crypto"
import type { SessionUser, UserRole } from "./roles"

const COOKIE_NAME = "mbs_session"
const REFRESH_COOKIE = "mbs_refresh"

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters.")
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signAccessToken(user: SessionUser): Promise<string> {
  const expiresIn = process.env.JWT_EXPIRES_IN || "8h"
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

export async function verifyAccessToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub || !payload.email || !payload.role || !payload.name) return null
    return {
      id: payload.sub,
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as UserRole,
      phone: payload.phone ? String(payload.phone) : null,
    }
  } catch {
    return null
  }
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function generateRefreshToken(): string {
  return randomBytes(48).toString("hex")
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  const secure = process.env.NODE_ENV === "production"
  const refreshDays = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7)

  cookieStore.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * refreshDays,
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  cookieStore.delete(REFRESH_COOKIE)
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAccessToken(token)
}

export { COOKIE_NAME, REFRESH_COOKIE }
