import type { ReactNode } from 'react'

export default function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-rule bg-paper-2 p-4 sm:p-5">
      <h3 className="mb-4 font-mono text-[11px] tracking-[0.18em] text-ink-2 uppercase">{label}</h3>
      {children}
    </section>
  )
}
