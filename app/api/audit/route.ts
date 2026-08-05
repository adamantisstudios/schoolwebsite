import { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "audit:read" })
  if (!isAuthResult(auth)) return auth

  const url = new URL(req.url)
  const severity = url.searchParams.get("severity")
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500)

  const supabase = getSupabaseAdmin()
  let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit)
  if (severity) query = query.eq("severity", severity)

  const { data, error } = await query
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}
