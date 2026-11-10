import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Se mancano le chiavi l'app mostra un messaggio invece di rompersi.
export const supabase = url && key ? createClient(url, key) : null
