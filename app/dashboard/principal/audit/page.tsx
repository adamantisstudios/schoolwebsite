"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [severity, setSeverity] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const url = severity ? `/api/audit?severity=${severity}` : "/api/audit"
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setLogs(j.data)
      })
      .finally(() => setLoading(false))
  }, [severity])

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader
        title="Security audit log"
        description="Immutable trail of logins, permission denials, and sensitive actions"
      />
      <div className="flex gap-2 mb-4">
        {["", "INFO", "WARNING", "CRITICAL"].map((s) => (
          <Button key={s || "all"} size="sm" variant={severity === s ? "default" : "outline"} onClick={() => setSeverity(s)}>
            {s || "All"}
          </Button>
        ))}
      </div>
      {loading ? (
        <LoadingBlock />
      ) : logs.length === 0 ? (
        <EmptyState message="No audit events." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {l.actor_email || "—"}
                    <div className="text-xs text-muted-foreground">{l.actor_role}</div>
                  </td>
                  <td className="px-4 py-3">{l.action}</td>
                  <td className="px-4 py-3">
                    {l.resource}
                    {l.resource_id ? <div className="text-xs text-muted-foreground">{l.resource_id}</div> : null}
                  </td>
                  <td className="px-4 py-3">{l.severity}</td>
                  <td className="px-4 py-3">{l.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  )
}
