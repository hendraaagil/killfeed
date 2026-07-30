const linkClass = 'text-ink underline decoration-rule underline-offset-2 transition hover:decoration-accent'

const sources = [
  { label: 'VALORANT', href: 'https://playvalorant.com/en-us/' },
  { label: 'valorant-api.com', href: 'https://valorant-api.com/' },
  { label: 'VALORANT Wiki', href: 'https://wiki.playvalorant.com/' },
]

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-1.5 pt-2 text-center font-mono text-xs leading-relaxed text-ink-2">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>Game, assets &amp; data from</span>
        {sources.map((s, i) => (
          <span key={s.href} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden>·</span>}
            <Link href={s.href}>{s.label}</Link>
          </span>
        ))}
      </p>
      <p className="flex flex-wrap items-center justify-center gap-x-2">
        <span>
          Font <Link href="https://fonts.google.com/specimen/Barlow">Barlow</Link>
        </span>
        <span aria-hidden>·</span>
        <Link href="https://github.com/hendraaagil/killfeed">Source on GitHub</Link>
      </p>
      <p>Not affiliated with or endorsed by Riot Games.</p>
    </footer>
  )
}
