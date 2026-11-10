# Pantri

App per sapere cosa hai in dispensa (soffitta e cucina) e cosa serve comprare.
React + TypeScript + Vite, installabile come app (PWA), dati su Supabase.

## Avvio sul Mac

1. Copia `.env.example` in `.env.local` e inserisci URL e chiave pubblica del progetto Supabase.
2. Nel Terminale, nella cartella del progetto:
   ```
   npm install
   npm run dev
   ```
3. Apri l'indirizzo che compare (di solito http://localhost:5173).

## Database
Lo schema è in `supabase/schema.sql`: va incollato nel SQL Editor di Supabase
dopo aver messo le due email autorizzate.

## Pubblicazione
Cloudflare compila e pubblica a ogni push su GitHub. Le due variabili
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` vanno inserite anche tra le
variabili di compilazione di Cloudflare.

## Prossimi passi
- Scanner ZXing per iPhone + nomi da Open Food Facts
- Uso offline in soffitta
