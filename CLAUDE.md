# Pantri – istruzioni di progetto

## Obiettivo
App per tenere l'inventario della dispensa di casa (soffitta e cucina) e sapere cosa comprare.
Problema da risolvere: si ricomprano cose già in casa (es. dentifricio) e si dimentica di comprare quelle che servono.
Soluzione: ogni prodotto ha una quantità e una scorta minima; sotto la scorta minima finisce da solo in "Da comprare".

## Utenti e dispositivi
Due persone (marito e moglie) con inventario e lista condivisi in tempo reale.
Dispositivi: Pixel (Android, Chrome), iPhone (Safari), MacBook (browser).
Interfaccia e testi in italiano. Sempre in sentence case, verbi semplici, nessun gergo tecnico.

## Stack
- React + TypeScript + Vite
- PWA installabile (vite-plugin-pwa), deve funzionare anche con rete debole (la soffitta)
- Supabase: database Postgres, login, sync in tempo reale (`supabase-js`)
- Tailwind CSS
- Scanner codici a barre: `@zxing/browser` (la BarcodeDetector API nativa non esiste su Safari iOS)
- Nomi prodotto da Open Food Facts (API gratuita); se il prodotto non c'è, si scrive il nome a mano
- Hosting: Cloudflare Pages o Vercel (deploy da GitHub)
- Nessun server proprio da gestire

## Modello dati
Prodotto (una scheda sola, con quantità divise per posizione):
- nome (obbligatorio)
- categoria (obbligatoria): secchi, bevande, igiene, pulizia, carta, varie
- quantità in soffitta e quantità in cucina (numeri interi ≥ 0)
- scorta minima (default 1), calcolata sul TOTALE (soffitta + cucina)
- codice a barre (opzionale, salvato dalla scansione; alla scansione successiva il prodotto viene riconosciuto)
- scadenza (opzionale, da aggiungere dopo il primo rilascio)

Un prodotto è "da comprare" quando totale < scorta minima. Quanti ne servono = scorta minima − totale.

Categorie con icona (disegno a tratto nero con accenti gialli):
- Alimentari secchi: barattolo
- Bevande: bottiglia
- Igiene personale: tubetto
- Pulizia casa: flacone con spruzzino
- Carta e monouso: rotolo
- Cucina e varie: lampadina
L'utente può aggiungere categorie in seguito.

## Schermate
1. **Oggi**: card gialla con "Mancano N cose", barra delle scorte ok, due riquadri con i pezzi in soffitta e in cucina, elenco dei prodotti in esaurimento.
2. **Dispensa**: prodotti raggruppati per categoria con icona, filtro Tutto / Soffitta / Cucina. Tap su un prodotto apre la scheda di modifica.
3. **Da comprare**: lista generata da sola. Pulsante "Comprato" che aggiunge i pezzi mancanti in soffitta (da migliorare: chiedere quantità e posizione).
4. **Scansiona**: apre la fotocamera. Prodotto già noto → +1. Prodotto nuovo → modulo con codice precompilato. Se lo scanner non funziona (permessi negati o dispositivo non supportato) mostrare un messaggio chiaro e permettere l'inserimento manuale del nome.
5. **Scheda prodotto** (foglio dal basso): nome, categoria, contatore in soffitta, contatore in cucina, scorta minima, elimina.

Navigazione: barra fluttuante a pillola in basso con Oggi, Dispensa, Lista (con numero dei prodotti da comprare) e il pulsante scuro Scansiona.

## Stile grafico (riferimento: screenshot di un'app di lettura)
- Sfondo crema `#F4F1EA`, card bianco caldo `#FFFDF8`, card hero giallo chiaro `#FBE9B0`, pulsanti giallo `#F7D154`, testo quasi nero `#1A1713`
- Angoli molto arrotondati (card 26–30 px, pulsanti a pillola)
- Titoli neri molto bold; una parola chiave con effetto evidenziatore giallo in font corsivo a mano (Caveat)
- Font principale: Bricolage Grotesque
- Barra di avanzamento nera su fondo giallo scuro
- Supporto tema scuro con le stesse variabili colore
- Mobile first, area sicura di iPhone rispettata (`env(safe-area-inset-*)`), focus da tastiera visibile

## Riferimento
Il file `pantri-prototipo.html` è un prototipo funzionante in un solo file (JavaScript semplice, dati nel browser). Riprendi da lì struttura, testi, colori e comportamento, ma riscrivi tutto in React + TypeScript.

## Ordine di lavoro consigliato
1. Creare il progetto Vite + React + TS + Tailwind e portare le schermate del prototipo con dati finti.
2. Aggiungere la PWA (installabile, funziona offline).
3. Creare il progetto Supabase: tabella prodotti, login per due persone, sync in tempo reale. Spiegarmi ogni passaggio da fare nella console Supabase.
4. Sostituire lo scanner con ZXing e collegare Open Food Facts.
5. Deploy su Cloudflare Pages o Vercel e prova su Pixel, iPhone e Mac.

## Come lavorare con me
Non sono uno sviluppatore: spiega in italiano, in modo semplice, cosa fai e cosa devo fare io (account da creare, chiavi da copiare). Procedi a piccoli passi e fammi provare l'app dopo ogni passo. Non mettere mai chiavi segrete nel codice: usa un file `.env` fuori da Git.
