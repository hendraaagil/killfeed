import type { Agent } from '../lib/valorant'
import IconSelect from './IconSelect'

export default function PlayerFields({
  title,
  tag,
  agents,
  agentUuid,
  onAgent,
  name,
  onName,
  color,
  onColor,
}: {
  title: string
  tag: string
  agents: Agent[]
  agentUuid: string
  onAgent: (v: string) => void
  name: string
  onName: (v: string) => void
  color: string
  onColor: (v: string) => void
}) {
  return (
    <section className="rounded-2xl border border-rule bg-paper-2 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="font-display text-sm font-bold tracking-wide uppercase">{title}</h3>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase"
          style={{ color, backgroundColor: `${color}22` }}
        >
          {tag}
        </span>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] tracking-wide text-ink-2 uppercase">Agent</span>
          <IconSelect
            items={agents.map((a) => ({ id: a.uuid, label: a.displayName, icon: a.displayIcon }))}
            value={agentUuid}
            onChange={onAgent}
          />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] tracking-wide text-ink-2 uppercase">Nickname</span>
          <input
            value={name}
            onChange={(e) => onName(e.target.value)}
            className="w-full rounded-lg border border-rule bg-paper-3 px-3 py-2 text-ink outline-none transition focus:border-accent"
          />
        </label>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-wide text-ink-2 uppercase">Color</span>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-ink-2">{color.toUpperCase()}</span>
            <span className="relative inline-block h-9 w-12 overflow-hidden rounded-lg border border-rule">
              <input
                type="color"
                value={color}
                onChange={(e) => onColor(e.target.value)}
                className="absolute cursor-pointer border-0 bg-transparent p-0"
                style={{ top: '-8px', left: '-8px', width: 'calc(100% + 16px)', height: 'calc(100% + 16px)' }}
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
