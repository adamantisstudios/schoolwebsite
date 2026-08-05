import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, {
    roles: ["ACCOUNTANT", "PRINCIPAL", "PARENT"],
  })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const studentId = new URL(req.url).searchParams.get("studentId")

  if (auth.user.role === "PARENT") {
    const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
    if (!parent) return jsonError("Parent profile not found", 404)
    const { data: children } = await supabase.from("students").select("id").eq("parent_id", parent.id)
    const ids = (children || []).map((c) => c.id)
    if (studentId && !ids.includes(studentId)) return jsonError("Forbidden", 403)

    const { data, error } = await supabase
      .from("fees")
      .select("*, students(first_name, last_name, student_id)")
      .in("student_id", studentId ? [studentId] : ids)
      .order("due_date", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  let query = supabase
    .from("fees")
    .select("*, students(first_name, last_name, student_id, class_id, classes(name))")
    .order("due_date", { ascending: false })
  if (studentId) query = query.eq("student_id", studentId)
  const { data, error } = await query.limit(500)
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const paySchema = z.object({
  feeId: z.string().uuid(),
  amount: z.number().positive().optional(),
  paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["ACCOUNTANT"], permission: "fees:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = paySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid payment payload", 400)

  const supabase = getSupabaseAdmin()
  const { data: fee, error: feeErr } = await supabase.from("fees").select("*").eq("id", parsed.data.feeId).single()
  if (feeErr || !fee) return jsonError("Fee not found", 404)
  if (fee.paid) return jsonError("Fee already paid", 400)

  const paidDate = parsed.data.paidDate || new Date().toISOString().slice(0, 10)
  const amount = parsed.data.amount ?? fee.amount

  const { data: updated, error } = await supabase
    .from("fees")
    .update({ paid: true, paid_date: paidDate })
    .eq("id", fee.id)
    .select()
    .single()
  if (error) return jsonError(error.message, 500)

  await supabase.from("financial_transactions").insert({
    type: "FEE_PAYMENT",
    amount,
    description: `Fee payment for student ${fee.student_id}`,
    date: paidDate,
    recorded_by: auth.user.id,
    student_id: fee.student_id,
    fee_id: fee.id,
  })

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "FEE_PAYMENT",
    resource: "fees",
    resourceId: fee.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { amount },
    severity: "INFO",
  })

  return jsonOk(updated)
}

const createFeeSchema = z.object({
  studentId: z.string().uuid(),
  amount: z.number().positive(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  academicTerm: z.string().min(1),
  academicYear: z.string().min(1),
  description: z.string().max(300).optional(),
})

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["ACCOUNTANT"], permission: "fees:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = createFeeSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid fee payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("fees")
    .insert({
      student_id: parsed.data.studentId,
      amount: parsed.data.amount,
      due_date: parsed.data.dueDate,
      academic_term: parsed.data.academicTerm,
      academic_year: parsed.data.academicYear,
      description: parsed.data.description ?? null,
    })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)
  return jsonOk(data, 201)
}
