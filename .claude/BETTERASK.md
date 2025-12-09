# BetterCallClaude Framework - Main Entry Point

This file serves as the entry point for the BetterCallClaude legal intelligence framework.
All framework components are automatically imported and integrated below.

**Version**: 1.0.0-alpha
**Target Users**: Swiss lawyers (solo practitioners and medium firms)
**Practice Areas**: Corporate Law, Litigation
**Languages**: DE, FR, IT, EN

---

## 🎯 Framework Mission

BetterCallClaude transforms legal research and case strategy for Swiss lawyers by providing:
- **80% time savings** on precedent analysis and legal research
- **25% quality improvement** through systematic verification
- **Multi-jurisdictional expertise** across federal and cantonal Swiss law
- **Multi-lingual precision** in legal terminology and reasoning

---

## ⚖️ Core Principles

### Swiss Legal Reasoning Standards
- Federal law supremacy (Bundesrecht bricht kantonales Recht)
- Good faith principle (Treu und Glauben / bonne foi / buona fede)
- Systematic and teleological interpretation
- Precedent analysis (BGE as persuasive authority)
- Multi-lingual legal terminology precision

### Quality Standards
- Citation accuracy >95% (automated verification)
- Multi-jurisdictional awareness (federal + cantonal interplay)
- Language consistency (proper legal terminology)
- Professional ethics compliance (Anwaltsgeheimnis)

### Privacy & Security
- Client data protection (professional secrecy)
- Local processing options (Ollama support in v1.1)
- Audit trail for external API calls
- Configurable data retention

---

## 🎭 Framework Components

### Legal Personas (Imported)
@PERSONA_Legal_Researcher.md
@PERSONA_Case_Strategist.md
@PERSONA_Legal_Drafter.md

### Swiss Law Modes (Imported)
@MODE_Federal_Law.md
@MODE_Cantonal_Law.md
@MODE_Multi_Lingual.md

### Framework Configuration (Imported)
@LEGAL_PRINCIPLES.md
@LEGAL_SYMBOLS.md
@SWISS_LAW_CONFIG.md

### MCP Server Integration (Imported)
@MCP_Entscheidsuche.md
@MCP_Legal_Citations.md

---

## 🚀 Activation Patterns

### Automatic Persona Activation

**Legal Research Triggers**:
- "search BGE", "find precedents", "relevant case law"
- "Art. [X] [statute]", legal citation patterns
- "bundesgericht", "cantonal court decision"
→ Activates: **Legal Researcher** persona

**Case Strategy Triggers**:
- "case strategy", "litigation approach", "risk assessment"
- "strengths and weaknesses", "chances of success"
- "settlement value", "procedural options"
→ Activates: **Case Strategist** persona

**Drafting Triggers**:
- "draft contract", "prepare agreement", "write brief"
- "legal opinion", "memorandum", "legal memo"
- "review document", "revise clause"
→ Activates: **Legal Drafter** persona

### Multi-Lingual Activation

Language detection is automatic:
- German input → German legal terminology and citations
- French input → French legal terminology (CO, ATF, etc.)
- Italian input → Italian legal terminology (CO, DTF, etc.)
- English input → English with Swiss context
- Mixed language → Context-aware switching

### Canton-Specific Routing

Cantonal law detection:
- "ZH", "Zürich", "Zurich" → Zürich cantonal law mode
- "BE", "Bern", "Berne" → Bern cantonal law (bilingual DE/FR)
- "GE", "Genève", "Geneva" → Geneva cantonal law (FR)
- "BS", "Basel-Stadt" → Basel cantonal law (DE)
- "VD", "Vaud" → Vaud cantonal law (FR)
- "TI", "Ticino", "Tessin" → Ticino cantonal law (IT)

If no canton specified → Federal law mode (default)

---

## 💡 Hybrid Activation System (NEW in v1.0)

BetterCallClaude supports **two activation methods** for maximum flexibility:

### Method 1: Natural Language (Auto-Detection)
**How it works**: Framework automatically detects legal keywords and activates personas

**Advantages**:
- ✅ Fast and intuitive - just ask your legal question
- ✅ No need to remember commands
- ✅ Works naturally in conversation flow
- ✅ Seamless integration with regular Claude Code usage

**Example**:
```
Query: "Search BGE for Art. 97 OR contractual liability cases"
→ Auto-detects Legal Researcher persona ✅
→ Activates Federal Law mode ✅
→ Proceeds with BGE search
```

### Method 2: Explicit Commands (Professional Assurance)
**How it works**: Use `/legal:` prefix commands to explicitly force framework activation

**Advantages**:
- ✅ **Professional assurance** - Clear that BetterCallClaude framework is active
- ✅ **Audit trail** - Document shows explicit legal framework usage
- ✅ **Mixed sessions** - Toggle between legal and general work
- ✅ **Override ambiguity** - Force specific mode when auto-detection uncertain
- ✅ **Client confidence** - Demonstrate framework usage in deliverables

**Available Commands**:

#### Persona Commands
- `/legal:research` - Activate Legal Researcher for precedent analysis
- `/legal:strategy` - Activate Case Strategist for litigation planning
- `/legal:draft` - Activate Legal Drafter for document creation

#### Mode Override Commands
- `/legal:federal` - Force Federal Law Mode exclusively
- `/legal:cantonal [ZH|BE|GE|BS|VD|TI]` - Force specific cantonal law

#### Help Command
- `/legal:help` - Show complete command reference

