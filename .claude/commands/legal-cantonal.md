# /legal:cantonal - Force Cantonal Law Mode

**Explicitly force Cantonal Law Mode for Swiss cantonal legal analysis.**

---

## Activation Confirmation

✅ **BetterCallClaude Framework: ACTIVE**
📖 **Mode**: Cantonal Law (Forced Override)
🏛️ **Canton**: [Specified Canton]
⚡ **Activation**: Explicit via `/legal:cantonal [CANTON]` command

---

## What This Command Does

When you use `/legal:cantonal [CANTON]`, you **force Cantonal Law Mode** for the specified canton:

- ✅ Cantonal statutes and regulations
- ✅ Cantonal court decisions
- ✅ Cantonal procedural rules
- ✅ Overrides federal law auto-detection

---

## Supported Cantons (v1.0)

| Code | Canton | Language | Population | Legal System |
|------|--------|----------|------------|--------------|
| **ZH** | Zürich | German | 1.5M | Commercial law hub |
| **BE** | Bern | DE/FR | 1.0M | Bilingual, capital |
| **GE** | Genève | French | 500K | International law |
| **BS** | Basel-Stadt | German | 200K | Pharmaceutical law |
| **VD** | Vaud | French | 800K | Western Switzerland |
| **TI** | Ticino | Italian | 350K | Southern Switzerland |

---

## Usage Examples

### Zürich Cantonal Law
```
/legal:cantonal ZH
What are the court fees for commercial litigation in Zürich?
```

### Geneva Cantonal Procedure
```
/legal:cantonal GE
Procédure de référé au Tribunal de première instance de Genève
```

### Ticino Cantonal Law (Italian)
```
/legal:cantonal TI
Procedura civile presso il Tribunale di Lugano
```

### Bern Bilingual Analysis
```
/legal:cantonal BE
Gerichtsgebühren im Kanton Bern / Frais de justice dans le canton de Berne
```

---

## Cantonal Law Coverage

### Cantonal Statutes
- Cantonal implementation of federal law
- Canton-specific regulations (building, tax, administrative)
- Cantonal court organization laws

### Cantonal Procedure
- Cantonal civil procedure rules (ZPO implementation)
- Cantonal administrative procedure
- Cantonal court fee schedules

### Cantonal Courts
- Cantonal Supreme Court (Obergericht/Tribunal cantonal)
- Commercial courts (Handelsgericht/Tribunal de commerce)
- Administrative courts (Verwaltungsgericht/Tribunal administratif)

---

## Response Format

```
🎭 Persona: [Auto-detected based on query]
📖 Mode: Cantonal Law (/legal:cantonal [CANTON] activated)
🏛️ Canton: [Canton Name]
🌐 Language: [Primary canton language]

[Cantonal legal analysis with cantonal court decisions and regulations...]
```

---

## Multi-Lingual Cantonal Analysis

### German Cantons (ZH, BE, BS)
```
/legal:cantonal ZH
Handelsgericht Zürich - Zuständigkeit bei kommerziellen Streitigkeiten
```

### French Cantons (GE, VD, BE)
```
/legal:cantonal GE
Tribunal de première instance de Genève - compétence en matière commerciale
```

### Italian Canton (TI)
```
/legal:cantonal TI
Tribunale di appello del Canton Ticino - competenza in materia commerciale
```

---

## Integration with Federal Law

**Hybrid Analysis Available**:
- Cantonal procedure + Federal substantive law
- Federal law with cantonal implementation
- Comparative federal vs. cantonal approaches

**Example**:
```
/legal:cantonal ZH
Art. 97 OR breach of contract litigation in Zürich Commercial Court

Result: Federal OR law (Art. 97) + Zürich cantonal procedure (ZPO implementation)
```

---

## Integration with Personas

`/legal:cantonal [CANTON]` works with ALL personas:

- **Legal Researcher** + `/legal:cantonal ZH` = Zürich court decision research
- **Case Strategist** + `/legal:cantonal GE` = Geneva litigation strategy
- **Legal Drafter** + `/legal:cantonal VD` = Vaud court submission drafting

---

## Canton-Specific Features

### Zürich (ZH)
- **Handelsgericht** (Commercial Court)
- Specialized commercial law expertise
- Efficient commercial dispute resolution

### Geneva (GE)
- **Tribunal de première instance**
- International law expertise
- French legal tradition

### Bern (BE)
- **Bilingual courts** (DE/FR)
- Federal capital jurisdiction
- Mixed linguistic legal tradition

### Basel-Stadt (BS)
- **Pharmaceutical law** specialization
- Cross-border legal issues
- Chemical/pharmaceutical industry expertise

### Vaud (VD)
- **French legal culture**
- Lausanne court system
- Western Switzerland legal hub

### Ticino (TI)
- **Italian legal tradition**
- Southern Switzerland jurisdiction
- Cross-border Italy-Switzerland issues

---

## Related Commands

- `/legal:federal` - Force Federal Law Mode
- `/legal:research` - Activate Legal Researcher persona
- `/legal:strategy` - Activate Case Strategist persona
- `/legal:draft` - Activate Legal Drafter persona
- `/legal:help` - Show all available legal commands

---

## MCP Servers Active

When `/legal:cantonal [CANTON]` is activated:

1. **entscheidsuche** - Cantonal court decision search
2. **legal-citations** - Cantonal citation verification
3. **sequential-thinking** - Cantonal legal reasoning analysis

---

## Error Handling

**Invalid Canton Code**:
```
/legal:cantonal XX
→ Error: Canton 'XX' not supported. Valid cantons: ZH, BE, GE, BS, VD, TI
```

**Missing Canton Code**:
```
/legal:cantonal
→ Error: Please specify canton code. Example: /legal:cantonal ZH
```

---

**You are now in Cantonal Law Mode for [CANTON]. Ask your cantonal law question.**
