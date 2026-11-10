import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
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

export default function App({ onSignOut }: { onSignOut: () => void }) {
  const { items, loading, error, save, remove, addToSoffitta } = useItems()
  const [view, setView] = useState<View>('oggi')
  const [filter, setFilter] = useState<Filter>('tutto')
  const [sheet, setSheet] = useState<Sheet>(null)

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheet])

  const go = (v: View) => { setView(v); window.scrollTo(0, 0) }
  const edit = (it: Item) => setSheet({ mode: 'form', draft: it })
  const toBuy = items.filter(isLow).length
  const openScan = () => setSheet({ mode: 'scan' })

  const onCode = (code: string) => {
    const known = items.find(i => i.code === code)
    if (known) {
      void addToSoffitta(known.id, 1)
      setSheet(null)
    } else {
      setSheet({ mode: 'form', draft: blank(code), note: 'Prodotto nuovo. Scrivi il nome e scegli la categoria.' })
    }
  }

  const onSave = (d: Draft) => {
    void save(d)
    setSheet(null)
  }

  const onBought = (id: string) => {
    const it = items.find(i => i.id === id)
    if (it) void addToSoffitta(id, Math.max(1, it.min - total(it)))
  }

  return (
    <>
      <main key={view} className="page">
        {error && <div className="err">{error}</div>}
        {loading ? (
          <p className="empty">Carico la dispensa…</p>
        ) : (
          <>
            {view === 'oggi' && (
              <Oggi items={items} onEdit={edit} onAdd={openScan} goLista={() => go('lista')}
                goDispensa={f => { setFilter(f); go('dispensa') }} />
            )}
            {view === 'dispensa' && <Dispensa items={items} filter={filter} setFilter={setFilter} onEdit={edit} />}
            {view === 'lista' && <Lista items={items} onBought={onBought} />}
          </>
        )}
        {view === 'oggi' && <button className="linkbtn" onClick={onSignOut}>Esci dall’account</button>}
      </main>

      <nav style={{ '--i': ['oggi', 'dispensa', 'lista'].indexOf(view) } as CSSProperties}>
        <span className="pill-bg" aria-hidden="true" />
        <button className={view === 'oggi' ? 'on' : ''} onClick={() => go('oggi')}>{NAV.oggi}Oggi</button>
        <button className={view === 'dispensa' ? 'on' : ''} onClick={() => go('dispensa')}>{NAV.dispensa}Dispensa</button>
        <button className={view === 'lista' ? 'on' : ''} onClick={() => go('lista')}>{NAV.comprare}Lista{toBuy ? ' ' + toBuy : ''}</button>
        <button className="scan" onClick={openScan}>{NAV.scan}Scansiona</button>
      </nav>

      {sheet?.mode === 'scan' && (
        <ScanSheet onCode={onCode} onClose={() => setSheet(null)}
          onManual={() => setSheet({ mode: 'form', draft: blank() })} />
      )}
      {sheet?.mode === 'form' && (
        <ItemForm key={sheet.draft.id ?? 'new' + sheet.draft.code} initial={sheet.draft} note={sheet.note}
          onSave={onSave} onClose={() => setSheet(null)}
          onDelete={sheet.draft.id ? () => { void remove(sheet.draft.id as string); setSheet(null) } : undefined} />
      )}
    </>
  )
}
