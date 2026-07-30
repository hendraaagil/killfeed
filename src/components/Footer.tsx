const linkClass = 'text-ink underline decoration-rule underline-offset-2 transition hover:decoration-accent'

export default function Footer() {
  return (
    <footer className="pt-2 text-center font-mono text-xs leading-relaxed text-ink-2">
      <p>
        Game &amp; assets by{' '}
        <a href="https://playvalorant.com/en-us/" target="_blank" rel="noreferrer" className={linkClass}>
          VALORANT
        </a>
        {' · '}
        Data from{' '}
        <a href="https://valorant-api.com/" target="_blank" rel="noreferrer" className={linkClass}>
          valorant-api.com
        </a>
        {' · '}
        Font{' '}
        <a href="https://fonts.google.com/specimen/Barlow" target="_blank" rel="noreferrer" className={linkClass}>
          Barlow
        </a>
      </p>
      <p className="mt-1 text-ink-2">Not affiliated with or endorsed by Riot Games.</p>
    </footer>
  )
}
