import { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
  if (!parent) return jsonError("Parent profile not found", 404)

  const { data: children, error } = await supabase
    .from("students")
    .select("id, first_name, last_name, student_id, class_id, classes(name)")
    .eq("parent_id", parent.id)
    .eq("is_archived", false)

  if (error) return jsonError(error.message, 500)

  const enriched = []
  for (const child of children || []) {
    const { data: att } = await supabase
      .from("student_attendance")
      .select("status")
      .eq("student_id", child.id)
      .limit(30)
    const total = att?.length || 0
    const present = (att || []).filter((a) => a.status === "PRESENT" || a.status === "LATE").length
    const rate = total ? Math.round((present / total) * 100) : null

    const { data: grades } = await supabase.from("performances").select("score, max_score").eq("student_id", child.id)
    const avg =
      grades && grades.length
        ? Math.round(
            grades.reduce((s, g) => s + (g.score / g.max_score) * 100, 0) / grades.length
          )
        : null

    const { data: unpaid } = await supabase
      .from("fees")
      .select("amount")
      .eq("student_id", child.id)
      .eq("paid", false)

    enriched.push({
      ...child,
      attendanceRate: rate,
      gradeAverage: avg,
      outstandingFees: (unpaid || []).reduce((s, f) => s + f.amount, 0),
    })
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name))")
    .eq("parent_id", parent.id)
    .order("created_at", { ascending: false })

  return jsonOk({ children: enriched, orders: orders || [] })
}
