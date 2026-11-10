import { useEffect, useState } from 'react'
import type { Item } from './types'

const KEY = 'pantri.items.v1'

const SEED: Item[] = [
  { id: 'd0', name: 'Dentifricio', cat: 'igiene', q: { soffitta: 3, cucina: 1 }, min: 2, code: '' },
  { id: 'd1', name: 'Pasta penne', cat: 'secchi', q: { soffitta: 4, cucina: 2 }, min: 3, code: '' },
  { id: 'd2', name: 'Detersivo piatti', cat: 'pulizia', q: { soffitta: 0, cucina: 1 }, min: 2, code: '' },
  { id: 'd3', name: 'Carta igienica', cat: 'carta', q: { soffitta: 8, cucina: 2 }, min: 6, code: '' },
  { id: 'd4', name: 'Acqua frizzante', cat: 'bevande', q: { soffitta: 6, cucina: 0 }, min: 6, code: '' },
  { id: 'd5', name: 'Lampadine E27', cat: 'varie', q: { soffitta: 0, cucina: 0 }, min: 2, code: '' },
  { id: 'd6', name: 'Riso basmati', cat: 'secchi', q: { soffitta: 1, cucina: 1 }, min: 1, code: '' }
]

function load(): Item[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Item[]
  } catch {
    /* ignora: si riparte dai dati di esempio */
  }
  return SEED
}

export function useItems() {
  const [items, setItems] = useState<Item[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* archiviazione non disponibile */
    }
  }, [items])

  return [items, setItems] as const
}
