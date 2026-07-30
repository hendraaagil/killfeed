// Fetches Valorant agents + weapons from valorant-api, trims to the fields the
// app uses, and writes them to src/data/valorant.json. Run manually (or via the
// GitHub Action) whenever the game data changes: `bun run gen:data`.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://valorant-api.com/v1'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/valorant.json')

type Ability = { slot: string; displayName: string; displayIcon: string | null }
type RawAgent = {
  uuid: string
  displayName: string
  displayIcon: string
  killfeedPortrait: string
  abilities: Ability[]
}
type RawWeapon = {
  uuid: string
  displayName: string
  displayIcon: string
  killStreamIcon: string | null
}

const byName = (a: { displayName: string }, b: { displayName: string }) => a.displayName.localeCompare(b.displayName)

async function fetchData<T>(path: string): Promise<T[]> {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status} ${res.statusText}`)
  const json = (await res.json()) as { data: T[] }
  return json.data
}

async function main() {
  const [rawAgents, rawWeapons] = await Promise.all([
    fetchData<RawAgent>('/agents?isPlayableCharacter=true'),
    fetchData<RawWeapon>('/weapons'),
  ])

  const agents = rawAgents
    .map((a) => ({
      uuid: a.uuid,
      displayName: a.displayName,
      displayIcon: a.displayIcon,
      killfeedPortrait: a.killfeedPortrait,
      abilities: (a.abilities ?? [])
        .filter((ab) => ab.displayIcon)
        .map((ab) => ({ slot: ab.slot, displayName: ab.displayName, displayIcon: ab.displayIcon })),
    }))
    .sort(byName)

  const weapons = rawWeapons
    .filter((w) => w.killStreamIcon)
    .map((w) => ({
      uuid: w.uuid,
      displayName: w.displayName,
      displayIcon: w.displayIcon,
      killStreamIcon: w.killStreamIcon,
    }))
    .sort(byName)

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify({ agents, weapons }, null, 2) + '\n')
  console.log(`Wrote ${agents.length} agents, ${weapons.length} weapons → ${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
