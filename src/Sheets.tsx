import { useEffect, useRef, useState } from 'react'
import { CATS, CAT_KEYS } from './icons'
import type { Draft, LocKey } from './types'

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="step">
      <span>{label}</span>
      <div>
        <button aria-label="Meno" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <output>{value}</output>
        <button aria-label="Più" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  )
}

export function ItemForm({ initial, note, onSave, onDelete, onClose }: {
  initial: Draft
  note?: string
  onSave: (d: Draft) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const [d, setD] = useState<Draft>(initial)
  const [err, setErr] = useState('')
  const setQ = (k: LocKey, v: number) => setD({ ...d, q: { ...d.q, [k]: v } })

  const save = () => {
    if (!d.name.trim()) {
      setErr('Scrivi il nome del prodotto per salvarlo.')
      return
    }
    onSave({ ...d, name: d.name.trim() })
  }

  return (
    <div className="sheet-bg">
      <div className="sheet" role="dialog" aria-modal="true">
        <h2>{d.id ? 'Modifica' : 'Nuovo prodotto'}</h2>
        {(note || err) && <div className="err">{err || note}</div>}
        <label htmlFor="f_name">Nome</label>
        <input id="f_name" type="text" value={d.name} placeholder="Es. Shampoo"
          onChange={e => setD({ ...d, name: e.target.value })} />
        <label>Categoria</label>
        <div className="chips">
          {CAT_KEYS.map(k => (
            <button key={k} className={'chip' + (d.cat === k ? ' on' : '')} onClick={() => setD({ ...d, cat: k })}>
              {CATS[k].name}
            </button>
          ))}
        </div>
        <label>Quantità</label>
        <Stepper label="In soffitta" value={d.q.soffitta} onChange={v => setQ('soffitta', v)} />
        <Stepper label="In cucina" value={d.q.cucina} onChange={v => setQ('cucina', v)} />
        <label>Scorta minima</label>
        <Stepper label="Compra se sotto" value={d.min} onChange={v => setD({ ...d, min: v })} />
        <div className="acts">
          <button className="btn" onClick={onClose}>Annulla</button>
          <button className="btn dark" onClick={save}>Salva</button>
        </div>
        {onDelete && (
          <div className="acts">
            <button className="btn sm danger" onClick={onDelete}>Elimina prodotto</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* Scanner: usa la funzione nativa del browser quando c'è (Chrome su Android e Mac).
   Su iPhone non esiste: mostra l'errore e permette di scrivere il nome a mano.
   Passo successivo del progetto: sostituirlo con ZXing per farlo funzionare ovunque. */
export function ScanSheet({ onCode, onManual, onClose }: {
  onCode: (code: string) => void
  onManual: () => void
  onClose: () => void
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BD = (window as any).BarcodeDetector
    if (!BD || !navigator.mediaDevices?.getUserMedia) {
      setErr('Lo scanner non è disponibile su questo dispositivo. Premi “Scrivi il nome” per inserire il prodotto a mano.')
      return
    }
    let alive = true
    let stream: MediaStream | null = null
    const det = new BD({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] })

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        if (!alive) { s.getTracks().forEach(t => t.stop()); return }
        stream = s
        const v = video.current
        if (!v) return
        v.srcObject = s
        void v.play()
        const loop = () => {
          if (!alive) return
          det.detect(v)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((r: any[]) => {
              if (r.length) onCode(r[0].rawValue as string)
              else setTimeout(loop, 250)
            })
            .catch(() => setTimeout(loop, 400))
        }
        loop()
      })
      .catch(() => setErr('Non riesco ad aprire la fotocamera. Consenti l’accesso alla fotocamera oppure premi “Scrivi il nome”.'))

    return () => {
      alive = false
      stream?.getTracks().forEach(t => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="sheet-bg">
      <div className="sheet" role="dialog" aria-modal="true">
        <h2>Scansiona</h2>
        {err ? (
          <div className="err">{err}</div>
        ) : (
          <>
            <video ref={video} playsInline muted />
            <p className="sub">Inquadra il codice a barre del prodotto.</p>
          </>
        )}
        <div className="acts">
          <button className="btn" onClick={onClose}>Annulla</button>
          <button className="btn dark" onClick={onManual}>Scrivi il nome</button>
        </div>
      </div>
    </div>
  )
}
