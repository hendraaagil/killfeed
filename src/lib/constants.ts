// valorant-api base URL
export const API = 'https://valorant-api.com/v1'

// team colors
export const TEAMMATE = '#67C4A1'
export const ENEMY = '#F15A4A'

// kill-feed banner geometry
export const BASE_H = 36 // banner base height in px
export const CONTENT_RATIO = 24 / 36 // content band is 24px of the 36px height
export const OUTLINE = '#F5D949' // yellow teammate outline

// preview renders the banner at 2× base
export const PREVIEW_SCALE = 2
export const PREVIEW_H = BASE_H * PREVIEW_SCALE // 72px

// defaults selected on load
export const DEFAULT_AGENT_1 = 'Raze'
export const DEFAULT_AGENT_2 = 'Cypher'
export const DEFAULT_WEAPON = 'Vandal'

// static icon assets
export const HEADSHOT_ICON = '/headshot.png'
export const WALLBANG_ICON = '/wall.png'

// abilities that show a custom weapon-style icon in the real kill feed,
// keyed by `${agentUuid}:${slot}` (valorant-api only exposes the HUD glyph)
export const KILLFEED_ABILITY_ICON: Record<string, string> = {
  '22697a3d-45bf-8dd7-4fec-84a9e28c69d7:Ability1': '/abilities/chamber-headhunter.png', // Headhunter
  '22697a3d-45bf-8dd7-4fec-84a9e28c69d7:Ultimate': '/abilities/chamber-tdf.png', // Tour De Force
  'add6443a-41bd-e414-f6ad-e58d267f4e95:Ultimate': '/abilities/jett-bladestorm.png', // Blade Storm
}
