import { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL", "ACCOUNTANT"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("parents")
    .select("id, user_id, profiles(name, email, phone, is_active)")
    .order("created_at", { ascending: false })

  if (error) return jsonError(error.message, 500)

  const rows = (data || []).map((p) => ({
    id: p.id,
    userId: p.user_id,
    name: (p.profiles as { name?: string } | null)?.name || "Parent",
    email: (p.profiles as { email?: string } | null)?.email || "",
    phone: (p.profiles as { phone?: string } | null)?.phone || null,
    isActive: (p.profiles as { is_active?: boolean } | null)?.is_active ?? true,
  }))

  return jsonOk(rows)
}
