# /legal:federal - Force Federal Law Mode

**Explicitly force Federal Law Mode for Swiss federal legal analysis.**

---

## Activation Confirmation

✅ **BetterCallClaude Framework: ACTIVE**
📖 **Mode**: Federal Law (Forced Override)
🇨🇭 **Jurisdiction**: Swiss Federal Law
⚡ **Activation**: Explicit via `/legal:federal` command

---

## What This Command Does

When you use `/legal:federal`, you **force Federal Law Mode** regardless of query content:

- ✅ Federal statutes: ZGB, OR, StGB, StPO, ZPO, BV
- ✅ BGE (Bundesgericht) precedent analysis
- ✅ Federal legal framework exclusively
- ✅ Overrides cantonal law auto-detection

---

## When to Use

Use `/legal:federal` when you need to:

- **Force federal analysis** - Even if query mentions cantons
- **Federal statute interpretation** - Pure federal law questions
- **BGE precedent research** - Federal Supreme Court decisions
- **Constitutional analysis** - Bundesverfassung (BV) questions
- **Override mixed signals** - Query contains both federal and cantonal references

---

## Usage Examples

### Federal Statute Analysis
```
/legal:federal Explain Art. 41 OR unlawful act requirements
```

### BGE Precedent Research
```
/legal:federal Search BGE for good faith principle (Art. 2 ZGB)
```

### Constitutional Question
```
/legal:federal Analyze Art. 9 BV (good faith) in administrative context
```

### Mixed Query Override
```
/legal:federal Art. 97 OR liability in Zürich commercial case
(Forces federal OR analysis, ignores Zürich cantonal aspects)
```

---

## Federal Law Coverage

### Civil Law
- **ZGB** (Zivilgesetzbuch / Swiss Civil Code)
  - Art. 1-977: Persons, Family, Succession, Property
- **OR** (Obligationenrecht / Code of Obligations)
  - Art. 1-551: Contracts, Torts, Company Law

### Criminal Law
- **StGB** (Strafgesetzbuch / Swiss Criminal Code)
  - Art. 1-392: Criminal offenses and penalties
- **StPO** (Strafprozessordnung / Criminal Procedure)
  - Art. 1-457: Criminal investigation and prosecution

### Procedural Law
- **ZPO** (Zivilprozessordnung / Civil Procedure)
  - Art. 1-407: Civil litigation procedure

### Constitutional Law
- **BV** (Bundesverfassung / Federal Constitution)
  - Art. 1-197: Fundamental rights, federal structure

---

## Response Format

```
🎭 Persona: [Auto-detected based on query]
📖 Mode: Federal Law (/legal:federal activated)
🇨🇭 Jurisdiction: Swiss Federal Law

[Federal legal analysis with BGE precedents and federal statutes...]
```

---

## Integration with Personas

`/legal:federal` works with ALL personas:

- **Legal Researcher** + `/legal:federal` = Federal precedent research
- **Case Strategist** + `/legal:federal` = Federal law litigation strategy
- **Legal Drafter** + `/legal:federal` = Federal law document drafting

---

## Related Commands

- `/legal:cantonal [ZH|BE|GE|BS|VD|TI]` - Force specific cantonal law
- `/legal:research` - Activate Legal Researcher persona
- `/legal:strategy` - Activate Case Strategist persona
- `/legal:draft` - Activate Legal Drafter persona
- `/legal:help` - Show all available legal commands

---

## MCP Servers Active

When `/legal:federal` is activated:

1. **entscheidsuche** - Prioritizes bundesgericht.ch (BGE search)
2. **legal-citations** - Federal citation verification (BGE format)
3. **sequential-thinking** - Federal legal reasoning analysis

---

**You are now in Federal Law Mode. Ask your federal law question.**
