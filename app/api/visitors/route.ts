import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["SECURITY", "PRINCIPAL"] })
  if (!isAuthResult(auth)) return auth

  const url = new URL(req.url)
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")
  const q = url.searchParams.get("q")
  const today = url.searchParams.get("today") === "1"

  const supabase = getSupabaseAdmin()
  let query = supabase.from("visitor_logs").select("*").order("check_in", { ascending: false }).limit(200)

  if (today) {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    query = query.gte("check_in", start.toISOString())
  }
  if (from) query = query.gte("check_in", from)
  if (to) query = query.lte("check_in", to)
  if (q) query = query.ilike("visitor_name", `%${q}%`)

  const { data, error } = await query
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  visitorName: z.string().min(2).max(120),
  visitorPhone: z.string().max(40).optional(),
  purpose: z.string().min(2).max(300),
  personToSee: z.string().max(120).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["SECURITY"], permission: "visitors:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid visitor payload", 400, "VALIDATION")

  const supabase = getSupabaseAdmin()
  const { data: sec } = await supabase.from("security_staff").select("user_id").eq("user_id", auth.user.id).maybeSingle()
  if (!sec) return jsonError("Security profile not found", 404)

  const { data, error } = await supabase
    .from("visitor_logs")
    .insert({
      visitor_name: parsed.data.visitorName,
      visitor_phone: parsed.data.visitorPhone ?? null,
      purpose: parsed.data.purpose,
      person_to_see: parsed.data.personToSee ?? null,
      recorded_by: auth.user.id,
    })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "VISITOR_CHECKIN",
    resource: "visitor_logs",
    resourceId: data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  })

  return jsonOk(data, 201)
}

const checkoutSchema = z.object({
  id: z.string().uuid(),
})

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["SECURITY"], permission: "visitors:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid checkout payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("visitor_logs")
    .update({ check_out: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .is("check_out", null)
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "VISITOR_CHECKOUT",
    resource: "visitor_logs",
    resourceId: parsed.data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  })

  return jsonOk(data)
}
