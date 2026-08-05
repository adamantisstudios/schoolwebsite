import { NextRequest } from "next/server"
import { clearAuthCookies, hashToken, COOKIE_NAME, REFRESH_COOKIE } from "@/lib/auth"
import { cookies } from "next/headers"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getSessionFromCookies } from "@/lib/auth"
import { jsonOk } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function POST(req: NextRequest) {
  const meta = getRequestMeta(req)
  const user = await getSessionFromCookies()
  const cookieStore = await cookies()
  const refresh = cookieStore.get(REFRESH_COOKIE)?.value

  if (refresh) {
    try {
      const supabase = getSupabaseAdmin()
      await supabase
        .from("refresh_tokens")
        .update({ revoked: true })
        .eq("token_hash", hashToken(refresh))
    } catch {
      // ignore
    }
  }

  await clearAuthCookies()
  cookieStore.delete(COOKIE_NAME)

  if (user) {
    await writeAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "LOGOUT",
      resource: "auth",
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    })
  }

  return jsonOk({ loggedOut: true })
}