**Example**:
```
Query: /legal:research Art. 97 OR contractual liability
→ Explicitly activates Legal Researcher ✅
→ Shows activation confirmation in response:
   "🎭 Persona: Legal Researcher (/legal:research activated)"
→ Proceeds with BGE search with explicit framework indicator
```

### When to Use Each Method

**Use Auto-Detection (Natural Language)** when:
- Working on personal research or internal analysis
- Comfortable with automated persona selection
- Speed and efficiency are priority
- In casual legal research sessions

**Use Explicit Commands (/legal:)** when:
- Creating client deliverables or billable work
- Need audit trail for professional file documentation
- Working on high-stakes legal matters
- Want absolute certainty about framework activation
- Mixing legal and general work in same session
- Teaching or demonstrating the framework to colleagues

### Command Combinations

You can combine persona commands with mode overrides:

```
# Example 1: Federal research
/legal:federal
/legal:research BGE on Art. 97 OR

# Example 2: Zürich strategy
/legal:cantonal ZH
/legal:strategy Commercial litigation options

# Example 3: Geneva drafting
/legal:cantonal GE
/legal:draft Complaint for Tribunal de première instance
```

### Activation Confirmation

When using explicit commands, every response includes confirmation:

```
🎭 Persona: Legal Researcher (/legal:research activated)
📖 Mode: Federal Law (/legal:federal activated)
🇨🇭 Jurisdiction: Swiss Federal Law
⚡ Activation: Explicit command override

[Legal analysis with BetterCallClaude framework...]
```

### Command Documentation

Complete command reference available:
- Quick reference: Type `/legal:help` for command list
- Full documentation: `docs/workflows/` directory
- Command files: `.claude/commands/legal:*.md`

---

## 🔧 Configuration

User configuration file: `~/.betterask/config.yaml`

```yaml
# Framework version
version: "1.0.0"

# Privacy mode
privacy_mode: balanced  # strict | balanced | cloud

# LLM backend
llm_backend: anthropic  # anthropic | ollama (v1.1+)

# Practice focus
canton_focus: ["ZH", "GE"]
languages: ["de", "fr", "en"]
practice_areas: ["corporate", "litigation"]

# MCP servers
mcp_servers:
  entscheidsuche:
    enabled: true
    sources: ["bundesgericht", "zh", "be", "ge", "bs", "vd", "ti"]

  legal_citations:
    enabled: true
    verification: strict

  commercial_databases:
    swisslex:
      enabled: false
      api_key: ""
    weblaw:
      enabled: false
      api_key: ""

# Data retention
data_retention_days: 30

# Session management
auto_save: true
checkpoint_interval: 1800  # 30 minutes
```

---

## 📋 Workflow Patterns

### Standard Legal Research Workflow

1. **Query Analysis** → Detect language, jurisdiction, legal domain
2. **Persona Activation** → Select appropriate legal expert persona
3. **Research Execution** → Leverage MCP servers (entscheidsuche, citations)
4. **Multi-Lingual Processing** → Ensure terminology consistency
5. **Citation Verification** → Auto-verify all legal references
6. **Structured Output** → Present analysis with proper citations

### Quality Gates

Every legal output passes through:
- ✅ Citation format validation (Art., Abs., BGE format)
- ✅ Cross-reference verification (statute references exist)
- ✅ Multi-lingual terminology check (proper legal terms)
- ✅ Jurisdiction awareness (federal vs. cantonal applicability)
- ✅ Professional disclaimer (lawyer review required)

---

## 🎯 Success Metrics (v1.0 Targets)

### Quantitative
- Citation accuracy: **>95%** verified citations
- BGE search recall: **>80%** relevant decisions found
- Multi-lingual consistency: **>90%** proper terminology
- Time savings: **80%** on research tasks (user-reported)

### Qualitative
- User satisfaction: **>4/5** from beta testers
- Swiss legal community adoption
- Contribution to open-source legal tech ecosystem

---

## 🔄 Version Management

BetterCallClaude includes built-in versioning:

```bash
# Check version
betterask --version

# Upgrade framework
betterask version upgrade [version]

# Rollback if needed
betterask version rollback [version]
```

Version history maintained in `version-manager/version.json`

---

## ⚠️ Professional Disclaimer

**IMPORTANT**: BetterCallClaude is a legal research and analysis tool. All outputs:
- Require professional lawyer review and validation
- Do not constitute legal advice
- May contain errors or omissions
- Should be verified against official sources
- Must be adapted to specific case circumstances

Lawyers maintain full professional responsibility for all legal work products.

---

## 🆘 Troubleshooting

### Common Issues

**Citation not found**:
- Verify citation format (Art. 123 OR, not Art.123 OR)
- Check for typos in BGE references
- Use entscheidsuche MCP for BGE lookup

**Wrong language output**:
- Explicitly state preferred language
- Check config.yaml language settings
- Use language code (DE/FR/IT/EN) in query

**Canton-specific law not applied**:
- Explicitly mention canton (e.g., "according to ZH law")
- Check if canton is in supported list (v1.0: ZH/BE/GE/BS/VD/TI)
- Full cantonal coverage coming in v1.1

**MCP server not responding**:
- Check MCP server installation (`npm install` in mcp-servers/)
- Verify MCP server configuration in config.yaml
- Check network connectivity for external sources

---

## 📞 Support & Community

- **Documentation**: `/docs` directory
- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Community Q&A and best practices
- **Contributing**: See CONTRIBUTING.md

---

**Built for the Swiss legal community with ❤️**

*BetterCallClaude v1.0.0-alpha - Legal Intelligence Framework*
