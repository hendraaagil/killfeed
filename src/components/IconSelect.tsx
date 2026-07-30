import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

export type IconItem = { id: string; label: string; icon: string }

export default function IconSelect({
  items,
  value,
  onChange,
}: {
  items: IconItem[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = items.find((i) => i.id === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-rule bg-paper-3 px-3 py-2 text-left text-sm text-ink transition outline-none focus:border-accent"
      >
        {current && <img src={current.icon} alt="" className="h-6 w-8 shrink-0 object-contain" />}
        <span className="min-w-0 flex-1 truncate">{current?.label}</span>
        <span className="text-ink-2">▾</span>
      </button>
      {open && (
        <ul className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-lg border border-rule bg-paper-2 py-1 shadow-2xl">
          {items.map((i) => (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(i.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition hover:bg-paper-3',
                  i.id === value ? 'bg-accent/15 text-ink' : 'text-ink-2',
                )}
              >
                <img src={i.icon} alt="" className="h-6 w-8 shrink-0 object-contain" />
                <span className="min-w-0 truncate">{i.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
