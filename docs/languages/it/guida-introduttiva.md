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

## Requisiti di Sistema

- **Sistema operativo**: macOS, Linux o Windows
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

### Passo 2: Installare le dipendenze

```bash
npm install
```

### Passo 3: Configurare i server MCP

```bash
cd mcp-servers
npm install
npm run build
```

### Passo 4: Configurare le chiavi API

Crea un file `.env` nella radice del progetto:

```bash
ANTHROPIC_API_KEY=la_tua_chiave_api
TAVILY_API_KEY=la_tua_chiave_tavily  # Opzionale
```

---

## Primi Passi

### Ricerca Giuridica

```bash
# Avviare Claude Code
claude

# In Claude Code, chiedi:
"Cerca DTF sulla responsabilità contrattuale art. 97 CO"
```

### Strategia del Caso

```bash
"Analizza la strategia processuale per una violazione del contratto ai sensi dell'art. 97 CO"
```

### Redazione di Documenti

```bash
"Redigi un contratto di servizi secondo il CO svizzero per lo sviluppo software"
```

---

## Comandi

- `/legal:research` - Cerca nelle fonti giuridiche svizzere
- `/legal:help` - Mostra l'aiuto dei comandi
- `/agent:researcher` - Ricerca giuridica autonoma

---

## Risorse Aggiuntive

- [Documentazione in inglese](../../getting-started.md)
- [Tutorial sui workflow](../../workflows/)
- [Architettura del framework](../../../.claude/BETTERASK.md)

---

*BetterCallClaude v1.0.0 - Intelligenza Giuridica per gli Avvocati Svizzeri*
