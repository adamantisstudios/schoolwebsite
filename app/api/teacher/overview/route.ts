import { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const { data: teacher } = await supabase.from("teachers").select("id, employee_id").eq("user_id", auth.user.id).single()
  if (!teacher) return jsonError("Teacher profile not found", 404)

  const { data: formClasses } = await supabase
    .from("classes")
    .select("id, name")
    .eq("form_teacher_id", teacher.id)

  const { data: courses } = await supabase
    .from("teacher_courses")
    .select("course_id, courses(id, name, code)")
    .eq("teacher_id", teacher.id)

  const today = new Date().toISOString().slice(0, 10)
  const { data: todayAttendance } = await supabase
    .from("student_attendance")
    .select("status")
    .eq("marked_by", auth.user.id)
    .eq("date", today)

  const present = (todayAttendance || []).filter((a) => a.status === "PRESENT" || a.status === "LATE").length
  const total = (todayAttendance || []).length

  return jsonOk({
    teacher,
    formClasses: formClasses || [],
    courses: (courses || []).map((c) => c.courses),
    todayAttendance: { present, total, marked: total },
  })
}
