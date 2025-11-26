# Guida Introduttiva - BetterCallClaude

**Intelligenza Giuridica per Avvocati Svizzeri**

---

## Panoramica

BetterCallClaude è un framework completo di intelligenza giuridica che offre agli avvocati svizzeri:

- **80% di risparmio di tempo** nell'analisi dei precedenti e nella ricerca giuridica
- **25% di miglioramento della qualità** attraverso la verifica sistematica
- **Competenza multi-giurisdizionale** nel diritto federale e cantonale (ZH, BE, GE, BS, VD, TI)
- **Precisione multilingue** nella terminologia giuridica (DE, FR, IT, EN)

---

## Novità v1.1.0

### Framework degli Agenti
- **ResearcherAgent**: Ricerca giuridica autonoma con autonomia configurabile
- **CaseManager**: Gestione intelligente dei casi e analisi dei precedenti
- **IntegratedResearchSystem**: Orchestrazione di agente, case manager e database

### Modalità di Autonomia
- **CAUTIOUS**: Massima supervisione dell'utente (predefinita)
- **BALANCED**: Decisioni di routine automatiche
- **AUTONOMOUS**: Interazione minima per ricerche complesse

### Infrastruttura Database
- Sistema di cache basato su SQLite
- Decisioni DTF e tribunali cantonali
- Gestione persistente dei casi

---

## Requisiti di Sistema

- **Sistema operativo**: macOS, Linux o Windows
- **Python**: 3.11 o superiore
- **Node.js**: v18.0.0 o superiore
- **npm**: v8.0.0 o superiore
- **Claude Code**: Ultima versione

---

## Installazione

### Passo 1: Clonare il repository

```bash
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude
```

### Passo 2: Configurare l'ambiente Python

```bash
# Creare un ambiente virtuale
python3 -m venv venv

# Attivare (macOS/Linux)
source venv/bin/activate

# Attivare (Windows)
.\venv\Scripts\activate

# Installare le dipendenze
pip install -r requirements.txt
```

### Passo 3: Installare i server MCP

```bash
cd mcp-servers

# Server Entscheidsuche (DTF e tribunali cantonali)
cd entscheidsuche && npm install && npm run build && cd ..

# Server Legal Citations
cd legal-citations && npm install && npm run build && cd ..

# Server BGE Search
cd bge-search && npm install && npm run build && cd ..
```

### Passo 4: Configurare le chiavi API (Opzionale)

> **Nota**: Quando si utilizza BetterCallClaude tramite Claude Code CLI, non sono richieste chiavi API per le funzionalità di base. Claude Code gestisce l'autenticazione automaticamente. Le chiavi opzionali seguenti abilitano funzionalità avanzate.

Crea un file `.env` nella radice del progetto solo se hai bisogno delle funzionalità opzionali:

```bash
# Opzionale - Per capacità di ricerca web avanzate
TAVILY_API_KEY=la_tua_chiave_tavily

# Opzionale - Per utilizzo avanzato/autonomo
# Necessario solo se esegui componenti Python al di fuori di Claude Code
ANTHROPIC_API_KEY=la_tua_chiave_api
```

### Passo 5: Verificare l'installazione

```bash
# Eseguire i test Python
pytest

# Eseguire i test del server MCP
cd mcp-servers/legal-citations && npm test
```

---

## Comandi

### Comandi di Ricerca Giuridica

| Comando | Descrizione |
|---------|-------------|
| `/legal:research` | Cerca nelle fonti giuridiche svizzere |
| `/legal:analyze` | Analizza gli argomenti giuridici |
| `/legal:compare` | Confronta i precedenti |
| `/legal:strategy` | Sviluppa una strategia processuale |
| `/legal:draft` | Redigi documenti giuridici |

### Comandi Agente

| Comando | Descrizione |
|---------|-------------|
| `/agent:researcher` | Avvia la ricerca giuridica autonoma |
| `/agent:researcher --mode cautious` | Con massima supervisione |
| `/agent:researcher --mode balanced` | Con autonomia equilibrata |
| `/agent:researcher --mode autonomous` | Con interazione minima |

### Comandi di Aiuto

| Comando | Descrizione |
|---------|-------------|
| `/legal:help` | Mostra l'aiuto dei comandi |
| `/legal:version` | Mostra le informazioni sulla versione |

---

## Esempi di Utilizzo

### Ricerca Giuridica

```bash
# Avviare Claude Code
claude

# Ricerca DTF
"Cerca DTF sulla responsabilità contrattuale art. 97 CO"

# Con il Framework degli Agenti
"/agent:researcher 'Trova tutti i DTF rilevanti sul diritto di locazione e la protezione contro le disdette'"
```

### Strategia del Caso

```bash
"Analizza la strategia processuale per una violazione del contratto ai sensi dell'art. 97 CO"
```

### Redazione di Documenti

```bash
"Redigi un contratto di servizi secondo il CO svizzero per lo sviluppo software"
```

### Analisi dei Precedenti

```bash
"/legal:compare 'DTF 123 III 456' 'DTF 130 III 789'"
```

---

## Server MCP

### Server Entscheidsuche
Cerca le decisioni su bundesgericht.ch e tribunali cantonali.

### Server Legal Citations
Verifica e formatta le citazioni secondo gli standard svizzeri:
- Formato DTF (DTF 123 III 456)
- Formati cantonali (ZH, BE, GE, BS, VD, TI)
- Adattamento multilingue

### Server BGE Search
Ricerca specializzata nelle decisioni DTF con:
- Ricerca nel testo integrale
- Filtro per area giuridica
- Restrizione del periodo

---

## Risoluzione dei Problemi

### Ambiente Python
```bash
# Ricreare l'ambiente virtuale
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Problemi del Server MCP
```bash
# Reinstallare i moduli Node
cd mcp-servers/legal-citations
rm -rf node_modules
npm install
npm run build
```

### Chiavi API
Assicurati che il file `.env` sia configurato correttamente e che le chiavi siano valide.

---

## Risorse Aggiuntive

- [Documentazione in inglese](../../README.md)
- [Architettura degli Agenti](../../docs/AGENT_ARCHITECTURE.md)
- [Riferimento dei Comandi](../../docs/command-reference.md)
- [Architettura del Framework](../../../.claude/BETTERASK.md)

---

*BetterCallClaude v1.1.0 - Intelligenza Giuridica per gli Avvocati Svizzeri*
