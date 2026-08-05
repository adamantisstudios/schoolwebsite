import { DashboardLayoutClient } from "@/components/dashboard/layout-client"

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient role="PARENT">{children}</DashboardLayoutClient>
}
