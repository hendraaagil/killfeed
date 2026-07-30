import { forwardRef } from 'react'

const OUTLINE = '#F5D949'
const BASE_H = 36
const CONTENT_RATIO = 24 / 36 // content band is 24px of the 36px height

export type Side = {
  icon: string
  name: string
  color: string
}

type Props = {
  left: Side
  right: Side
  weaponIcon: string
  flipWeapon: boolean
  /** gap between the loadout icon and the headshot/wallbang icons (abilities look better spaced) */
  iconGap: boolean
  headshotIcon: string | null
  wallbangIcon: string | null
  /** which side is the teammate (gets the yellow outline), or null */
  outline: 'left' | 'right' | null
  /** outline look: 'glow' traces the whole silhouette; 'inner' fades in toward the seam */
  outlineStyle: 'glow' | 'inner'
  /** height multiplier; banner height = 36 * scale */
  scale: number
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const v =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.padEnd(6, '0').slice(0, 6)
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const KillFeed = forwardRef<HTMLDivElement, Props>(function KillFeed(
  { left, right, weaponIcon, flipWeapon, iconGap, headshotIcon, wallbangIcon, outline, outlineStyle, scale },
  ref,
) {
  const H = BASE_H * scale
  const content = Math.round(H * CONTENT_RATIO) // 24px band at scale 1
  const seam = Math.round(H * 0.5) // chevron depth
  const overlap = H // color spans the full portrait width, out to its edge
  const font = Math.round(content * 0.575)
  const pad = Math.round(H * 0.3)
  const minColor = Math.round(H * 2.4) // min width of a color block
  const stroke = Math.max(2, Math.round(H * 0.03))

  // teal (left) points RIGHT; red (right) has matching notch on its LEFT.
  const leftClip = `polygon(0 0, calc(100% - ${seam}px) 0, 100% 50%, calc(100% - ${seam}px) 100%, 0 100%)`
  const rightClip = `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${seam}px 50%)`

  // 'glow' look: yellow stroke + soft glow tracing the whole teammate silhouette.
  const outlineFilter = `drop-shadow(${stroke}px 0 0 ${OUTLINE}) drop-shadow(-${stroke}px 0 0 ${OUTLINE}) drop-shadow(0 ${stroke}px 0 ${OUTLINE}) drop-shadow(0 -${stroke}px 0 ${OUTLINE}) drop-shadow(0 0 ${stroke * 3}px ${hexToRgba(OUTLINE, 0.85)})`
  const isGlow = (side: 'left' | 'right') => outline === side && outlineStyle === 'glow'
  const showInner = (side: 'left' | 'right') => outline === side && outlineStyle === 'inner'

  // 'inner' look: yellow outline inside the teammate's colored block, fading
  // out toward the center seam. `side` is the block's outer edge.
  const OutlineOverlay = ({ side, clip }: { side: 'left' | 'right'; clip: string }) => {
    const fade =
      side === 'left'
        ? 'linear-gradient(90deg, #000 0%, #000 22%, transparent 78%)'
        : 'linear-gradient(90deg, transparent 22%, #000 78%, #000 100%)'
    return (
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          clipPath: clip,
          boxShadow: `inset 0 0 0 ${stroke}px ${OUTLINE}, inset 0 0 ${stroke * 4}px ${hexToRgba(OUTLINE, 0.55)}`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      />
    )
  }

  const Portrait = ({ icon, flip }: { icon: string; flip?: boolean }) => (
    <div className="relative z-10 shrink-0 overflow-hidden" style={{ height: H }}>
      <img
        src={icon}
        crossOrigin="anonymous"
        alt=""
        className="block w-auto max-w-none"
        style={{
          height: H * 1.35,
          marginTop: -(H * 1.35 - H) / 2, // crop top/bottom equally, keep vertically centered
          transform: flip ? 'scaleX(-1)' : undefined,
        }}
      />
    </div>
  )

  const Name = ({ text }: { text: string }) => (
    <span
      className="font-banner font-medium tracking-[0.02em] whitespace-nowrap text-white"
      style={{ fontSize: font, lineHeight: `${content}px` }}
    >
      {text}
    </span>
  )

  // Glow style: yellow stroke + soft glow tracing the whole teammate silhouette.
  const leftGroup = (forGlow: boolean) => (
    <div className="flex items-stretch" style={forGlow ? { filter: outlineFilter } : undefined}>
      <Portrait icon={left.icon} />
      <div
        className="relative z-0 flex items-center"
        style={{
          marginLeft: -overlap,
          minWidth: minColor,
          paddingLeft: overlap,
          paddingRight: seam + pad,
          gap: pad * 0.6,
          clipPath: leftClip,
          background: `linear-gradient(90deg, ${hexToRgba(left.color, 0)} 0%, ${left.color} ${overlap}px)`,
        }}
      >
        {!forGlow && showInner('left') && <OutlineOverlay side="left" clip={leftClip} />}
        <Name text={left.name} />
        <div className="flex shrink-0 items-center" style={{ gap: iconGap ? pad * 0.5 : 0 }}>
          <img
            src={weaponIcon}
            crossOrigin="anonymous"
            alt=""
            className="w-auto object-contain"
            style={{
              height: content,
              maxWidth: H * 3,
              transform: flipWeapon ? 'scaleX(-1)' : undefined,
            }}
          />
          {wallbangIcon && (
            <img
              src={wallbangIcon}
              crossOrigin="anonymous"
              alt="wallbang"
              className="box-content max-h-10.5 max-w-10.5 object-contain"
              style={{ height: content, paddingInline: pad * 0.35 }}
            />
          )}
          {headshotIcon && (
            <img
              src={headshotIcon}
              crossOrigin="anonymous"
              alt="headshot"
              className="box-content max-h-10.5 max-w-10.5 object-contain"
              style={{ height: content, paddingInline: pad * 0.35 }}
            />
          )}
        </div>
      </div>
    </div>
  )

  const rightGroup = (forGlow: boolean) => (
    <div className="flex items-stretch" style={forGlow ? { filter: outlineFilter } : undefined}>
      <div
        className="relative z-0 flex items-center justify-start"
        style={{
          marginRight: -overlap,
          minWidth: minColor,
          paddingRight: overlap,
          paddingLeft: seam + pad,
          clipPath: rightClip,
          background: `linear-gradient(90deg, ${right.color} calc(100% - ${overlap}px), ${hexToRgba(right.color, 0)} 100%)`,
        }}
      >
        {!forGlow && showInner('right') && <OutlineOverlay side="right" clip={rightClip} />}
        <Name text={right.name} />
      </div>
      <Portrait icon={right.icon} flip />
    </div>
  )

  return (
    <div ref={ref} className="relative inline-flex items-stretch select-none" style={{ height: H }}>
      <div className="relative z-0 flex items-stretch">{leftGroup(isGlow('left'))}</div>

      {/* RIGHT group (victim) — on top so it hides the glow on the chevron seam */}
      <div className="relative z-10 flex items-stretch" style={{ marginLeft: -seam }}>
        {rightGroup(isGlow('right'))}
      </div>
    </div>
  )
})

export default KillFeed
