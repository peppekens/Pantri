import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatOneDReader } from '@zxing/browser'
import type { IScannerControls } from '@zxing/browser'
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

/* Scanner: usa la libreria ZXing, che funziona su Chrome, Safari (iPhone) e Mac.
   Se la fotocamera non si apre, mostra l'errore e permette di scrivere il nome a mano. */
export function ScanSheet({ onCode, onManual, onClose }: {
  onCode: (code: string) => void
  onManual: () => void
  onClose: () => void
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (!navigator.mediaDevices?.getUserMedia) {
      setErr('La fotocamera non è disponibile su questo dispositivo. Premi “Scrivi il nome” per inserire il prodotto a mano.')
      return
    }
    let alive = true
    let done = false
    let controls: IScannerControls | null = null
    v.muted = true // necessario su iPhone per avviare il video da solo
    const reader = new BrowserMultiFormatOneDReader()

    reader
      .decodeFromConstraints({ video: { facingMode: { ideal: 'environment' } } }, v, (result, _error, c) => {
        if (result && !done) {
          done = true
          c.stop()
          onCode(result.getText())
        }
      })
      .then(c => {
        if (alive) controls = c
        else c.stop()
      })
      .catch(() => {
        if (alive) setErr('Non riesco ad aprire la fotocamera. Consenti l’accesso alla fotocamera oppure premi “Scrivi il nome”.')
      })

    return () => {
      alive = false
      controls?.stop()
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
