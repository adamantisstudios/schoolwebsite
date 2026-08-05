import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import {
  clearAuthCookies,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  signAccessToken,
  verifyPassword,
} from "@/lib/auth"
import { jsonError, jsonOk } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"
import { ROLE_HOME, type UserRole } from "@/lib/roles"

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  const meta = getRequestMeta(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError("Invalid JSON body", 400)
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("Invalid email or password format", 400, "VALIDATION")
  }

  const email = parsed.data.email.toLowerCase().trim()
  const { password } = parsed.data
  const supabase = getSupabaseAdmin()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, password_hash, role, name, phone, is_active, failed_logins, locked_until")
    .eq("email", email)
    .maybeSingle()

  if (error) {
    console.error("[login] db error:", error.message)
    return jsonError("Unable to process login", 500)
  }

  if (!profile) {
    await writeAuditLog({
      action: "LOGIN_FAILED",
      resource: "auth",
      actorEmail: email,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: "WARNING",
      details: { reason: "unknown_email" },
    })
    return jsonError("Invalid email or password", 401, "INVALID_CREDENTIALS")
  }

  if (!profile.is_active) {
    await writeAuditLog({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role as UserRole,
      action: "LOGIN_BLOCKED_INACTIVE",
      resource: "auth",
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: "CRITICAL",
    })
    return jsonError("Account is disabled. Contact the school office.", 403, "INACTIVE")
  }

  if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
    await writeAuditLog({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role as UserRole,
      action: "LOGIN_BLOCKED_LOCKOUT",
      resource: "auth",
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: "CRITICAL",
    })
    return jsonError("Account temporarily locked due to failed attempts. Try again later.", 423, "LOCKED")
  }

  const valid = await verifyPassword(password, profile.password_hash)
  const maxAttempts = Number(process.env.LOGIN_MAX_ATTEMPTS || 5)
  const lockMinutes = Number(process.env.LOGIN_LOCKOUT_MINUTES || 15)

  if (!valid) {
    const failed = (profile.failed_logins || 0) + 1
    const updates: Record<string, unknown> = { failed_logins: failed }
    if (failed >= maxAttempts) {
      updates.locked_until = new Date(Date.now() + lockMinutes * 60 * 1000).toISOString()
      updates.failed_logins = 0
    }
    await supabase.from("profiles").update(updates).eq("id", profile.id)

    await writeAuditLog({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role as UserRole,
      action: "LOGIN_FAILED",
      resource: "auth",
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: failed >= maxAttempts ? "CRITICAL" : "WARNING",
      details: { failedAttempts: failed },
    })

    return jsonError("Invalid email or password", 401, "INVALID_CREDENTIALS")
  }

  await supabase
    .from("profiles")
    .update({ failed_logins: 0, locked_until: null, last_login_at: new Date().toISOString() })
    .eq("id", profile.id)

  const sessionUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role as UserRole,
    phone: profile.phone,
  }

  const accessToken = await signAccessToken(sessionUser)
  const refreshToken = generateRefreshToken()
  const refreshDays = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7)

  await supabase.from("refresh_tokens").insert({
    user_id: profile.id,
    token_hash: hashToken(refreshToken),
    expires_at: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000).toISOString(),
  })

  await setAuthCookies(accessToken, refreshToken)

  await writeAuditLog({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role as UserRole,
    action: "LOGIN_SUCCESS",
    resource: "auth",
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "INFO",
  })

  return jsonOk({
    user: sessionUser,
    redirectTo: ROLE_HOME[sessionUser.role],
  })
}
