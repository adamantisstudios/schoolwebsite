import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER", "PRINCIPAL", "PARENT"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const url = new URL(req.url)
  const classId = url.searchParams.get("classId")
  const studentId = url.searchParams.get("studentId")
  const date = url.searchParams.get("date") || new Date().toISOString().slice(0, 10)
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")

  if (auth.user.role === "PARENT") {
    const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
    if (!parent) return jsonError("Parent profile not found", 404)
    const { data: children } = await supabase.from("students").select("id").eq("parent_id", parent.id)
    const childIds = (children || []).map((c) => c.id)
    if (studentId && !childIds.includes(studentId)) return jsonError("Forbidden", 403)

    let query = supabase
      .from("student_attendance")
      .select("*, students(first_name, last_name, student_id), classes(name)")
      .in("student_id", studentId ? [studentId] : childIds)
      .order("date", { ascending: false })
    if (from) query = query.gte("date", from)
    if (to) query = query.lte("date", to)
    const { data, error } = await query.limit(200)
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  if (auth.user.role === "TEACHER") {
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", auth.user.id)
      .single()

    if (!teacher) return jsonError("Teacher profile not found", 404)

    let query = supabase
      .from("student_attendance")
      .select("*, students(first_name, last_name, student_id), classes(name)")
      .eq("marked_by", auth.user.id)

    if (date && !from && !to) query = query.eq("date", date)
    if (from) query = query.gte("date", from)
    if (to) query = query.lte("date", to)
    if (classId) query = query.eq("class_id", classId)
    if (studentId) query = query.eq("student_id", studentId)

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  let query = supabase
    .from("student_attendance")
    .select("*, students(first_name, last_name, student_id), classes(name)")
  if (date && !from && !to) query = query.eq("date", date)
  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)
  if (classId) query = query.eq("class_id", classId)
  if (studentId) query = query.eq("student_id", studentId)
  const { data, error } = await query.order("date", { ascending: false }).limit(500)
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const markSchema = z.object({
  classId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  records: z
    .array(
      z.object({
        studentId: z.string().uuid(),
        status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1)
    .max(200),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER"], permission: "attendance:write" })
  if (!isAuthResult(auth)) return auth

  const body = await req.json().catch(() => null)
  const parsed = markSchema.safeParse(body)
  if (!parsed.success) return jsonError("Invalid attendance payload", 400, "VALIDATION")

  const supabase = getSupabaseAdmin()
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", auth.user.id)
    .single()
  if (!teacher) return jsonError("Teacher profile not found", 404)

  // Ensure teacher is form teacher or teaches a course in this class
  const { data: formClass } = await supabase
    .from("classes")
    .select("id")
    .eq("id", parsed.data.classId)
    .eq("form_teacher_id", teacher.id)
    .maybeSingle()

  const { data: taught } = await supabase
    .from("class_courses")
    .select("id, courses!inner(teacher_courses!inner(teacher_id))")
    .eq("class_id", parsed.data.classId)
    .eq("courses.teacher_courses.teacher_id", teacher.id)
    .limit(1)

  if (!formClass && (!taught || taught.length === 0)) {
    return jsonError("You are not assigned to this class", 403)
  }

  const rows = parsed.data.records.map((r) => ({
    student_id: r.studentId,
    class_id: parsed.data.classId,
    date: parsed.data.date,
    status: r.status,
    notes: r.notes ?? null,
    marked_by: auth.user.id,
  }))

  const { data, error } = await supabase
    .from("student_attendance")
    .upsert(rows, { onConflict: "student_id,class_id,date" })
    .select()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "ATTENDANCE_MARK",
    resource: "student_attendance",
    resourceId: parsed.data.classId,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { date: parsed.data.date, count: rows.length },
  })

  return jsonOk(data)
}
