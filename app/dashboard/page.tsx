import { redirect } from "next/navigation"
import { getSessionFromCookies } from "@/lib/auth"
import { ROLE_HOME } from "@/lib/roles"

export default async function DashboardIndex() {
  const user = await getSessionFromCookies()
  if (!user) redirect("/login")
  redirect(ROLE_HOME[user.role])
}
