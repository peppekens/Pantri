import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import App from './App'
import Login from './Login'

export default function Root() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return (
      <div className="auth">
        <h1>Pantri</h1>
        <div className="err">
          Mancano le chiavi di Supabase. Controlla il file .env.local (sul Mac) o le variabili di compilazione (su Cloudflare).
        </div>
      </div>
    )
  }
  if (!ready) return <div className="auth"><p className="sub">Caricamento…</p></div>
  if (!session) return <Login />
  return <App onSignOut={() => { void supabase?.auth.signOut() }} />
}
