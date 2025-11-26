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

## Neu in v1.1.0

### Agent Framework
- **ResearcherAgent**: Autonome Rechtsrecherche mit konfigurierbarer Autonomie
- **CaseManager**: Intelligente Fallverwaltung und Präzedenzfallanalyse
- **IntegratedResearchSystem**: Orchestrierung von Agent, Case Manager und Datenbank

### Autonomie-Modi
- **CAUTIOUS**: Maximale Benutzeraufsicht (Standard)
- **BALANCED**: Automatische Routineentscheidungen
- **AUTONOMOUS**: Minimale Benutzerinteraktion für komplexe Recherchen

### Datenbankinfrastruktur
- SQLite-basiertes Caching-System
- BGE und Kantonsgerichtsentscheidungen
- Persistente Fallverwaltung

---

## Systemanforderungen

- **Betriebssystem**: macOS, Linux oder Windows
- **Python**: 3.11 oder höher
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

### Schritt 2: Python-Umgebung einrichten

```bash
# Virtuelle Umgebung erstellen
python3 -m venv venv

# Aktivieren (macOS/Linux)
source venv/bin/activate

# Aktivieren (Windows)
.\venv\Scripts\activate

# Abhängigkeiten installieren
pip install -r requirements.txt
```

### Schritt 3: MCP-Server installieren

```bash
cd mcp-servers

# Entscheidsuche-Server (BGE und Kantonsgerichte)
cd entscheidsuche && npm install && npm run build && cd ..

# Legal Citations Server
cd legal-citations && npm install && npm run build && cd ..

# BGE Search Server
cd bge-search && npm install && npm run build && cd ..
```

### Schritt 4: API-Schlüssel konfigurieren

Erstellen Sie eine `.env`-Datei im Projektstammverzeichnis:

```bash
ANTHROPIC_API_KEY=ihr_api_schlüssel
TAVILY_API_KEY=ihr_tavily_schlüssel  # Optional für Web-Recherche
```

### Schritt 5: Installation überprüfen

```bash
# Python-Tests ausführen
pytest

# MCP-Server-Tests ausführen
cd mcp-servers/legal-citations && npm test
```

---

## Befehle

### Rechtsrecherche-Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `/legal:research` | Schweizer Rechtsquellen durchsuchen |
| `/legal:analyze` | Rechtliche Argumente analysieren |
| `/legal:compare` | Präzedenzfälle vergleichen |
| `/legal:strategy` | Prozessstrategie entwickeln |
| `/legal:draft` | Rechtsdokumente erstellen |

### Agent-Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `/agent:researcher` | Autonome Rechtsrecherche starten |
| `/agent:researcher --mode cautious` | Mit maximaler Benutzeraufsicht |
| `/agent:researcher --mode balanced` | Mit ausgewogener Autonomie |
| `/agent:researcher --mode autonomous` | Mit minimaler Interaktion |

### Hilfsbefehle

| Befehl | Beschreibung |
|--------|--------------|
| `/legal:help` | Befehlshilfe anzeigen |
| `/legal:version` | Versionsinformationen anzeigen |

---

## Anwendungsbeispiele

### Rechtsrecherche

```bash
# Claude Code starten
claude

# BGE-Recherche
"Suche BGE zu Art. 97 OR Vertragshaftung"

# Mit Agent-Framework
"/agent:researcher 'Finde alle relevanten BGE zu Mietrecht und Kündigungsschutz'"
```

### Fallstrategie

```bash
"Analysiere die Prozessstrategie für einen Vertragsbruch unter Art. 97 OR"
```

### Dokumentenerstellung

```bash
"Erstelle einen Dienstleistungsvertrag nach Schweizer OR für Softwareentwicklung"
```

### Präzedenzfallanalyse

```bash
"/legal:compare 'BGE 123 III 456' 'BGE 130 III 789'"
```

---

## MCP-Server

### Entscheidsuche-Server
Durchsucht bundesgericht.ch und kantonale Gerichte nach Entscheidungen.

### Legal Citations Server
Verifiziert und formatiert Zitierungen nach Schweizer Standards:
- BGE-Format (BGE 123 III 456)
- Kantonale Formate (ZH, BE, GE, BS, VD, TI)
- Mehrsprachige Anpassung

### BGE Search Server
Spezialisierte Suche in BGE-Entscheidungen mit:
- Volltextsuche
- Filterung nach Rechtsgebiet
- Zeitraumeinschränkung

---

## Fehlerbehebung

### Python-Umgebung
```bash
# Virtuelle Umgebung neu erstellen
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### MCP-Server-Probleme
```bash
# Node-Module neu installieren
cd mcp-servers/legal-citations
rm -rf node_modules
npm install
npm run build
```

### API-Schlüssel
Stellen Sie sicher, dass die `.env`-Datei korrekt konfiguriert ist und die Schlüssel gültig sind.

---

## Weitere Ressourcen

- [Englische Dokumentation](../../README.md)
- [Agent-Architektur](../../docs/AGENT_ARCHITECTURE.md)
- [Befehlsreferenz](../../docs/command-reference.md)
- [Framework-Architektur](../../../.claude/BETTERASK.md)

---

*BetterCallClaude v1.1.0 - Rechtliche Intelligenz für die Schweizer Anwaltschaft*
