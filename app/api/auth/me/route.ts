import { getSessionFromCookies } from "@/lib/auth"
import { jsonError, jsonOk } from "@/lib/api"
import { ROLE_HOME } from "@/lib/roles"

export async function GET() {
  const user = await getSessionFromCookies()
  if (!user) return jsonError("Not authenticated", 401)
  return jsonOk({ user, redirectTo: ROLE_HOME[user.role] })
}
