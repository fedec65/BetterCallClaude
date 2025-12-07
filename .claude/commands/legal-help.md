# /legal:help - BetterCallClaude Command Reference

**Complete reference for all BetterCallClaude `/legal:` commands and activation methods.**

---

## 🎯 Quick Start

BetterCallClaude works in **two ways**:

1. **Natural Language** (Auto-Detection) - Just ask your legal question
2. **Explicit Commands** (Professional Assurance) - Use `/legal:` prefix

Both methods activate the same powerful legal framework!

---

## 📚 Persona Commands

### `/legal:research` - Legal Research & Precedent Analysis
**Activates**: Legal Researcher persona 📚

**Use for**:
- BGE/ATF/DTF precedent search and analysis
- Swiss statutory analysis (ZGB, OR, StGB, StPO, ZPO, BV)
- Multi-lingual legal research (DE/FR/IT/EN)
- Citation verification and formatting

**Examples**:
```
/legal:research Art. 97 OR contractual liability
/legal:research BGE precedents on foreseeability
/legal:research ATF sur la responsabilité contractuelle (art. 97 CO)
```

---

### `/legal:strategy` - Case Strategy & Litigation Planning
**Activates**: Case Strategist persona ⚔️

**Use for**:
- Litigation strategy development
- Evidence-based risk probability assessment
- Procedural strategy analysis (ZPO federal + cantonal)
- Settlement value calculation

**Examples**:
```
/legal:strategy Analyze breach of contract case, CHF 500,000 damages
/legal:strategy Calculate settlement range for commercial dispute
/legal:strategy Zürich Commercial Court procedural options
```

---

### `/legal:draft` - Document Creation & Drafting
**Activates**: Legal Drafter persona ✍️

**Use for**:
- Contract drafting (Swiss OR framework)
- Court submissions (complaints, responses, appeals)
- Legal opinions and memoranda
- Multi-lingual document creation

**Examples**:
```
/legal:draft Service agreement under Swiss OR
/legal:draft Complaint for Zürich Commercial Court, Art. 97 OR
/legal:draft Legal opinion on Art. 41 OR liability
```

---

## 🇨🇭 Mode Override Commands

### `/legal:federal` - Force Federal Law Mode
**Forces**: Swiss federal law analysis exclusively

**Use for**:
- Federal statute interpretation (ZGB, OR, StGB, StPO, ZPO, BV)
- BGE precedent research
- Constitutional analysis (Bundesverfassung)
- Override mixed federal/cantonal signals

**Examples**:
```
/legal:federal Explain Art. 41 OR requirements
/legal:federal Search BGE for Art. 2 ZGB good faith
/legal:federal Art. 9 BV constitutional analysis
```

---

### `/legal:cantonal [CANTON]` - Force Cantonal Law Mode
**Forces**: Specific cantonal law analysis

**Supported Cantons**: ZH, BE, GE, BS, VD, TI

**Use for**:
- Cantonal court decisions and procedure
- Cantonal implementation of federal law
- Canton-specific regulations
- Multi-lingual cantonal analysis

**Examples**:
```
/legal:cantonal ZH
Court fees for Zürich Commercial Court litigation

/legal:cantonal GE
Procédure de référé au Tribunal de première instance

/legal:cantonal TI
Procedura civile presso il Tribunale di Lugano
```

---

## 🔄 Auto-Detection vs. Explicit Commands

### Auto-Detection (Natural Language)
**How it works**: BetterCallClaude detects legal keywords and activates automatically

**Trigger Keywords**:
- Research: "search BGE", "find precedents", "Art. X"
- Strategy: "case strategy", "litigation", "settlement value"
- Drafting: "draft contract", "legal opinion", "complaint"

**Example**:
```
Natural query: "Search BGE for Art. 97 OR cases"
→ Auto-detects and activates Legal Researcher ✅
```

---

### Explicit Commands (/legal: prefix)
**How it works**: You explicitly force framework activation with `/legal:` commands

**Why use explicit commands?**
- ✅ **Professional assurance** - Clear framework activation for clients
- ✅ **Audit trail** - Document shows explicit legal framework usage
- ✅ **Mixed sessions** - Toggle between legal and general work
- ✅ **Override ambiguity** - Force specific mode when auto-detection uncertain

**Example**:
```
Explicit command: /legal:research Art. 97 OR cases
→ Forces Legal Researcher activation ✅
→ Shows explicit activation confirmation in response
```

---

## 🎭 Command Combinations

You can combine persona commands with mode overrides:

### Legal Research + Federal Law
```
/legal:federal
/legal:research BGE on Art. 97 OR
```

### Case Strategy + Cantonal Law
```
/legal:cantonal ZH
/legal:strategy Commercial litigation in Zürich
```

### Legal Drafting + Cantonal Procedure
```
/legal:cantonal GE
/legal:draft Complaint for Geneva Tribunal
```

---

## 🌐 Multi-Lingual Usage

