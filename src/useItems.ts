import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Draft, Item } from './types'

interface Row {
  id: string
  name: string
  cat: Item['cat']
  qty_soffitta: number
  qty_cucina: number
  min_qty: number
  barcode: string | null
}

const fromRow = (r: Row): Item => ({
  id: r.id,
  name: r.name,
  cat: r.cat,
  q: { soffitta: r.qty_soffitta, cucina: r.qty_cucina },
  min: r.min_qty,
  code: r.barcode ?? ''
})

const toRow = (d: Draft) => ({
  name: d.name,
  cat: d.cat,
  qty_soffitta: d.q.soffitta,
  qty_cucina: d.q.cucina,
  min_qty: d.min,
  barcode: d.code || null
})

const byName = (a: Item, b: Item) => a.name.localeCompare(b.name, 'it')

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: err } = await supabase.from('items').select('*').order('name')
    if (err) {
      setError('Non riesco a leggere i dati. Controlla la connessione.')
    } else {
      setError('')
      setItems((data as Row[]).map(fromRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!supabase) return
    void load()

    // Quando l'altra persona cambia qualcosa, ricarico la lista.
    const channel = supabase
      .channel('items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => { void load() })
      .subscribe()

    // Se l'app era in background, al ritorno ricarico.
    const onVisible = () => { if (document.visibilityState === 'visible') void load() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      void supabase?.removeChannel(channel)
    }
  }, [load])

  const fail = (msg: string) => { setError(msg); void load() }

  const save = async (d: Draft) => {
    if (!supabase) return
    if (d.id) {
      const id = d.id
      setItems(p => p.map(i => (i.id === id ? { ...(d as Item) } : i)).sort(byName))
      const { error: err } = await supabase.from('items').update(toRow(d)).eq('id', id)
      if (err) fail('Salvataggio non riuscito. Riprova.')
    } else {
      const { data, error: err } = await supabase.from('items').insert(toRow(d)).select().single()
      if (err || !data) { setError('Salvataggio non riuscito. Riprova.'); return }
      const created = fromRow(data as Row)
      setItems(p => (p.some(i => i.id === created.id) ? p : [...p, created].sort(byName)))
    }
  }

  const remove = async (id: string) => {
    if (!supabase) return
    setItems(p => p.filter(i => i.id !== id))
    const { error: err } = await supabase.from('items').delete().eq('id', id)
    if (err) fail('Eliminazione non riuscita. Riprova.')
  }

  const addToSoffitta = async (id: string, n: number) => {
    if (!supabase) return
    const cur = items.find(i => i.id === id)
    if (!cur) return
    const next = cur.q.soffitta + n
    setItems(p => p.map(i => (i.id === id ? { ...i, q: { ...i.q, soffitta: next } } : i)))
    const { error: err } = await supabase.from('items').update({ qty_soffitta: next }).eq('id', id)
    if (err) fail('Aggiornamento non riuscito. Riprova.')
  }

  return { items, loading, error, save, remove, addToSoffitta }
}
