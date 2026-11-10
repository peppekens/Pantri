import { useState } from 'react'
import { NAV } from './icons'
import { ItemForm, ScanSheet } from './Sheets'
import { Dispensa, Lista, Oggi } from './views'
import type { Filter } from './views'
import { useItems } from './useItems'
import { isLow, total } from './types'
import type { Draft, Item } from './types'

type View = 'oggi' | 'dispensa' | 'lista'
type Sheet =
  | null
  | { mode: 'scan' }
  | { mode: 'form'; draft: Draft; note?: string }

const blank = (code = ''): Draft => ({ name: '', cat: 'secchi', q: { soffitta: 1, cucina: 0 }, min: 1, code })

export default function App() {
  const [items, setItems] = useItems()
  const [view, setView] = useState<View>('oggi')
  const [filter, setFilter] = useState<Filter>('tutto')
  const [sheet, setSheet] = useState<Sheet>(null)

  const go = (v: View) => { setView(v); window.scrollTo(0, 0) }
  const edit = (it: Item) => setSheet({ mode: 'form', draft: it })
  const toBuy = items.filter(isLow).length

  const onCode = (code: string) => {
    const known = items.find(i => i.code === code)
    if (known) {
      setItems(items.map(i => i.id === known.id ? { ...i, q: { ...i.q, soffitta: i.q.soffitta + 1 } } : i))
      setSheet(null)
    } else {
      setSheet({ mode: 'form', draft: blank(code), note: 'Prodotto nuovo. Scrivi il nome e scegli la categoria.' })
    }
  }

  const onSave = (d: Draft) => {
    if (d.id) setItems(items.map(i => i.id === d.id ? { ...(d as Item) } : i))
    else setItems([...items, { ...d, id: 'n' + Date.now() }])
    setSheet(null)
  }

  const onBought = (id: string) =>
    setItems(items.map(i => i.id === id
      ? { ...i, q: { ...i.q, soffitta: i.q.soffitta + Math.max(1, i.min - total(i)) } }
      : i))

  return (
    <>
      {view === 'oggi' && (
        <Oggi items={items} onEdit={edit} goLista={() => go('lista')}
          goDispensa={f => { setFilter(f); go('dispensa') }} />
      )}
      {view === 'dispensa' && <Dispensa items={items} filter={filter} setFilter={setFilter} onEdit={edit} />}
      {view === 'lista' && <Lista items={items} onBought={onBought} />}

      <nav>
        <button className={view === 'oggi' ? 'on' : ''} onClick={() => go('oggi')}>{NAV.oggi}Oggi</button>
        <button className={view === 'dispensa' ? 'on' : ''} onClick={() => go('dispensa')}>{NAV.dispensa}Dispensa</button>
        <button className={view === 'lista' ? 'on' : ''} onClick={() => go('lista')}>{NAV.comprare}Lista{toBuy ? ' ' + toBuy : ''}</button>
        <button className="scan" onClick={() => setSheet({ mode: 'scan' })}>{NAV.scan}Scansiona</button>
      </nav>

      {sheet?.mode === 'scan' && (
        <ScanSheet onCode={onCode} onClose={() => setSheet(null)}
          onManual={() => setSheet({ mode: 'form', draft: blank() })} />
      )}
      {sheet?.mode === 'form' && (
        <ItemForm key={sheet.draft.id ?? 'new' + sheet.draft.code} initial={sheet.draft} note={sheet.note}
          onSave={onSave} onClose={() => setSheet(null)}
          onDelete={sheet.draft.id ? () => { setItems(items.filter(i => i.id !== sheet.draft.id)); setSheet(null) } : undefined} />
      )}
    </>
  )
}
