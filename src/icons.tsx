import type { ReactNode } from 'react'
import type { CatKey } from './types'

const S = { fill: 'none', stroke: '#1A1713', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const Y = { fill: '#F7D154', stroke: '#1A1713', strokeWidth: 2.5, strokeLinejoin: 'round' } as const

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 48 48" aria-hidden="true">{children}</svg>
)

export const CATS: Record<CatKey, { name: string; icon: ReactNode }> = {
  secchi: {
    name: 'Alimentari secchi',
    icon: svg(<><rect x="10" y="14" width="28" height="28" rx="6" {...Y} /><rect x="12" y="7" width="24" height="7" rx="3" {...S} /><path d="M17 26h14" {...S} /></>)
  },
  bevande: {
    name: 'Bevande',
    icon: svg(<><path d="M20 5h8v8l5 7v20a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V20l5-7z" {...Y} /><path d="M15 27h18" {...S} /></>)
  },
  igiene: {
    name: 'Igiene personale',
    icon: svg(<><path d="M12 8h24l-3 8H15z" {...S} /><path d="M15 16h18l-2 26H17z" {...Y} /><path d="M20 26h8" {...S} /></>)
  },
  pulizia: {
    name: 'Pulizia casa',
    icon: svg(<><path d="M16 20h16v20a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" {...Y} /><path d="M18 20v-6h10l6-3v7" {...S} /><path d="M38 8l4-2M38 13h5" {...S} /></>)
  },
  carta: {
    name: 'Carta e monouso',
    icon: svg(<><rect x="8" y="12" width="30" height="26" rx="8" {...Y} /><ellipse cx="38" cy="25" rx="3" ry="13" {...S} /><circle cx="17" cy="25" r="4" {...S} /></>)
  },
  varie: {
    name: 'Cucina e varie',
    icon: svg(<><path d="M24 5a13 13 0 0 0-7 24v5h14v-5A13 13 0 0 0 24 5z" {...Y} /><path d="M19 40h10M21 44h6" {...S} /></>)
  }
}

export const CAT_KEYS = Object.keys(CATS) as CatKey[]

const N = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const nav = (children: ReactNode) => <svg viewBox="0 0 24 24" aria-hidden="true" {...N}>{children}</svg>

export const NAV = {
  oggi: nav(<path d="M4 11l8-7 8 7v9H4z" />),
  dispensa: nav(<><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M4 12h16" /></>),
  comprare: nav(<><path d="M3 4h3l2 12h10l2-8H7" /><circle cx="9" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></>),
  scan: nav(<path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M4 12h16" />)
}
