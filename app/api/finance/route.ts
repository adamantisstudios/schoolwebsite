import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["ACCOUNTANT", "PRINCIPAL"] })
  if (!isAuthResult(auth)) return auth

  const url = new URL(req.url)
  const type = url.searchParams.get("type")
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")

  const supabase = getSupabaseAdmin()
  let query = supabase
    .from("financial_transactions")
    .select("*, students(first_name, last_name, student_id)")
    .order("date", { ascending: false })
    .limit(500)

  if (type) query = query.eq("type", type)
  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)

  const { data, error } = await query
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  description: z.string().min(2).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["ACCOUNTANT"], permission: "finance:write" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid transaction payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("financial_transactions")
    .insert({
      type: parsed.data.type,
      amount: parsed.data.amount,
      description: parsed.data.description,
      date: parsed.data.date || new Date().toISOString().slice(0, 10),
      recorded_by: auth.user.id,
    })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "FINANCE_ENTRY",
    resource: "financial_transactions",
    resourceId: data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { type: parsed.data.type, amount: parsed.data.amount },
  })

  return jsonOk(data, 201)
}
