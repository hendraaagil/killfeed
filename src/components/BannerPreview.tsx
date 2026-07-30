import { useEffect, useRef, useState, type RefObject } from 'react'
import KillFeed, { type Side } from './KillFeed'

const checkerStyle = {
  backgroundColor: 'oklch(0.14 0.015 260)',
  backgroundImage: 'conic-gradient(#1d2028 25%, transparent 0 50%, #1d2028 0 75%, transparent 0)',
  backgroundSize: '20px 20px',
} satisfies React.CSSProperties

type Props = {
  feedRef: RefObject<HTMLDivElement | null>
  previewH: number
  scale: number
  left: Side
  right: Side
  weaponIcon: string
  flipWeapon: boolean
  iconGap: boolean
  headshotIcon: string | null
  wallbangIcon: string | null
  outline: 'left' | 'right' | null
  outlineStyle: 'glow' | 'inner'
}

export default function BannerPreview({ feedRef, previewH, ...feed }: Props) {
  const fitBoxRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [nat, setNat] = useState({ w: 0, h: 0 })

  const { left, right, weaponIcon, headshotIcon, wallbangIcon, outline } = feed

  // Fit the banner to the preview box width (shrink only, never upscale).
  // The banner renders at natural size so the export stays crisp; only a wrapper is scaled.
  useEffect(() => {
    const el = feedRef.current
    const box = fitBoxRef.current
    if (!el || !box) return
    const measure = () => {
      const cs = getComputedStyle(box)
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const avail = box.clientWidth - padX // content area only, exclude padding
      const w = el.offsetWidth // layout width, unaffected by CSS transform
      const h = el.offsetHeight
      setNat({ w, h })
      setFit(w > 0 ? Math.min(1, avail / w) : 1)
    }
    measure()
    // Re-measure on container resize AND on banner reflow (web fonts / images loading).
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    ro.observe(el)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [feedRef, left.name, right.name, left.icon, right.icon, weaponIcon, headshotIcon, wallbangIcon, outline])

  return (
    <div className="overflow-hidden rounded-2xl border border-rule bg-paper-2">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="font-mono text-xs tracking-[0.18em] text-ink-2 uppercase">Preview</span>
        <span className="font-mono text-xs text-ink-2">{previewH}px tall</span>
      </div>
      <div
        ref={fitBoxRef}
        className="flex w-full min-w-0 justify-center overflow-hidden p-5 sm:p-8"
        style={checkerStyle}
      >
        {/* reserve the scaled footprint so no extra whitespace remains */}
        <div style={nat.w ? { width: nat.w * fit, height: nat.h * fit } : undefined}>
          {/* banner renders at natural width (unconstrained) so it can grow; only scaled visually */}
          <div style={{ width: 'max-content', transform: `scale(${fit})`, transformOrigin: 'top left' }}>
            <KillFeed ref={feedRef} {...feed} />
          </div>
        </div>
      </div>
    </div>
  )
}
