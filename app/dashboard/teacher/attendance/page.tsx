import { Suspense } from "react"
import AttendancePage from "./attendance-client"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <AttendancePage />
    </Suspense>
  )
}