All commands work in **DE/FR/IT/EN**:

### German
```
/legal:research Art. 97 OR Vertragsverletzung
```

### French
```
/legal:research art. 97 CO violation de contrat
```

### Italian
```
/legal:research art. 97 CO violazione del contratto
```

### English
```
/legal:research Art. 97 OR breach of contract
```

---

## 📋 Command Summary Table

| Command | Persona | Use Case | Example |
|---------|---------|----------|---------|
| `/legal:research` | Legal Researcher 📚 | Precedent research, statutory analysis | BGE search, citation verification |
| `/legal:strategy` | Case Strategist ⚔️ | Litigation planning, risk assessment | Settlement value, procedural options |
| `/legal:draft` | Legal Drafter ✍️ | Document creation, contracts | Service agreements, court complaints |
| `/legal:federal` | [Mode Override] | Federal law exclusive analysis | Federal statutes, BGE precedents |
| `/legal:cantonal [CANTON]` | [Mode Override] | Cantonal law specific analysis | Cantonal courts, local procedure |
| `/legal:help` | [Reference] | Command documentation | This help document |

---

## 🤖 Specialized Agent Commands

### Core Agents (Pipeline)
| Command | Agent | Domain |
|---------|-------|--------|
| `/agent:researcher` | ResearcherAgent | Automated legal research workflows |
| `/agent:strategist` | StrategistAgent | Case strategy development |
| `/agent:drafter` | DrafterAgent | Legal document drafting |
| `/agent:orchestrator` | AgentOrchestrator | Multi-agent pipeline coordination |

### Specialized Domain Agents
| Command | Agent | Domain |
|---------|-------|--------|
| `/agent:citation` | Citation Specialist | BGE citation verification, formatting |
| `/agent:compliance` | Compliance Officer | FINMA, AML/KYC, regulatory compliance |
| `/agent:data-protection` | Data Protection Specialist | GDPR, nDSG/FADP, privacy |
| `/agent:risk` | Risk Analyst | Case outcome probability, damages quantification |
| `/agent:procedure` | Procedure Specialist | ZPO/StPO deadlines, procedural rules |
| `/agent:translator` | Legal Translator | DE/FR/IT legal terminology |
| `/agent:fiscal` | Fiscal Legal Expert | Tax law, DTA, fiscal implications |
| `/agent:corporate` | Corporate & Commercial | M&A, corporate governance, contracts |
| `/agent:cantonal` | Cantonal Law Expert | 26 cantons legal systems |
| `/agent:realestate` | Real Estate Expert | Property law, Grundbuch, Lex Koller |

---

## 🚀 Quick Examples

### Research Federal Precedents
```
/legal:research Search BGE for Art. 41 OR tort liability
```

### Plan Litigation Strategy
```
/legal:strategy Analyze CHF 300,000 breach of contract case
```

### Draft Swiss Contract
```
/legal:draft Service agreement, 6 months, CHF 150,000, IP transfer
```

### Force Federal Analysis
```
/legal:federal Explain Art. 2 ZGB good faith principle
```

### Zürich Cantonal Analysis
```
/legal:cantonal ZH
Handelsgericht Zürich commercial litigation procedure
```

---

## 🔧 MCP Servers Integration

When you use `/legal:` commands, these MCP servers are activated:

- **entscheidsuche**: Swiss court decision search (bundesgericht.ch + cantonal)
- **legal-citations**: Citation verification and multi-lingual formatting
- **sequential-thinking**: Complex legal reasoning and analysis

---

## ❓ Troubleshooting

### "Command not working"
- Ensure you're using the correct syntax: `/legal:research` not `/legal research`
- Check canton code is valid: ZH, BE, GE, BS, VD, TI (not ZU, GN, etc.)

### "Auto-detection not activating"
- Use explicit command to force activation: `/legal:research`
- Ensure query contains legal keywords: "BGE", "Art. X", "contract"

### "Wrong persona activated"
- Use explicit command to override: `/legal:strategy` instead of relying on auto-detection
- Combine with mode override if needed: `/legal:federal` then `/legal:research`

---

## 📚 Additional Resources

- **Getting Started Guide**: `docs/getting-started.md`
- **Research Workflow**: `docs/workflows/research-precedents.md`
- **Strategy Workflow**: `docs/workflows/case-strategy.md`
- **Drafting Workflow**: `docs/workflows/draft-contracts.md`

---

## 💡 Tips for Best Results

1. **Be Specific**: "Art. 97 OR foreseeability" > "contract damages"
2. **Use Citations**: Include Art. references and BGE citations
3. **Specify Jurisdiction**: Mention canton for cantonal analysis
4. **Choose Language**: Query in preferred language (DE/FR/IT/EN)
5. **Combine Commands**: Use mode overrides with persona commands

---

**BetterCallClaude v1.0.0-alpha - Built for Swiss Legal Professionals**

For more help: [GitHub Issues](https://github.com/yourusername/bettercallclaude/issues)
