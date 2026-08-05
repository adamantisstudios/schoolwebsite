import { DashboardLayoutClient } from "@/components/dashboard/layout-client"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient role="TEACHER">{children}</DashboardLayoutClient>
}
