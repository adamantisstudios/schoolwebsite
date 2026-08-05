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
  const studentId = url.searchParams.get("studentId")
  const classId = url.searchParams.get("classId")
  const courseId = url.searchParams.get("courseId")
  const term = url.searchParams.get("term")

  if (auth.user.role === "PARENT") {
    const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
    if (!parent) return jsonError("Parent profile not found", 404)
    const { data: children } = await supabase.from("students").select("id").eq("parent_id", parent.id)
    const childIds = (children || []).map((c) => c.id)
    if (studentId && !childIds.includes(studentId)) return jsonError("Forbidden", 403)

    let query = supabase
      .from("performances")
      .select("*, students(first_name, last_name, student_id), courses(name, code)")
      .in("student_id", studentId ? [studentId] : childIds)
    if (term) query = query.eq("term", term)
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  if (auth.user.role === "TEACHER") {
    let query = supabase
      .from("performances")
      .select("*, students(first_name, last_name, student_id), courses(name, code)")
      .eq("recorded_by", auth.user.id)
    if (classId) {
      const { data: students } = await supabase.from("students").select("id").eq("class_id", classId)
      query = query.in(
        "student_id",
        (students || []).map((s) => s.id)
      )
    }
    if (courseId) query = query.eq("course_id", courseId)
    if (term) query = query.eq("term", term)
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  let query = supabase
    .from("performances")
    .select("*, students(first_name, last_name, student_id, class_id), courses(name, code)")
  if (studentId) query = query.eq("student_id", studentId)
  if (courseId) query = query.eq("course_id", courseId)
  if (term) query = query.eq("term", term)
  const { data, error } = await query.order("created_at", { ascending: false }).limit(500)
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  courseId: z.string().uuid(),
  classId: z.string().uuid(),
  assessmentType: z.string().min(1).max(100),
  term: z.string().min(1).max(50),
  academicYear: z.string().min(1).max(50),
  maxScore: z.number().positive().default(100),
  scores: z
    .array(
      z.object({
        studentId: z.string().uuid(),
        score: z.number().min(0),
        comment: z.string().max(500).optional(),
      })
    )
    .min(1)
    .max(200),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER"], permission: "performance:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid performance payload", 400, "VALIDATION")

  const supabase = getSupabaseAdmin()
  const { data: teacher } = await supabase.from("teachers").select("id").eq("user_id", auth.user.id).single()
  if (!teacher) return jsonError("Teacher profile not found", 404)

  const { data: assigned } = await supabase
    .from("teacher_courses")
    .select("id")
    .eq("teacher_id", teacher.id)
    .eq("course_id", parsed.data.courseId)
    .maybeSingle()

  if (!assigned) return jsonError("You are not assigned to this course", 403)

  const rows = parsed.data.scores.map((s) => ({
    student_id: s.studentId,
    course_id: parsed.data.courseId,
    assessment_type: parsed.data.assessmentType,
    score: s.score,
    max_score: parsed.data.maxScore,
    term: parsed.data.term,
    academic_year: parsed.data.academicYear,
    recorded_by: auth.user.id,
    teacher_comment: s.comment?.trim() || null,
  }))

  const { data, error } = await supabase.from("performances").insert(rows).select()
  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "PERFORMANCE_CREATE",
    resource: "performances",
    resourceId: parsed.data.courseId,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { assessmentType: parsed.data.assessmentType, count: rows.length },
  })

  return jsonOk(data, 201)
}
