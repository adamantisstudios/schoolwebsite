import { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["TEACHER"] })
  if (!isAuthResult(auth)) return auth

  const url = new URL(req.url)
  const classId = url.searchParams.get("classId")
  const courseId = url.searchParams.get("courseId")
  const term = url.searchParams.get("term")

  const supabase = getSupabaseAdmin()
  const { data: teacher } = await supabase.from("teachers").select("id").eq("user_id", auth.user.id).single()
  if (!teacher) return jsonError("Teacher profile not found", 404)

  let query = supabase
    .from("performances")
    .select("*, students(id, first_name, last_name, student_id, class_id), courses(name, code)")
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

  const { data, error } = await query
  if (error) return jsonError(error.message, 500)

  const byStudent: Record<
    string,
    { student: any; scores: number[]; maxScores: number[]; entries: number }
  > = {}

  for (const row of data || []) {
    const sid = row.student_id
    if (!byStudent[sid]) {
      byStudent[sid] = { student: row.students, scores: [], maxScores: [], entries: 0 }
    }
    byStudent[sid].scores.push(row.score)
    byStudent[sid].maxScores.push(row.max_score)
    byStudent[sid].entries += 1
  }

  const summary = Object.values(byStudent).map((s) => {
    const pct = s.scores.reduce((a, sc, i) => a + sc / s.maxScores[i], 0) / s.scores.length
    return {
      student: s.student,
      averagePercent: Math.round(pct * 100),
      entries: s.entries,
    }
  })

  summary.sort((a, b) => b.averagePercent - a.averagePercent)

  return jsonOk({ rows: data, summary })
}
