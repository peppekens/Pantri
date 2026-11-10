import { CATS, CAT_KEYS } from './icons'
import { LOC, isLow, total } from './types'
import type { Item, LocKey } from './types'

export type Filter = 'tutto' | LocKey

function sub(it: Item) {
  const p: string[] = []
  if (it.q.soffitta) p.push(`${it.q.soffitta} in soffitta`)
  if (it.q.cucina) p.push(`${it.q.cucina} in cucina`)
  return p.join(' · ') || 'Finito'
}

function Row({ it, onEdit }: { it: Item; onEdit: (it: Item) => void }) {
  const low = isLow(it)
  return (
    <button className="item" onClick={() => onEdit(it)}>
      <span className="ico">{CATS[it.cat].icon}</span>
      <span style={{ flex: 1 }}>
        <div className="nm">{it.name}</div>
        <div className={'sub' + (low ? ' low' : '')}>
          {sub(it)}
          {low ? ` · ne servono almeno ${it.min}` : ''}
        </div>
      </span>
    </button>
  )
}

export function Oggi({ items, onEdit, onAdd, goDispensa, goLista }: {
  items: Item[]
  onEdit: (it: Item) => void
  onAdd: () => void
  goDispensa: (f: Filter) => void
  goLista: () => void
}) {
  const need = items.filter(isLow)
  const ok = items.length - need.length
  const pct = items.length ? Math.round((ok / items.length) * 100) : 100
  const sum = (k: LocKey) => items.reduce((a, i) => a + i.q[k], 0)

  if (!items.length) {
    return (
      <>
        <h1>Oggi</h1>
        <div className="hero">
          <h2>Inizia <span className="hl">da qui</span>.</h2>
          <p>La dispensa è vuota. Aggiungi il primo prodotto scansionando il codice a barre o scrivendo il nome.</p>
          <button className="btn dark" onClick={onAdd}>Aggiungi il primo prodotto</button>
        </div>
      </>
    )
  }

  return (
    <>
      <h1>Oggi</h1>
      <div className="hero">
        <span className="pill">{items.length} {items.length === 1 ? 'prodotto tracciato' : 'prodotti tracciati'}</span>
        {need.length ? (
          <>
            <h2>Mancano <span className="hl">{need.length} {need.length === 1 ? 'cosa' : 'cose'}</span>.</h2>
            <p>Sono già nella lista “Da comprare”. Il resto è a posto.</p>
          </>
        ) : (
          <>
            <h2>Dispensa <span className="hl">a posto</span>.</h2>
            <p>Niente da comprare oggi.</p>
          </>
        )}
        <div className="bar"><i style={{ width: pct + '%' }} /></div>
        <div className="row2"><span>Scorte ok</span><span>{ok} di {items.length}</span></div>
      </div>
      <div className="grid">
        <button className="tile" onClick={() => goDispensa('soffitta')}><b>{sum('soffitta')}</b><span>pezzi in soffitta</span></button>
        <button className="tile" onClick={() => goDispensa('cucina')}><b>{sum('cucina')}</b><span>pezzi in cucina</span></button>
      </div>
      {need.length > 0 && (
        <div className="card">
          <h3>In esaurimento</h3>
          {need.slice(0, 6).map(i => <Row key={i.id} it={i} onEdit={onEdit} />)}
          <div className="acts"><button className="btn dark" onClick={goLista}>Vai alla lista</button></div>
        </div>
      )}
    </>
  )
}

export function Dispensa({ items, filter, setFilter, onEdit }: {
  items: Item[]
  filter: Filter
  setFilter: (f: Filter) => void
  onEdit: (it: Item) => void
}) {
  let any = false
  return (
    <>
      <h1>Dispensa</h1>
      <div className="chips">
        {(['tutto', 'soffitta', 'cucina'] as Filter[]).map(f => (
          <button key={f} className={'chip' + (filter === f ? ' on' : '')} onClick={() => setFilter(f)}>
            {f === 'tutto' ? 'Tutto' : LOC[f]}
          </button>
        ))}
      </div>
      <div className="cats">
      {CAT_KEYS.map(k => {
        const list = items.filter(i => i.cat === k && (filter === 'tutto' || i.q[filter] > 0))
        if (!list.length) return null
        any = true
        return (
          <div key={k}>
            <div className="cat"><span className="cat-ico">{CATS[k].icon}</span>{CATS[k].name}</div>
            <div className="card tight">
              {list.map(i => <Row key={i.id} it={i} onEdit={onEdit} />)}
            </div>
          </div>
        )
      })}
      </div>
      {!any && <p className="empty">Niente qui. Premi Scansiona per aggiungere il primo prodotto.</p>}
    </>
  )
}

export function Lista({ items, onBought }: { items: Item[]; onBought: (id: string) => void }) {
  const need = items.filter(isLow)
  return (
    <div className="narrow">
      <h1>Da comprare</h1>
      {!need.length ? (
        <div className="card"><p className="empty" style={{ margin: 0 }}>Tutto a posto. I prodotti sotto la scorta minima compaiono qui da soli.</p></div>
      ) : (
        <>
          <div className="card tight">
            {need.map(i => (
              <div className="item static" key={i.id}>
                <span className="ico">{CATS[i.cat].icon}</span>
                <span style={{ flex: 1 }}>
                  <div className="nm">{i.name}</div>
                  <div className="sub">Ne servono {i.min - total(i)} · ora {total(i)}</div>
                </span>
                <button className="btn sm" onClick={() => onBought(i.id)}>Comprato</button>
              </div>
            ))}
          </div>
          <p className="sub" style={{ margin: '12px 6px' }}>“Comprato” aggiunge i pezzi mancanti in soffitta.</p>
        </>
      )}
    </div>
  )
}
