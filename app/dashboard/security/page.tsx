"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader, StatCard } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { downloadTablePdf } from "@/lib/pdf"

const nav = [
  { href: "/dashboard/security", label: "Gate log" },
  { href: "/dashboard/security/lookup", label: "Student lookup" },
]

export default function SecurityDashboard() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ visitorName: "", visitorPhone: "", purpose: "", personToSee: "" })
  const [message, setMessage] = useState("")
  const [q, setQ] = useState("")

  async function load() {
    setLoading(true)
    const url = q ? `/api/visitors?q=${encodeURIComponent(q)}` : "/api/visitors?today=1"
    const res = await fetch(url)
    const json = await res.json()
    if (json.ok) setVisitors(json.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function checkIn(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const res = await fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (json.ok) {
      setForm({ visitorName: "", visitorPhone: "", purpose: "", personToSee: "" })
      setMessage("Visitor checked in.")
      load()
    } else setMessage(json.error)
  }

  async function checkOut(id: string) {
    const res = await fetch("/api/visitors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    const json = await res.json()
    if (json.ok) load()
    else setMessage(json.error)
  }

  const onSite = visitors.filter((v) => !v.check_out).length

  function downloadPdf() {
    downloadTablePdf({
      title: "Daily Visitor Log",
      subtitle: new Date().toLocaleDateString(),
      filename: `visitor-log-${new Date().toISOString().slice(0, 10)}.pdf`,
      columns: [
        { header: "Visitor", key: "name" },
        { header: "Purpose", key: "purpose" },
        { header: "Check in", key: "in" },
        { header: "Check out", key: "out" },
      ],
      rows: visitors.map((v) => ({
        name: v.visitor_name,
        purpose: v.purpose,
        in: new Date(v.check_in).toLocaleString(),
        out: v.check_out ? new Date(v.check_out).toLocaleString() : "On site",
      })),
    })
  }

  return (
    <DashboardShell title="Security Portal" nav={nav}>
      <PageHeader
        title="Gate Attendance Log"
        description="Record visitor check-ins and check-outs"
        actions={
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              Print daily log
            </Button>
            <Button variant="outline" onClick={downloadPdf}>
              Download PDF
            </Button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="Logged today" value={visitors.length} />
        <StatCard label="Still on site" value={onSite} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={checkIn} className="rounded-xl border bg-white p-5 space-y-3 print:hidden">
          <h2 className="font-serif text-lg font-semibold">New visitor</h2>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          <div>
            <Label>Name</Label>
            <Input required value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.visitorPhone} onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })} />
          </div>
          <div>
            <Label>Purpose</Label>
            <Input required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
          <div>
            <Label>Person to see</Label>
            <Input value={form.personToSee} onChange={(e) => setForm({ ...form, personToSee: e.target.value })} />
          </div>
          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
            Check in
          </Button>
        </form>

        <div>
          <div className="flex gap-2 mb-3 print:hidden">
            <Input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button variant="outline" onClick={load}>
              Search
            </Button>
          </div>
          {loading ? (
            <LoadingBlock />
          ) : visitors.length === 0 ? (
            <EmptyState message="No visitors logged yet." />
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="hidden print:block p-4 text-center">
                <h1 className="font-serif text-xl font-bold">Montessori Bloom — Daily Visitor Log</h1>
                <p className="text-sm">{new Date().toLocaleDateString()}</p>
              </div>
              <ul className="divide-y">
                {visitors.map((v) => (
                  <li key={v.id} className="p-4 text-sm flex justify-between gap-3 items-start">
                    <div>
                      <p className="font-medium">{v.visitor_name}</p>
                      <p className="text-muted-foreground">{v.purpose}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        In: {new Date(v.check_in).toLocaleString()}
                        {v.check_out ? ` · Out: ${new Date(v.check_out).toLocaleString()}` : " · On site"}
                      </p>
                    </div>
                    {!v.check_out && (
                      <Button size="sm" variant="outline" className="print:hidden" onClick={() => checkOut(v.id)}>
                        Check out
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
