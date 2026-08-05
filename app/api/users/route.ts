import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { hashPassword } from "@/lib/auth"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"
import type { UserRole } from "@/lib/roles"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "users:manage" })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, name, phone, is_active, last_login_at, created_at")
    .order("created_at", { ascending: false })
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(128),
  name: z.string().min(2).max(120),
  phone: z.string().max(40).optional(),
  role: z.enum(["TEACHER", "SECURITY", "PARENT", "ACCOUNTANT", "PRINCIPAL"]),
  employeeId: z.string().optional(),
  badgeNumber: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "users:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid user payload", 400)

  const supabase = getSupabaseAdmin()
  const passwordHash = await hashPassword(parsed.data.password)

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      email: parsed.data.email.toLowerCase(),
      password_hash: passwordHash,
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      role: parsed.data.role,
    })
    .select("id, email, role, name, phone, is_active")
    .single()

  if (error) return jsonError(error.message, 500)

  const role = parsed.data.role as UserRole
  if (role === "TEACHER") {
    await supabase.from("teachers").insert({
      user_id: profile.id,
      employee_id: parsed.data.employeeId || `TCH-${Date.now()}`,
    })
  } else if (role === "SECURITY") {
    await supabase.from("security_staff").insert({
      user_id: profile.id,
      badge_number: parsed.data.badgeNumber || `SEC-${Date.now()}`,
    })
  } else if (role === "PARENT") {
    await supabase.from("parents").insert({ user_id: profile.id })
  } else if (role === "ACCOUNTANT") {
    await supabase.from("accountants").insert({ user_id: profile.id })
  } else if (role === "PRINCIPAL") {
    await supabase.from("principals").insert({ user_id: profile.id })
  }

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "USER_CREATE",
    resource: "profiles",
    resourceId: profile.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "CRITICAL",
    details: { role, email: profile.email },
  })

  return jsonOk(profile, 201)
}

const patchSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean().optional(),
  name: z.string().min(2).max(120).optional(),
  phone: z.string().max(40).optional().nullable(),
  resetPassword: z.string().min(10).max(128).optional(),
})

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "users:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid update payload", 400)

  if (parsed.data.id === auth.user.id && parsed.data.isActive === false) {
    return jsonError("You cannot deactivate your own account", 400)
  }

  const updates: Record<string, unknown> = {}
  if (parsed.data.isActive !== undefined) updates.is_active = parsed.data.isActive
  if (parsed.data.name) updates.name = parsed.data.name
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone
  if (parsed.data.resetPassword) updates.password_hash = await hashPassword(parsed.data.resetPassword)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", parsed.data.id)
    .select("id, email, role, name, phone, is_active")
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "USER_UPDATE",
    resource: "profiles",
    resourceId: parsed.data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "CRITICAL",
    details: { fields: Object.keys(updates) },
  })

  return jsonOk(data)
}
