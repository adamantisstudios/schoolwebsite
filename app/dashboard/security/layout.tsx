import { DashboardLayoutClient } from "@/components/dashboard/layout-client"

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient role="SECURITY">{children}</DashboardLayoutClient>
}
