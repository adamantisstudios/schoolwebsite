import { DashboardLayoutClient } from "@/components/dashboard/layout-client"

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient role="PRINCIPAL">{children}</DashboardLayoutClient>
}
