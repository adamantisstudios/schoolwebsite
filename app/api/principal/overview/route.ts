import { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().slice(0, 10)

  const [
    students,
    staff,
    attendance,
    fees,
    visitors,
    transactions,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("is_archived", false),
    supabase.from("profiles").select("id, role", { count: "exact" }).eq("is_active", true).neq("role", "PARENT"),
    supabase.from("student_attendance").select("status, class_id, classes(name)").eq("date", today),
    supabase.from("fees").select("amount, paid"),
    supabase.from("visitor_logs").select("*").order("check_in", { ascending: false }).limit(10),
    supabase.from("financial_transactions").select("type, amount, date").order("date", { ascending: false }).limit(100),
  ])

  const att = attendance.data || []
  const presentish = att.filter((a) => a.status === "PRESENT" || a.status === "LATE").length
  const attendancePct = att.length ? Math.round((presentish / att.length) * 100) : 0

  const feeRows = fees.data || []
  const paidAmount = feeRows.filter((f) => f.paid).reduce((s, f) => s + f.amount, 0)
  const totalFees = feeRows.reduce((s, f) => s + f.amount, 0)

  const byClass: Record<string, { present: number; total: number; name: string }> = {}
  for (const a of att) {
    const name = (a.classes as { name?: string } | null)?.name || a.class_id
    if (!byClass[a.class_id]) byClass[a.class_id] = { present: 0, total: 0, name }
    byClass[a.class_id].total += 1
    if (a.status === "PRESENT" || a.status === "LATE") byClass[a.class_id].present += 1
  }

  return jsonOk({
    totals: {
      students: students.count || 0,
      staff: staff.count || 0,
      attendanceTodayPct: attendancePct,
      feeCollectionPct: totalFees ? Math.round((paidAmount / totalFees) * 100) : 0,
      feesPaid: paidAmount,
      feesOutstanding: totalFees - paidAmount,
    },
    attendanceByClass: Object.values(byClass),
    recentVisitors: visitors.data || [],
    recentTransactions: transactions.data || [],
  })
}
