import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { agents, weapons } from './lib/valorant'
import { type Side } from './components/KillFeed'
import BannerPreview from './components/BannerPreview'
import Panel from './components/Panel'
import Segmented from './components/Segmented'
import Toggle from './components/Toggle'
import PlayerFields from './components/PlayerFields'
import IconSelect from './components/IconSelect'
import Footer from './components/Footer'
import {
  DEFAULT_AGENT_1,
  DEFAULT_AGENT_2,
  DEFAULT_WEAPON,
  ENEMY,
  HEADSHOT_ICON,
  KILLFEED_ABILITY_ICON,
  PREVIEW_H,
  PREVIEW_SCALE,
  TEAMMATE,
  WALLBANG_ICON,
} from './lib/constants'

const uuidByName = (name: string) => agents.find((a) => a.displayName === name)?.uuid
const DEFAULT_AGENT_1_UUID = uuidByName(DEFAULT_AGENT_1) ?? agents[0]?.uuid ?? ''
const DEFAULT_AGENT_2_UUID = uuidByName(DEFAULT_AGENT_2) ?? agents[1]?.uuid ?? agents[0]?.uuid ?? ''
const DEFAULT_WEAPON_UUID = weapons.find((w) => w.displayName === DEFAULT_WEAPON)?.uuid ?? weapons[0]?.uuid ?? ''

