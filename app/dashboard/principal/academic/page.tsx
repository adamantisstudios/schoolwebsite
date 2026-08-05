"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AcademicPage() {
  const [years, setYears] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    name: "2026/2027",
    startDate: "2026-09-01",
    endDate: "2027-07-31",
    isCurrent: false,
    term1: "Term 1",
    term1Start: "2026-09-01",
    term1End: "2026-12-15",
  })

  async function load() {
    setLoading(true)
    const j = await fetch("/api/academic").then((r) => r.json())
    if (j.ok) setYears(j.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createYear(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const res = await fetch("/api/academic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        isCurrent: form.isCurrent,
        terms: [{ name: form.term1, startDate: form.term1Start, endDate: form.term1End }],
      }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Academic year created." : json.error)
    if (json.ok) load()
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader title="Academic years & terms" description="Create school calendar periods" />

      <form onSubmit={createYear} className="rounded-xl border bg-white p-4 grid sm:grid-cols-2 gap-3 mb-8 max-w-3xl">
        <div>
          <Label>Year name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            id="current"
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
          />
          <Label htmlFor="current">Set as current year</Label>
        </div>
        <div>
          <Label>Start date</Label>
          <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div>
          <Label>End date</Label>
          <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <div>
          <Label>First term name</Label>
          <Input value={form.term1} onChange={(e) => setForm({ ...form, term1: e.target.value })} />
        </div>
        <div>
          <Label>Term start</Label>
          <Input type="date" value={form.term1Start} onChange={(e) => setForm({ ...form, term1Start: e.target.value })} />
        </div>
        <Button type="submit" className="sm:col-span-2 bg-amber-500 hover:bg-amber-600">
          Create academic year
        </Button>
      </form>

      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <LoadingBlock />
      ) : years.length === 0 ? (
        <EmptyState message="No academic years yet." />
      ) : (
        <div className="space-y-4">
          {years.map((y) => (
            <div key={y.id} className="rounded-xl border bg-white p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-serif font-semibold">{y.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {y.start_date} → {y.end_date}
                  </p>
                </div>
                {y.is_current ? (
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded h-fit">Current</span>
                ) : null}
              </div>
              {(y.academic_terms || []).length > 0 && (
                <ul className="mt-3 text-sm space-y-1">
                  {y.academic_terms.map((t: any) => (
                    <li key={t.id}>
                      {t.name}: {t.start_date} – {t.end_date}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
