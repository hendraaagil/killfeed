import { cn } from '../lib/utils'

export default function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex w-full rounded-xl border border-rule bg-paper-3 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition duration-150 [transition-timing-function:var(--ease-out)]',
            value === opt ? 'bg-accent text-accent-ink' : 'text-ink-2 hover:text-ink',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
