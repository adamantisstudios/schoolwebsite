import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

const linkSchema = z.object({
  studentId: z.string().uuid(),
  parentId: z.string().uuid().nullable(),
})

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, {
    roles: ["TEACHER", "PRINCIPAL", "ACCOUNTANT", "SECURITY", "PARENT"],
  })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const url = new URL(req.url)
  const classId = url.searchParams.get("classId")
  const q = url.searchParams.get("q")
  const studentIdLookup = url.searchParams.get("studentId")

  // Security: basic lookup only
  if (auth.user.role === "SECURITY") {
    if (!studentIdLookup) return jsonError("Provide studentId for lookup", 400)
    const { data, error } = await supabase
      .from("students")
      .select("id, first_name, last_name, student_id, class_id, photo_url, classes(name)")
      .eq("student_id", studentIdLookup)
      .eq("is_archived", false)
      .maybeSingle()
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  if (auth.user.role === "PARENT") {
    const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
    if (!parent) return jsonError("Parent profile not found", 404)
    const { data, error } = await supabase
      .from("students")
      .select("*, classes(name)")
      .eq("parent_id", parent.id)
      .eq("is_archived", false)
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  if (auth.user.role === "TEACHER") {
    const { data: teacher } = await supabase.from("teachers").select("id").eq("user_id", auth.user.id).single()
    if (!teacher) return jsonError("Teacher profile not found", 404)

    const { data: formClasses } = await supabase.from("classes").select("id").eq("form_teacher_id", teacher.id)
    const { data: taughtClasses } = await supabase
      .from("class_courses")
      .select("class_id, courses!inner(teacher_courses!inner(teacher_id))")
      .eq("courses.teacher_courses.teacher_id", teacher.id)

    const classIds = Array.from(
      new Set([
        ...(formClasses || []).map((c) => c.id),
        ...(taughtClasses || []).map((c) => c.class_id),
      ])
    )

    if (classIds.length === 0) return jsonOk([])

    let query = supabase
      .from("students")
      .select("*, classes(name)")
      .in("class_id", classId ? [classId] : classIds)
      .eq("is_archived", false)

    if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,student_id.ilike.%${q}%`)
    const { data, error } = await query.order("last_name")
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  // Principal / Accountant
  let query = supabase
    .from("students")
    .select("*, classes(name), parents(id, user_id)")
    .eq("is_archived", false)
  if (classId) query = query.eq("class_id", classId)
  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,student_id.ilike.%${q}%`)
  const { data, error } = await query.order("last_name").limit(500)
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "students:read" })
  if (!isAuthResult(auth)) return auth

  const parsed = linkSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid link payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("students")
    .update({ parent_id: parsed.data.parentId })
    .eq("id", parsed.data.studentId)
    .select("*, classes(name)")
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "STUDENT_LINK_PARENT",
    resource: "students",
    resourceId: parsed.data.studentId,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "CRITICAL",
    details: { parentId: parsed.data.parentId },
  })

  return jsonOk(data)
}
