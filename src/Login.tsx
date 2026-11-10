import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './supabase'

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setErr('')
    setMsg('')
    if (!email.trim() || pw.length < 6) {
      setErr('Inserisci l’email e una password di almeno 6 caratteri.')
      return
    }
    setBusy(true)
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
      if (error) setErr('Email o password non corrette, oppure l’email non è ancora stata confermata.')
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pw,
        options: { emailRedirectTo: window.location.origin }
      })
      if (error) setErr('Non riesco a creare l’account: ' + error.message)
      else if (!data.session) setMsg('Ti ho mandato un’email. Apri il link per confermare, poi torna qui e accedi.')
    }
    setBusy(false)
  }

  return (
    <div className="auth">
      <h1>Pantri</h1>
      <p className="sub" style={{ marginBottom: 8 }}>
        {mode === 'in' ? 'Accedi per vedere la dispensa.' : 'Crea il tuo account con l’email autorizzata.'}
      </p>
      <form onSubmit={submit}>
        {err && <div className="err">{err}</div>}
        {msg && <div className="ok">{msg}</div>}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
          value={pw} onChange={e => setPw(e.target.value)} />
        <div className="acts">
          <button className="btn dark" type="submit" disabled={busy}>
            {busy ? 'Attendi…' : mode === 'in' ? 'Accedi' : 'Crea account'}
          </button>
        </div>
      </form>
      <button className="linkbtn" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); setMsg('') }}>
        {mode === 'in' ? 'Prima volta? Crea l’account' : 'Hai già un account? Accedi'}
      </button>
    </div>
  )
}