function App() {
  const [error, setError] = useState<string | null>(null)

  const [loadout, setLoadout] = useState<'weapons' | 'abilities'>('weapons')
  const [weaponUuid, setWeaponUuid] = useState(DEFAULT_WEAPON_UUID)
  const [abilitySlot, setAbilitySlot] = useState('')

  const [agent1, setAgent1] = useState(DEFAULT_AGENT_1_UUID)
  const [agent2, setAgent2] = useState(DEFAULT_AGENT_2_UUID)
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [name1Edited, setName1Edited] = useState(false)
  const [name2Edited, setName2Edited] = useState(false)

  const [color1, setColor1] = useState(TEAMMATE)
  const [color2, setColor2] = useState(ENEMY)
  const [outline, setOutline] = useState(true)
  const [outlineStyle, setOutlineStyle] = useState<'glow' | 'inner'>('glow')
  const [headshot, setHeadshot] = useState(false)
  const [wallbang, setWallbang] = useState(false)
  const [swap, setSwap] = useState(false)
  const [flipWeapon, setFlipWeapon] = useState(true)

  const feedRef = useRef<HTMLDivElement>(null)

  const a1 = useMemo(() => agents.find((a) => a.uuid === agent1), [agent1])
  const a2 = useMemo(() => agents.find((a) => a.uuid === agent2), [agent2])
  // the killer (left side) owns the ability list, regardless of player 1/2
  const killerAgent = swap ? a2 : a1

  // keep abilitySlot valid when the killer's agent changes
  useEffect(() => {
    if (!killerAgent) return
    if (!killerAgent.abilities.some((ab) => ab.slot === abilitySlot)) {
      setAbilitySlot(killerAgent.abilities[0]?.slot ?? '')
    }
  }, [killerAgent, abilitySlot])

  const displayName1 = name1Edited ? name1 : (a1?.displayName ?? '')
  const displayName2 = name2Edited ? name2 : (a2?.displayName ?? '')

  const weaponIcon = useMemo(() => {
    if (loadout === 'weapons') {
      return weapons.find((w) => w.uuid === weaponUuid)?.killStreamIcon ?? ''
    }
    return (
      KILLFEED_ABILITY_ICON[`${killerAgent?.uuid}:${abilitySlot}`] ??
      killerAgent?.abilities.find((ab) => ab.slot === abilitySlot)?.displayIcon ??
      ''
    )
  }, [loadout, weaponUuid, killerAgent, abilitySlot])

  // a weapon-style icon that can be flipped: real weapons, or the 3 abilities
  // with a custom kill-feed icon
  const flippableIcon = loadout === 'weapons' || `${killerAgent?.uuid}:${abilitySlot}` in KILLFEED_ABILITY_ICON

  const player1: Side = {
    icon: a1?.killfeedPortrait ?? '',
    name: displayName1,
    color: color1,
  }
  const player2: Side = {
    icon: a2?.killfeedPortrait ?? '',
    name: displayName2,
    color: color2,
  }

  // left is always the killer
  const left = swap ? player2 : player1
  const right = swap ? player1 : player2
  const outlineSide = outline ? (swap ? 'right' : 'left') : null

  async function handleExport() {
    if (!feedRef.current) return
    try {
      // export at the fixed 72px preview size
      const url = await toPng(feedRef.current, {
        pixelRatio: 1,
        cacheBust: true,
      })
      const a = document.createElement('a')
      a.download = `killfeed.hndr.xyz-${displayName1}-${displayName2}.png`.toLowerCase()
      a.href = url
      a.click()
    } catch (e) {
      setError(`Export failed: ${e}`)
    }
  }

  const exportBtn = (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition duration-150 ease-out hover:brightness-110 active:translate-y-px"
    >
      Export PNG
    </button>
  )

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="h-7 w-7" aria-hidden />
            <div className="leading-none">
              <div className="font-display text-lg font-extrabold tracking-tight uppercase">Kill Feed</div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink-2 uppercase">Valorant Generator</div>
            </div>
          </div>
          <div className="hidden items-center gap-4 lg:flex">{exportBtn}</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 pt-6 pb-28 sm:px-6 lg:gap-8 lg:pt-8 lg:pb-14">
        {error && (
          <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink">{error}</div>
        )}

        <section className="min-w-0 lg:sticky lg:top-20 lg:z-10">
          <BannerPreview
            feedRef={feedRef}
            previewH={PREVIEW_H}
            scale={PREVIEW_SCALE}
            left={left}
            right={right}
            weaponIcon={weaponIcon}
            flipWeapon={flippableIcon && flipWeapon}
            iconGap={loadout === 'abilities'}
            headshotIcon={headshot ? HEADSHOT_ICON : null}
            wallbangIcon={wallbang ? WALLBANG_ICON : null}
            outline={outlineSide}
            outlineStyle={outlineStyle}
          />
        </section>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-5">
          <Panel label="Loadout">
            <Segmented options={['weapons', 'abilities']} value={loadout} onChange={setLoadout} />
            <div className="mt-4">
              {loadout === 'weapons' ? (
                <IconSelect
                  items={weapons.map((w) => ({
                    id: w.uuid,
                    label: w.displayName,
                    icon: w.displayIcon,
                  }))}
                  value={weaponUuid}
                  onChange={setWeaponUuid}
                />
              ) : (
                <IconSelect
                  items={(killerAgent?.abilities ?? []).map((ab) => ({
                    id: ab.slot,
                    label: ab.displayName,
                    icon: ab.displayIcon,
                  }))}
                  value={abilitySlot}
                  onChange={setAbilitySlot}
                />
              )}
            </div>
            {loadout === 'abilities' && (
              <p className="mt-3 text-xs text-ink-2">
                Abilities come from the killer's agent ({killerAgent?.displayName}).
              </p>
            )}
            {flippableIcon && (
              <div className="mt-3">
                <Toggle checked={flipWeapon} onChange={setFlipWeapon} label="Flip weapon icon" />
              </div>
            )}
          </Panel>

          <Panel label="Options">
            <div className="flex flex-col gap-1">
              <Toggle checked={wallbang} onChange={setWallbang} label="Wallbang" />
              <Toggle checked={headshot} onChange={setHeadshot} label="Headshot" />
              <Toggle checked={outline} onChange={setOutline} label="Yellow outline (teammate)" />
              {outline && (
                <div className="pl-8">
                  <Segmented options={['glow', 'inner']} value={outlineStyle} onChange={setOutlineStyle} />
                </div>
              )}
              <Toggle checked={swap} onChange={setSwap} label="Swap — Player 2 kills Player 1" />
            </div>
          </Panel>

          <PlayerFields
            title="Player 1"
            tag="Teammate"
            agents={agents}
            agentUuid={agent1}
            onAgent={setAgent1}
            name={displayName1}
            onName={(v) => {
              setName1(v)
              setName1Edited(true)
            }}
            color={color1}
            onColor={setColor1}
          />

          <PlayerFields
            title="Player 2"
            tag="Enemy"
            agents={agents}
            agentUuid={agent2}
            onAgent={setAgent2}
            name={displayName2}
            onName={(v) => {
              setName2(v)
              setName2Edited(true)
            }}
            color={color2}
            onColor={setColor2}
          />
        </div>

        <Footer />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-rule bg-paper/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={handleExport}
          className="w-full rounded-lg bg-accent px-5 py-2.5 text-center text-sm font-semibold text-accent-ink transition hover:brightness-110 active:translate-y-px"
        >
          Export PNG
        </button>
      </div>
    </div>
  )
}

export default App
