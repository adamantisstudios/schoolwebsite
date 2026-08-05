import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { hashPassword, setAuthCookies, signAccessToken, generateRefreshToken, hashToken } from "@/lib/auth"
import { jsonError, jsonOk } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"
import { ROLE_HOME } from "@/lib/roles"

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(10).max(128),
  name: z.string().min(2).max(120),
  phone: z.string().max(40).optional(),
  childStudentId: z.string().min(3).max(40).optional(),
})

export async function POST(req: NextRequest) {
  const meta = getRequestMeta(req)
  const parsed = registerSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid registration data", 400, "VALIDATION")

  const email = parsed.data.email.toLowerCase().trim()
  const supabase = getSupabaseAdmin()

  const { data: existing } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle()
  if (existing) return jsonError("An account with this email already exists", 409)

  const passwordHash = await hashPassword(parsed.data.password)

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .insert({
      email,
      password_hash: passwordHash,
      role: "PARENT",
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
    })
    .select("id, email, name, role, phone")
    .single()

  if (profileErr) return jsonError(profileErr.message, 500)

  const { data: parent, error: parentErr } = await supabase
    .from("parents")
    .insert({ user_id: profile.id })
    .select("id")
    .single()

  if (parentErr) {
    await supabase.from("profiles").delete().eq("id", profile.id)
    return jsonError(parentErr.message, 500)
  }

  if (parsed.data.childStudentId) {
    const { data: student } = await supabase
      .from("students")
      .select("id, parent_id")
      .eq("student_id", parsed.data.childStudentId.trim())
      .eq("is_archived", false)
      .maybeSingle()

    if (student && !student.parent_id) {
      await supabase.from("students").update({ parent_id: parent.id }).eq("id", student.id)
    } else if (student && student.parent_id) {
      // Account created but ward already linked — parent can contact office
    }
  }

  const sessionUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: "PARENT" as const,
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
    actorEmail: email,
    actorRole: "PARENT",
    action: "PARENT_REGISTER",
    resource: "profiles",
    resourceId: profile.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { childStudentId: parsed.data.childStudentId ?? null },
  })

  return jsonOk({
    user: sessionUser,
    redirectTo: ROLE_HOME.PARENT,
    message: parsed.data.childStudentId
      ? "Account created. If your ward ID was valid and unlinked, they are now connected to your account."
      : "Account created. Contact the school office to link your child using their student ID.",
  }, 201)
}
