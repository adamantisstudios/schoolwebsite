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
  const term = url.searchParams.get("term")

  if (auth.user.role === "PARENT") {
    const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
    if (!parent) return jsonError("Parent profile not found", 404)
    const { data: children } = await supabase.from("students").select("id").eq("parent_id", parent.id)
    const ids = (children || []).map((c) => c.id)
    if (studentId && !ids.includes(studentId)) return jsonError("Forbidden", 403)

    let query = supabase
      .from("student_reviews")
      .select("*, students(first_name, last_name, student_id), courses(name, code)")
      .in("student_id", studentId ? [studentId] : ids)
    if (term) query = query.eq("term", term)
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  if (auth.user.role === "TEACHER") {
    let query = supabase
      .from("student_reviews")
      .select("*, students(first_name, last_name, student_id), courses(name, code)")
      .eq("recorded_by", auth.user.id)
    if (studentId) query = query.eq("student_id", studentId)
    if (term) query = query.eq("term", term)
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  let query = supabase
    .from("student_reviews")
    .select("*, students(first_name, last_name, student_id), courses(name, code)")
  if (studentId) query = query.eq("student_id", studentId)
  if (term) query = query.eq("term", term)
  const { data, error } = await query.order("created_at", { ascending: false }).limit(200)
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid().optional().nullable(),
  term: z.string().min(1).max(50),
  academicYear: z.string().min(1).max(50),
  reviewText: z.string().min(10).max(3000),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER"], permission: "performance:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid review payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("student_reviews")
    .insert({
      student_id: parsed.data.studentId,
      course_id: parsed.data.courseId ?? null,
      term: parsed.data.term,
      academic_year: parsed.data.academicYear,
      review_text: parsed.data.reviewText,
      recorded_by: auth.user.id,
    })
    .select("*, students(first_name, last_name), courses(name)")
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "STUDENT_REVIEW_CREATE",
    resource: "student_reviews",
    resourceId: data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  })

  return jsonOk(data, 201)
}

const patchSchema = z.object({
  id: z.string().uuid(),
  reviewText: z.string().min(10).max(3000),
})

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER"] })
  if (!isAuthResult(auth)) return auth

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid review update", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("student_reviews")
    .update({ review_text: parsed.data.reviewText, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .eq("recorded_by", auth.user.id)
    .select()
    .single()

  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}
