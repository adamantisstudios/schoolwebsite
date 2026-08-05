import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL", "TEACHER"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("teachers")
    .select("id, employee_id, user_id, profiles:user_id(name, email)")
    .order("employee_id")

  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}
