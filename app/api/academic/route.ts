import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, {
    roles: ["PRINCIPAL", "TEACHER", "ACCOUNTANT", "PARENT"],
  })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const { data: years, error } = await supabase
    .from("academic_years")
    .select("*, academic_terms(*)")
    .order("start_date", { ascending: false })

  if (error) return jsonError(error.message, 500)
  return jsonOk(years)
}

const yearSchema = z.object({
  name: z.string().min(4).max(40),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isCurrent: z.boolean().optional(),
  terms: z
    .array(
      z.object({
        name: z.string().min(1).max(40),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "academic:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = yearSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid academic year payload", 400)

  const supabase = getSupabaseAdmin()

  if (parsed.data.isCurrent) {
    await supabase.from("academic_years").update({ is_current: false }).eq("is_current", true)
  }

  const { data: year, error } = await supabase
    .from("academic_years")
    .insert({
      name: parsed.data.name,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      is_current: parsed.data.isCurrent ?? false,
    })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  if (parsed.data.terms?.length) {
    await supabase.from("academic_terms").insert(
      parsed.data.terms.map((t) => ({
        academic_year_id: year.id,
        name: t.name,
        start_date: t.startDate,
        end_date: t.endDate,
      }))
    )
  }

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "ACADEMIC_YEAR_CREATE",
    resource: "academic_years",
    resourceId: year.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "CRITICAL",
  })

  return jsonOk(year, 201)
}
