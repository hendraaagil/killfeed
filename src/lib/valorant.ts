import data from '../data/valorant.json'

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
  killfeedPortrait: string
  abilities: Ability[]
}

// prebuilt at scripts/generate-data.ts — regenerate with `bun run gen:data`
export const agents: Agent[] = data.agents
export const weapons: Weapon[] = data.weapons
