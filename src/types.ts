export type CatKey = 'secchi' | 'bevande' | 'igiene' | 'pulizia' | 'carta' | 'varie'
export type LocKey = 'soffitta' | 'cucina'

export interface Item {
  id: string
  name: string
  cat: CatKey
  q: Record<LocKey, number>
  min: number
  code: string
}

export type Draft = Omit<Item, 'id'> & { id?: string }

export const LOC: Record<LocKey, string> = { soffitta: 'Soffitta', cucina: 'Cucina' }

export const total = (it: Item) => it.q.soffitta + it.q.cucina
export const isLow = (it: Item) => total(it) < it.min
