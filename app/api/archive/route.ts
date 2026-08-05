import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

const archiveSchema = z.object({
  resource: z.enum(["students", "academic_years"]),
  id: z.string().uuid(),
  archived: z.boolean(),
  confirm: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "reports:all" })
  if (!isAuthResult(auth)) return auth

  const parsed = archiveSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid archive payload", 400)

  if (parsed.data.resource === "students" && parsed.data.archived && !parsed.data.confirm) {
    return jsonError("Set confirm:true to archive a student record", 400, "CONFIRM_REQUIRED")
  }

  const supabase = getSupabaseAdmin()
  let result

  if (parsed.data.resource === "students") {
    const { data, error } = await supabase
      .from("students")
      .update({ is_archived: parsed.data.archived })
      .eq("id", parsed.data.id)
      .select("id, first_name, last_name, student_id, is_archived")
      .single()
    if (error) return jsonError(error.message, 500)
    result = data
  } else {
    const { data, error } = await supabase
      .from("academic_years")
      .update({ is_current: !parsed.data.archived ? false : false })
      .eq("id", parsed.data.id)
      .select()
      .single()
    if (error) return jsonError(error.message, 500)
    result = data
  }

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: parsed.data.archived ? "ARCHIVE" : "RESTORE",
    resource: parsed.data.resource,
    resourceId: parsed.data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "CRITICAL",
  })

  return jsonOk(result)
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"] })
  if (!isAuthResult(auth)) return auth

  const includeArchived = new URL(req.url).searchParams.get("archived") === "1"
  const supabase = getSupabaseAdmin()

  let query = supabase
    .from("students")
    .select("id, first_name, last_name, student_id, is_archived, classes(name)")
    .order("last_name")

  if (includeArchived) {
    query = query.eq("is_archived", true)
  } else {
    query = query.eq("is_archived", false)
  }

  const { data, error } = await query
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}
