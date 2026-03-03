# Weather Dashboard

### Installazione

Ambiente di runtime per questo progetto: [Node.js](https://nodejs.org/en/), versione `25.7.0`.

Scaricare e installare la versione richiesta. Se la macchina utilizza un'altra versione di default, usare [nvm](https://github.com/nvm-sh/nvm) per installare e gestire più ambienti Node, quindi attivare l'ambiente corretto solo per questa directory con il comando `nvm use`.

Una volta che Node è attivo, eseguire `npm clean-install` nella root del progetto per installare tutti i `node_modules` necessari.

Nel file `.env`, sostituire il valore di `VITE_OPEN_WEATHER_API_KEY` con una chiave personale di [OpenWeatherMap](https://openweathermap.org/).

Per lanciare il progetto usare il comando `npm run dev`.

### Note sull'implementazione

- come librerie grafiche ho scelto [Shadcn](https://ui.shadcn.com/) e [Tailwind](https://tailwindcss.com/). Non ho esperienza con nessuna delle due, le ho dunque scelte per rendere più interessante l'esercizio (MaterialUI alla lunga stanca). I componenti all'interno di `src/components/ui` sono originati da Shadcn, quindi possono essere ignorati nell'analisi del codice.
- per accelerare la creazione dei componenti ho usato Copilot. Ovviamente mi sono assicurato che il codice generato fosse sensato e limitato nello _scope_ (niente vibe coding), e ho aggiustato/scritto a mano la logica dei componenti dove aveva senso farlo. Gran parte della logica che vi interessa si trova in `App.tsx` e `ForecastItem.tsx`.
- ho riscontrato un problema nell'usare le API di _OpenWeatherMap_, nel senso che la chiamata "5 day / 3 hour forecast" sembrava essere l'unica disponibile per il free tier che possiedo. Non so se c'è qualche altro modo per recuperare le previsioni ora per ora, ma in mancanza di queste nel dettaglio ho riportato qualche dato delle previsioni che avevo.
- per far corrispondere le previsioni a 3 ore con le parti della giornata, ho stabilito che ogni 6 ore ci fosse una fase diversa (00-05 notte, 06-11 mattina, 12-17 pomeriggio, 18-23 sera). Ho trattato tutte le previsioni di ciascun range (2) come appartenenti alla stessa fase, e ho mostrato solo quella più vicina alla prima data di fetch, per poi andare di 6 in 6 ore. Ad esempio, se faccio un fetch alle 13:23, il primo risultato tornato dalle API è per le 14:00, e quella diventa la previsione per il pomeriggio. Quella dopo 6 ore (20:00) diventa quella per la sera, e così via. Sono sempre visualizzate 4 previsioni, distribuite sulle 24 ore successive al momento del fetch.
- non essendo chiaro cosa si intendesse con "sottosezione di dettaglio", ho deciso di mostrare un modale per ciascuna fase del giorno. Ho anche pensato di create una pagina `/details` dove poter navigare, ma non avendo installato subito una libreria di routing ho optato per questa soluzione più veloce. Naturalmente, essendo una PoC ho tagliato un po' su alcuni aspetti che sono fondamentali in un'app seria, e ci sono molti modi di migliorarla.
