// Italian copy — courtesy version; English (en.ts) is the reference.
// Source: docs/VETRINA_TESTI.md in the contracts repo, "IT — la pagina". Verbatim,
// except the constants band and the FAQ questions, which are new strings.
import { links } from "@/links";
import { sections } from "./sections";
import type { SiteCopy } from "./types";

export const it: SiteCopy = {
  lang: "it",
  path: "/it",
  meta: {
    description:
      "Un protocollo che non appartiene a nessuno. Non promette rendimenti. Garantisce regole.",
  },
  ui: {
    sections: "Sezioni",
    language: "Lingua",
    theme: "Cambia tema chiaro o scuro",
    footerLinks: "Collegamenti a piè di pagina",
    constants: "Le regole che nessuno può cambiare",
    currentStage: "fase attuale",
  },
  nav: [
    { label: "Perché esiste", href: `#${sections.why}` },
    { label: "Il nome è l'architettura", href: `#${sections.name}` },
    { label: "Le prove", href: `#${sections.proofs}` },
    { label: "Dove siamo", href: `#${sections.status}` },
  ],

  opening: {
    title: "Daimon",
    tagline: "Un protocollo che non appartiene a nessuno.",
    lead:
      "Non ha un proprietario, non ha un amministratore, non ha una funzione di emissione. Le commissioni vanno a chi detiene e a chi mette in staking. Ogni parametro può essere cambiato solo da un voto pubblico seguito da sette giorni allo scoperto — da chiunque, incluse le persone che l'hanno costruito, oppure da nessuno.",
    sub: "Non promette rendimenti. Garantisce regole.",
    ctaApp: { label: "Apri l'app", href: links.app },
    ctaPaper: { label: "Leggi il protocol paper", href: links.protocolPaper },
  },

  constants: [
    { value: "0", label: "proprietari" },
    { value: "21", unit: "mld", label: "floor della supply" },
    { value: "7", unit: "giorni", label: "su ogni decisione" },
    { value: "2", unit: "su 3", label: "firme del guardian" },
    { value: "36", unit: "mesi", label: "durata del guardian" },
    { value: "10", unit: "%", label: "tetto delle fee" },
  ],

  why: {
    heading: "Il problema non è mai stato l'asset",
    paragraphs: [
      "La maggior parte dei token nasce con un proprietario: un account che può cambiare le commissioni, bloccare i trasferimenti, prelevare fondi, in molti casi emettere nuovi token. Quei poteri non sono nascosti — sono scritti nel contratto, visibili a chiunque lo legga. La domanda è cosa si frappone tra quei poteri e il loro abuso, e quasi sempre la risposta è: le intenzioni del proprietario. Nient'altro.",
      "Non è una critica all'onestà di qualcuno. È un'osservazione sulla struttura. Un sistema la cui sicurezza dipende dalla buona fede continuata di una sola chiave privata non è un sistema sicuro: è una scommessa su una persona. E una scommessa che paga regolarmente per due anni resta una scommessa.",
      "Lo schema non è esclusivo delle cripto. Le decisioni che determinano il valore dei risparmi delle persone comuni vengono prese da istituzioni che non consultano chi ne subisce gli effetti e che si spiegano dopo. L'inflazione è l'esempio più chiaro: non un fenomeno naturale, ma una decisione presa da poche persone, il cui effetto è ridurre il valore dei risparmi di tutti gli altri.",
      "Esiste una forma di dissenso che consiste nel chiedere a chi comanda di comportarsi diversamente. Ne esiste un'altra che consiste nel costruire qualcosa che non ne abbia bisogno. Questo progetto è del secondo tipo.",
    ],
  },

  name: {
    heading: "Il nome è l'architettura",
    intro: [
      "Nella Grecia antica il *daimon* non era un demone. Era uno spirito guida che abitava tra gli dèi e i mortali — né sopra l'umanità né sotto, ma accanto. La parola deriva da un verbo che significa *dividere, spartire una parte*.",
      "Questo protocollo non è stato costruito e poi chiamato così. È il concetto ad aver prodotto il progetto, e dove i due sono entrati in conflitto durante lo sviluppo, ha vinto il concetto. Quattro letture, quattro meccanismi:",
    ],
    readings: [
      {
        text: "**Spartisce invece di accumulare.** Le commissioni ridistribuiscono a chi detiene, i reward affluiscono a chi blocca, la supply viene bruciata invece che accantonata. Nulla è messo da parte per nessuno.",
      },
      {
        text: "**Socrate — un freno, non un comando.** Il suo *daimonion* non gli diceva mai cosa fare; lo fermava soltanto. Il timelock non ha alcuna opinione sulla proposta che gli passa attraverso: il suo intero contributo è un rifiuto condizionato dal tempo.",
        code: "if (block.timestamp < op.readyTimestamp) revert TooEarly();",
      },
      {
        text: "**Platone — la guida è scelta prima che sorga la questione.** Il potere di voto è misurato all'ultimo blocco sigillato prima che la proposta esistesse. L'influenza comprata dopo, anche nello stesso blocco, non conta nulla.",
      },
      {
        text: "**Eraclito — due volte.** *Il carattere è destino*: non esiste autorità sopra il protocollo, esiste un solo ruolo e lo detiene un contratto che esegue ciò che la community ha già deciso. E *tutto scorre*: poche cose non potranno mai cambiare — nessuna emissione, un floor di 21 miliardi, un tetto delle fee, un ritardo obbligatorio — proprio perché tutto il resto possa farlo. Le commissioni possono muoversi perché esiste un tetto che non si muove.",
      },
    ],
    more: {
      label: "La lettura completa, con il codice di ciascuna: protocol paper, Sezione 2",
      href: links.protocolPaperSection2,
    },
  },

  proofs: {
    heading: "Non fidatevi di questa pagina",
    intro: "Tutto quello che c'è scritto sopra o è vero sulla chain, o non lo è. Ecco come verificarlo:",
    items: [
      {
        icon: "audit",
        text: "**Audit indipendente — il report è pubblico, integrale.** 37 problemi trovati: uno critico, uno alto, sette medi, dodici bassi, sedici informativi. Ventinove corretti nel codice, otto accettati con motivazione scritta — pubblicati anche quelli, con il perché.",
        link: { label: "Il report", href: links.auditReport },
      },
      {
        icon: "frozen",
        text: "**Contratti congelati, 180 test.** Il codice deployato è identico byte per byte al tag auditato, e ogni contratto è verificato su BscScan e Sourcify. La suite di test gira a ogni commit, e la differenza rispetto a quel tag viene verificata vuota prima di ogni pubblicazione.",
        link: { label: "Il repository e il tag", href: links.repositoryTag },
      },
      {
        icon: "rehearsed",
        text: "**Provato prima di essere lanciato.** Trentuno scenari su un fork locale, poi un deploy completo su una chain di prova pubblica — con un ciclo di governance intero in tempo reale: proposta, voto, coda, sette giorni veri di attesa, esecuzione. Ogni transazione registrata in un registro pubblico, deviazioni comprese.",
        link: { label: "I registri", href: links.journals },
      },
      {
        icon: "monitor",
        text: "**Un monitor che osserva e non può toccare.** Sola lettura, nessuna chiave privata, su un server tutto suo. Riporta lo stato del protocollo ogni sei ore e suona quando cambia qualcosa che non dovrebbe.",
        link: { label: "La specifica", href: links.monitorSpec },
      },
      {
        icon: "contracts",
        text: "**I contratti.** Leggeteli, o leggete cosa ci hanno trovato altri.",
        link: { label: "I contratti", href: links.contracts },
      },
    ],
  },

  status: {
    heading: "A che punto è",
    stages: [
      {
        label: "Fatto",
        text: "audit esterno concluso e pubblicato · contratti congelati · due prove generali complete, la seconda su chain pubblica · deploy su BNB Smart Chain mainnet, ogni contratto verificato · il guardian: due firme su tre, poteri solo negativi, in scadenza 36 mesi dopo il lancio",
      },
      {
        label: "Ora",
        text: "la finestra di migrazione è aperta: DMX si converte 1:1 in DMN fino al 28 dicembre 2026, 01:08 UTC, come scritto nel contratto",
      },
      {
        label: "Poi",
        text: "la treasury comincia ad accumulare, per voto · moduli di servizio, ciascuno auditato separatamente prima del deploy",
      },
    ],
    current: 1,
    note: "Nessuna data per ciò che viene dopo. Ogni passo dipende da un voto pubblico e dai sette giorni che lo precedono.",
    closing: "**La destinazione non è fissa. Il metodo sì.**",
  },

  faq: {
    heading: "Cosa Daimon non è.",
    items: [
      {
        question: "È un investimento?",
        answer:
          "Non è un prodotto d'investimento e non promette rendimenti: una supply che si riduce non aumenta meccanicamente il valore.",
      },
      {
        question: "Chi può aiutarmi se qualcosa va storto?",
        answer:
          "Nessuno può cambiare le regole contro di voi, e nessuno può intervenire per aiutarvi: non esiste un'assistenza che annulli una transazione o recuperi una chiave persa.",
      },
      {
        question: "Il codice è sicuro?",
        answer: "Il codice è stato auditato; non è perfetto.",
      },
    ],
    terms: { label: "Avvertenze complete", href: links.terms },
  },

  footer: {
    nav: [
      { label: "Protocol paper", href: links.protocolPaper },
      { label: "GitHub", href: links.github },
      { label: "X", href: links.x },
      { label: "Telegram", href: links.telegram },
      { label: "Avvertenze legali", href: links.terms },
    ],
    official:
      "**L'unico indirizzo ufficiale è daimon.money. L'app vive su app.daimon.money. Qualsiasi altra cosa non siamo noi.**",
    disclaimer:
      'Daimon è software sperimentale open source fornito "così com\'è", senza garanzie. Nulla qui è un\'offerta, una sollecitazione o una consulenza finanziaria. Interagite direttamente con contratti immutabili su una blockchain pubblica, a vostro rischio. Gli asset digitali possono perdere tutto il loro valore. Dove questa pagina e il codice distribuito non concordano, l\'unica autorità è il codice.',
  },
};
