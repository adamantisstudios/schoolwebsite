"use client"

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-sage-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-sage-500">{label}</p>
      <p className="mt-1 font-serif text-3xl font-bold text-sage-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-sage-400">{hint}</p> : null}
    </div>
  )
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 className="font-serif text-2xl font-bold text-sage-900">{title}</h1>
        {description ? <p className="text-sm text-sage-600 mt-1">{description}</p> : null}
      </div>
      {actions}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-sage-200 bg-white p-10 text-center text-sage-500 text-sm">
      {message}
    </div>
  )
}

export function LoadingBlock() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 bg-sage-100 rounded w-1/3" />
      <div className="h-24 bg-sage-100 rounded" />
      <div className="h-24 bg-sage-100 rounded" />
    </div>
  )
}
