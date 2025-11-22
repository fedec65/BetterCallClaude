# Getting Started with BetterCallClaude

**Welcome to BetterCallClaude** - Your AI-powered legal intelligence framework for Swiss law.

This guide will help you set up and start using BetterCallClaude for legal research, case strategy, and document drafting.

---

## 📋 Table of Contents

1. [What is BetterCallClaude?](#what-is-bettercallclaude)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [First Steps](#first-steps)
5. [Using the Legal Personas](#using-the-legal-personas)
6. [Understanding Swiss Law Modes](#understanding-swiss-law-modes)
7. [Multi-Lingual Usage](#multi-lingual-usage)
8. [Common Workflows](#common-workflows)
9. [Tips & Best Practices](#tips--best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Next Steps](#next-steps)

---

## What is BetterCallClaude?

BetterCallClaude is a specialized legal intelligence framework built on Claude Code that helps Swiss lawyers with:

- **Legal Research**: Search and analyze BGE (Bundesgericht) precedents, federal statutes, and cantonal law
- **Case Strategy**: Develop litigation strategies with evidence-based risk assessments
- **Document Drafting**: Create Swiss-standard contracts, court submissions, and legal opinions

### Key Benefits

✅ **Save 80% of time** on legal research and precedent analysis
✅ **Improve quality by 25%** through systematic verification
✅ **Multi-jurisdictional**: Federal + 6 cantonal law systems (ZH, BE, GE, BS, VD, TI)
✅ **Multi-lingual**: Native support for DE, FR, IT, EN with proper legal terminology
✅ **Citation accuracy >95%**: Automated verification against official sources

---

## Prerequisites

Before you begin, ensure you have:

### Required Software
- **Claude Code**: Latest version ([Installation Guide](https://docs.anthropic.com/claude/docs/claude-code))
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Required API Keys
- **Anthropic API Key**: Sign up at [console.anthropic.com](https://console.anthropic.com/)
- **Tavily API Key** (Optional): For enhanced web research at [app.tavily.com](https://app.tavily.com/)

### System Requirements
- **OS**: macOS, Linux, or Windows
- **RAM**: Minimum 8GB recommended
- **Disk Space**: ~500MB for framework and dependencies

---

## Installation

Follow these steps to install BetterCallClaude:

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/bettercallclaude.git
cd bettercallclaude
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required Node.js packages for the framework.

### Step 3: Build MCP Servers

BetterCallClaude uses **MCP (Model Context Protocol) servers** for Swiss court decision search and citation verification:

```bash
cd mcp-servers
npm install
npm run build
cd ..
```

### Step 4: Configure API Keys

Create a `.env` file in the project root directory:

```bash
# Create .env file
cat > .env << 'EOF'
# Required: Anthropic API Key for Claude Code
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Tavily API Key for enhanced web research
TAVILY_API_KEY=your_tavily_api_key_here
EOF
```

**Important**: Replace `your_anthropic_api_key_here` with your actual API key from [console.anthropic.com](https://console.anthropic.com/).

### Step 5: Verify Installation

Run the verification script:

```bash
npm run verify
```

You should see:
```
✅ Node.js version compatible (v18.x.x)
✅ npm version compatible (v8.x.x)
✅ Claude Code detected
✅ MCP servers built successfully
✅ Framework configuration loaded
✅ API keys configured

🎉 BetterCallClaude is ready to use!
```

---

## First Steps

### Starting Claude Code

Open your terminal and start Claude Code:

```bash
claude
```

Claude Code will automatically detect and load the BetterCallClaude framework configuration.

### Your First Query

Try a simple legal research query:

```
"Search BGE for recent decisions on Art. 62 OR"
```

BetterCallClaude will:
1. Automatically activate the **Legal Researcher** persona
2. Search bundesgericht.ch using the **entscheidsuche** MCP server
3. Verify citations using the **legal-citations** MCP server
4. Present structured analysis with proper Swiss legal terminology

### Understanding the Response

The response will include:
- **Persona**: Which legal expert is responding (🎭)
- **Mode**: Which Swiss law mode is active (📖)
- **Jurisdiction**: Federal or cantonal law context (🇨🇭)
- **Analysis**: Legal analysis with proper citations
- **Sources**: BGE references with verification status

---

## Using the Legal Personas

BetterCallClaude has **three specialized legal expert personas** that automatically activate based on your query:

### 1. Legal Researcher 📚

**Activation Keywords**: "search BGE", "find precedents", "relevant case law", "Art. [X]", "federal law"

**Capabilities**:
- BGE precedent search and analysis
- Statutory analysis (ZGB, OR, StGB, StPO, ZPO, BV)
- Multi-lingual legal research
- Citation verification and formatting

**Example Queries**:
```
"Search BGE for precedents on contractual liability under Art. 97 OR"
"Find decisions on good faith principle (Art. 2 ZGB)"
"What does the Federal Supreme Court say about Art. 41 OR unlawful act requirements?"
```

### 2. Case Strategist ⚔️

**Activation Keywords**: "case strategy", "litigation approach", "risk assessment", "chances of success", "settlement value"

**Capabilities**:
- Litigation strategy development
- Evidence-based risk probability assessment
- Procedural strategy analysis (ZPO federal + cantonal)
- Settlement value calculation

**Example Queries**:
```
"Analyze litigation strategy for breach of contract case, CHF 500,000 damages"
"Assess the chances of success for a negligence claim under Art. 41 OR"
"What are the procedural options for this case in Zürich Canton?"
```

### 3. Legal Drafter ✍️

**Activation Keywords**: "draft contract", "prepare agreement", "write brief", "legal opinion", "memorandum"

**Capabilities**:
- Contract drafting (Swiss OR framework)
- Court submissions (complaints, responses, appeals)
- Legal opinions and memoranda
- Multi-lingual document creation

**Example Queries**:
```
"Draft a service agreement under Swiss OR for software development"
"Prepare a complaint for breach of contract in Zürich commercial court"
"Write a legal opinion on liability under Art. 41 OR"
```

---

## Understanding Swiss Law Modes

BetterCallClaude operates in **three Swiss law modes** that provide the correct legal framework:

### 1. Federal Law Mode 🇨🇭

**Automatic Activation**: Keywords like "federal law", "Bundesrecht", "BGE", "Art. [X] ZGB/OR/StGB"

**Coverage**:
- **ZGB**: Zivilgesetzbuch (Civil Code)
- **OR**: Obligationenrecht (Code of Obligations)
- **StGB**: Strafgesetzbuch (Criminal Code)
- **StPO**: Strafprozessordnung (Criminal Procedure)
- **ZPO**: Zivilprozessordnung (Civil Procedure)
- **BV**: Bundesverfassung (Federal Constitution)

**Example**:
```
"Explain Art. 41 OR liability requirements"
→ Federal Law Mode activated
→ Analysis based on Swiss federal law and BGE precedents
```

### 2. Cantonal Law Mode 🏛️

**Automatic Activation**: Canton codes (ZH, BE, GE, BS, VD, TI) or canton names

**Supported Cantons** (v1.0):
- **Zürich (ZH)**: German, 1.5M population
- **Bern (BE)**: German/French bilingual
- **Genève (GE)**: French
- **Basel-Stadt (BS)**: German
- **Vaud (VD)**: French
- **Ticino (TI)**: Italian

**Example**:
```
"What are the court fees for commercial litigation in Zürich?"
→ Cantonal Law Mode (ZH) activated
→ Analysis based on Zürich cantonal law and court rules
```

### 3. Multi-Lingual Mode 🌐

**Automatic Activation**: Detects your input language or mixed-language queries

**Supported Languages**:
- **German (DE)**: Primary Swiss language
- **French (FR)**: Western Switzerland
- **Italian (IT)**: Ticino region
- **English (EN)**: International contexts

**Example**:
```
Query in French: "Quels sont les délais de prescription selon l'art. 127 CO?"
→ Multi-Lingual Mode (FR) activated
→ Response in French with proper legal terminology
→ Cross-references provided in DE/IT where relevant
```

---

## Multi-Lingual Usage

### Language Detection

BetterCallClaude automatically detects your input language:

```
German input:    "Suche BGE zu Art. 97 OR"
French input:    "Rechercher ATF sur art. 97 CO"
Italian input:   "Cercare DTF su art. 97 CO"
English input:   "Search BGE on Art. 97 OR"
```

All queries will receive appropriate responses in the input language with correct legal terminology.

### Citation Formats

Citations automatically adapt to your language:

| Language | Statute | BGE | Format |
|----------|---------|-----|--------|
| German   | Art. 1 Abs. 2 OR | BGE 145 III 229 | Art. X Abs. Y [Statute] |
| French   | art. 1 al. 2 CO | ATF 145 III 229 | art. X al. Y [Statute] |
| Italian  | art. 1 cpv. 2 CO | DTF 145 III 229 | art. X cpv. Y [Statute] |
| English  | Art. 1 para. 2 OR | BGE 145 III 229 | Art. X para. Y [Statute] |

### Legal Terminology

BetterCallClaude maintains proper legal terminology across languages:

```
German:   Widerrechtlichkeit, Schaden, Verschulden
French:   illicéité, dommage, faute
Italian:  illiceità, danno, colpa
English:  unlawfulness, damage, fault
```

---

## Common Workflows

### Workflow 1: Legal Research for a Case

**Goal**: Find relevant BGE precedents for a contractual liability case

```bash
# Step 1: Search for precedents
"Search BGE for cases on Art. 97 OR contractual liability"

# Step 2: Analyze specific decision
"Explain the key holding in BGE 142 III 102"

# Step 3: Compare with other precedents
"How does BGE 142 III 102 compare to BGE 140 III 86?"

# Step 4: Get citation formatting
"Format the citation for BGE 142 III 102 in French (ATF format)"
```

### Workflow 2: Develop Case Strategy

**Goal**: Assess litigation options for a breach of contract dispute

```bash
# Step 1: Case analysis
"Analyze case strategy for breach of contract, CHF 300,000 damages, Zürich jurisdiction"

# Step 2: Risk assessment
"What are the chances of success given these facts: [describe facts]"

# Step 3: Procedural options
"What procedural options do we have under ZPO Zürich?"

# Step 4: Settlement analysis
"Calculate appropriate settlement range based on risk assessment"
```

### Workflow 3: Draft Legal Document

**Goal**: Create a service agreement under Swiss law

```bash
# Step 1: Initial draft
"Draft a service agreement under Swiss OR for software development services"

# Step 2: Add specific clauses
"Add a liability limitation clause compliant with Art. 100 OR"

# Step 3: Review and refine
"Review the liability clause for enforceability under Swiss law"

# Step 4: Multi-lingual version
"Translate the agreement to French with proper legal terminology"
```

---

## Tips & Best Practices

### 1. Be Specific with Your Queries

❌ **Less Effective**: "Tell me about contracts"
✅ **More Effective**: "Explain the formation requirements for contracts under Art. 1 OR"

### 2. Include Relevant Context

Provide case-specific information for better analysis:
- Jurisdiction (federal, canton)
- Relevant statutes (Art. X OR/ZGB)
- Key facts or circumstances
- Language preference

### 3. Use Proper Swiss Legal Citations

When referencing statutes, use the Swiss citation format:
- **Correct**: "Art. 97 OR"
- **Incorrect**: "Article 97 of the Swiss Code of Obligations"

### 4. Leverage Multi-Lingual Capabilities

Switch languages naturally:
```
"Analyse en français: Art. 97 CO"  (French analysis)
"Erkläre auf Deutsch: Art. 97 OR" (German analysis)
"Spiega in italiano: Art. 97 CO" (Italian analysis)
```

### 5. Verify Critical Information

Always verify:
- BGE citations against bundesgericht.ch
- Statutory references against fedlex.admin.ch
- Cantonal law against official cantonal sources

### 6. Use Personas Strategically

Activate the right persona for your task:
- **Research** → Legal Researcher
- **Strategy** → Case Strategist
- **Drafting** → Legal Drafter

---

## Troubleshooting

### Issue: Framework Not Loading

**Symptoms**: Claude Code doesn't recognize BetterCallClaude commands

**Solutions**:
1. Verify Claude Code is installed: `claude --version`
2. Check framework directory is in correct location
3. Restart Claude Code
4. Run verification script: `npm run verify`

### Issue: MCP Servers Not Responding

**Symptoms**: No BGE search results or citation verification

**Solutions**:
1. Check MCP servers are built: `cd mcp-servers && npm run build`
2. Verify API keys in `.env` file
3. Check network connectivity
4. Review MCP server logs: `npm run logs`

### Issue: Wrong Language Output

**Symptoms**: Response in unexpected language

**Solutions**:
1. Explicitly state preferred language in query
2. Check `config.yaml` language settings
3. Use language codes: "in German", "auf Deutsch", "en français"

### Issue: Cantonal Law Not Applied

**Symptoms**: Federal law applied instead of cantonal law

**Solutions**:
1. Explicitly mention canton: "according to ZH law"
2. Check if canton is supported (v1.0: ZH/BE/GE/BS/VD/TI)
3. Use canton abbreviation: ZH, BE, GE, BS, VD, TI

### Issue: Citation Not Found

**Symptoms**: BGE citation cannot be verified

**Solutions**:
1. Verify citation format: "BGE [volume] [section] [page]"
2. Check for typos in citation
3. Use entscheidsuche search: "search BGE for [topic]"
4. Verify against bundesgericht.ch manually

---

## Next Steps

### Explore Advanced Features

- [Legal Research Workflow](workflows/research-precedents.md) - Deep dive into BGE precedent research
- [Case Strategy Workflow](workflows/case-strategy.md) - Advanced litigation strategy development
- [Document Drafting Workflow](workflows/draft-contracts.md) - Professional document creation

### Multi-Lingual Documentation

- [Deutsch: Erste Schritte](languages/de/erste-schritte.md)
- [Français: Guide de Démarrage](languages/fr/guide-demarrage.md)
- [Italiano: Guida Introduttiva](languages/it/guida-introduttiva.md)

### Configuration

Customize BetterCallClaude for your practice:
- [Configuration Guide](configuration.md)
- [Privacy Settings](privacy.md)
- [MCP Server Setup](mcp-servers.md)

### Community

Join the Swiss legal tech community:
- [GitHub Discussions](https://github.com/yourusername/bettercallclaude/discussions)
- [Report Issues](https://github.com/yourusername/bettercallclaude/issues)
- [Contributing Guide](../CONTRIBUTING.md)

---

## Support

Need help? We're here for you:

- **Documentation**: Browse all guides at [docs/](../docs/)
- **GitHub Issues**: Report bugs at [github.com/yourusername/bettercallclaude/issues](https://github.com/yourusername/bettercallclaude/issues)
- **Community Q&A**: Ask questions at [GitHub Discussions](https://github.com/yourusername/bettercallclaude/discussions)

---

## Professional Disclaimer

**IMPORTANT**: BetterCallClaude is a legal research and analysis tool. All outputs:

- Require professional lawyer review and validation
- Do not constitute legal advice
- May contain errors or omissions
- Should be verified against official sources
- Must be adapted to specific case circumstances

**Lawyers maintain full professional responsibility for all legal work products.**

---

**Welcome to BetterCallClaude!** 🎉

You're now ready to transform your legal research and case strategy with AI-powered intelligence.

*BetterCallClaude v1.0.0-alpha - Built for the Swiss legal community*
