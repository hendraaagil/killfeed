export type Weapon = {
  uuid: string
  displayName: string
  displayIcon: string
  killStreamIcon: string
}

export type Ability = {
  slot: string
  displayName: string
  displayIcon: string
}

export type Agent = {
  uuid: string
  displayName: string
  displayIcon: string
  abilities: Ability[]
}

const API = 'https://valorant-api.com/v1'

export async function fetchWeapons(): Promise<Weapon[]> {
  const res = await fetch(`${API}/weapons`)
  const json = await res.json()
  return (json.data as Weapon[])
    .filter((w) => w.killStreamIcon)
    .map((w) => ({
      uuid: w.uuid,
      displayName: w.displayName,
      displayIcon: w.displayIcon,
      killStreamIcon: w.killStreamIcon,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`${API}/agents?isPlayableCharacter=true`)
  const json = await res.json()
  return (json.data as Agent[])
    .map((a) => ({
      uuid: a.uuid,
      displayName: a.displayName,
      displayIcon: a.displayIcon,
      abilities: (a.abilities ?? []).filter((ab) => ab.displayIcon),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}
