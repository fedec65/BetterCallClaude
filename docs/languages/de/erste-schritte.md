# Erste Schritte mit BetterCallClaude

**Rechtliche Intelligenz für Schweizer Anwälte**

---

## Übersicht

BetterCallClaude ist ein umfassendes Framework für rechtliche Intelligenz, das Schweizer Anwälten folgendes bietet:

- **80% Zeitersparnis** bei der Präzedenzfallanalyse und Rechtsrecherche
- **25% Qualitätsverbesserung** durch systematische Verifizierung
- **Multi-jurisdiktionelle Expertise** im Bundes- und Kantonsrecht (ZH, BE, GE, BS, VD, TI)
- **Mehrsprachige Präzision** in rechtlicher Terminologie (DE, FR, IT, EN)

---

## Systemanforderungen

- **Betriebssystem**: macOS, Linux oder Windows
- **Node.js**: v18.0.0 oder höher
- **npm**: v8.0.0 oder höher
- **Claude Code**: Neueste Version

---

## Installation

### Schritt 1: Repository klonen

```bash
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: MCP-Server konfigurieren

```bash
cd mcp-servers
npm install
npm run build
```

### Schritt 4: API-Schlüssel konfigurieren

Erstellen Sie eine `.env`-Datei im Projektstammverzeichnis:

```bash
ANTHROPIC_API_KEY=ihr_api_schlüssel
TAVILY_API_KEY=ihr_tavily_schlüssel  # Optional
```

---

## Erste Schritte

### Rechtsrecherche

```bash
# Claude Code starten
claude

# In Claude Code fragen:
"Suche BGE zu Art. 97 OR Vertragshaftung"
```

### Fallstrategie

```bash
"Analysiere die Prozessstrategie für einen Vertragsbruch unter Art. 97 OR"
```

### Dokumentenerstellung

```bash
"Erstelle einen Dienstleistungsvertrag nach Schweizer OR für Softwareentwicklung"
```

---

## Befehle

- `/legal:research` - Schweizer Rechtsquellen durchsuchen
- `/legal:help` - Befehlshilfe anzeigen
- `/agent:researcher` - Autonome Rechtsrecherche

---

## Weitere Ressourcen

- [Englische Dokumentation](../../getting-started.md)
- [Workflow-Tutorials](../../workflows/)
- [Framework-Architektur](../../../.claude/BETTERASK.md)

---

*BetterCallClaude v1.0.0 - Rechtliche Intelligenz für die Schweizer Anwaltschaft*
