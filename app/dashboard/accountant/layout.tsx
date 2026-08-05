import { DashboardLayoutClient } from "@/components/dashboard/layout-client"

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient role="ACCOUNTANT">{children}</DashboardLayoutClient>
}
