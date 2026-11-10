# Pantri

App per sapere cosa hai in dispensa (soffitta e cucina) e cosa serve comprare.
React + TypeScript + Vite, installabile come app (PWA).

## Primo avvio sul Mac

1. Installa Node.js (versione LTS) da https://nodejs.org
2. Apri il Terminale nella cartella del progetto:
   ```
   cd ~/Repos/pantri
   npm install
   npm run dev
   ```
3. Apri l'indirizzo che compare (di solito http://localhost:5173).

## Provarla sul telefono

`npm run dev` mostra anche un indirizzo "Network" (es. http://192.168.1.20:5173).
Aprilo dal telefono collegato allo stesso Wi-Fi. Nota: la fotocamera funziona
solo su indirizzi sicuri (https o localhost), quindi lo scanner si prova dopo
la pubblicazione online.

## Stato attuale
- Schermate: Oggi, Dispensa, Da comprare, scheda prodotto, scanner
- I dati stanno nel browser del dispositivo (non sono ancora condivisi)
- Scanner: usa la funzione nativa di Chrome; su iPhone mostra l'errore e si inserisce a mano

## Prossimi passi
1. Pubblicazione online (Cloudflare Pages o Vercel)
2. Supabase: dati condivisi tra i vostri dispositivi
3. Scanner ZXing per iPhone + nomi da Open Food Facts

Le decisioni di progetto sono in `CLAUDE.md`; `pantri-prototipo.html` è il prototipo originale.
