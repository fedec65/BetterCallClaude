# Product Requirements Document
## BetterCallClaude v2.0
### Legal Intelligence Framework for Swiss Lawyers

**Document Version:** 2.0  
**Date:** November 16, 2025  
**Author:** Federico Cesconi, CEO SandSIV AG  
**Status:** Draft for Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Market Analysis](#market-analysis)
3. [Product Architecture](#product-architecture)
4. [Core Features](#core-features)
5. [Technical Specifications](#technical-specifications)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Success Metrics](#success-metrics)
8. [Risk Management](#risk-management)

---

## Executive Summary

### Vision
Transform BetterCallClaude into the leading AI-powered legal intelligence platform for Swiss lawyers, inspired by the architectural excellence of the SuperClaude Framework.

### Strategic Objectives
1. **80% reduction** in legal research time
2. **25% improvement** in legal work quality
3. **>95% accuracy** in citation verification
4. **Full Anwaltsgeheimnis compliance** via local deployment option
5. **Complete cantonal coverage** (all 26 Swiss cantons by v2.5)

### Key Innovations

**1. Slash Command System (30+ Commands)**
Inspired by SuperClaude's command architecture:
- `/legal:research` - Multi-source legal research
- `/legal:analyze-case` - Comprehensive case analysis
- `/legal:draft-contract` - Swiss contract generation
- `/legal:strategy` - AI case strategy development
- [Plus 26 more specialized commands]

**2. Legal Expert Personas (12 Personas)**
Domain-specialized AI behaviors:
- Legal Researcher 🔍
- Case Strategist ⚖️
- Contract Drafter 📝
- Citation Specialist 📚
- Risk Analyst ⚠️
- [Plus 7 more experts]

**3. MCP Server Integration (8 Servers)**
Swiss legal data sources:
- BGE Search - Federal Supreme Court
- Cantonal Courts - 26 cantons
- Legal Citations - 500K+ verified citations
- Fedlex - Federal legislation
- [Plus 4 more data sources]

---

## Market Analysis

### Market Size
- **Total Market:** CHF 8.5B Swiss legal services annually
- **Lawyers:** ~11,000 practicing
- **Law Firms:** ~4,200 firms
- **Corporate Legal:** ~1,500 departments

### Target Segments

| Segment | Count | Annual Tech Spend | Priority |
|---------|-------|-------------------|----------|
| Large Firms (100+ attorneys) | 15 | CHF 200K-500K | High |
| Mid Firms (20-100) | 150 | CHF 50K-200K | High |
| Small Firms (5-20) | 800 | CHF 10K-50K | Medium |
| Corporate Legal | 1,500 | CHF 50K-300K | High |

### Competitive Landscape

| Competitor | Strength | Weakness | Our Advantage |
|------------|----------|----------|---------------|
| **Swisslex** | Comprehensive DB | CHF 3K/year, no AI | AI-powered, 1/3 cost |
| **Weblaw** | Good coverage | Traditional search | Intelligent analysis |
| **ChatGPT** | General AI | No Swiss law, hallucinations | Legal-specific, verified |

---

## Product Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│         BetterCallClaude Framework v2.0             │
├─────────────────────────────────────────────────────┤
│  Command Layer (30 Slash Commands)                  │
│    ↓                                                 │
│  Persona Layer (12 Legal Experts)                   │
│    ↓                                                 │
│  MCP Integration (8 Data Sources)                   │
│    ↓                                                 │
│  LLM Backend (Cloud/Local/Hybrid)                   │
└─────────────────────────────────────────────────────┘
```

### Architecture Principles (from SuperClaude)

1. **Behavioral Instruction Injection**
   - Personas defined in markdown files
   - Auto-activation based on command context
   - Composable behaviors

2. **MCP Server Orchestration**
   - Parallel data source querying
   - Intelligent result merging
   - Graceful degradation

3. **Privacy-First Routing**
   - Cloud for public research
   - Local for confidential matters
   - Hybrid with user control

---

## Core Features

### 1. Research Commands (8 commands)

**FR-001: Multi-Source Legal Research**

```bash
/legal:research "Vertragsauslegung Vertrauensprinzip" \
  --depth deep \
  --jurisdictions federal,ZH,GE \
  --date-from 2020-01-01
```

**Features:**
- Search BGE (1875-present) + 6 cantonal courts
- AI-powered relevance ranking
- Multi-lingual query support (DE/FR/IT/EN)
- Citation extraction and verification
- Response time: <5 seconds (standard)

**Research Depth Levels:**

| Depth | Sources | Time | Use Case |
|-------|---------|------|----------|
| Quick | 5-10 | ~2min | Simple questions |
| Standard | 10-20 | ~5min | General research |
| Deep | 20-40 | ~8min | Complex issues |
| Exhaustive | 40+ | ~15min | Appellate briefs |

### 2. Analysis Commands (6 commands)

**FR-004: Strategic Case Analysis**

```bash
/legal:analyze-case @case-facts.pdf \
  --jurisdiction ZH \
  --claim-amount 2300000
```

**Analysis Dimensions:**
1. Legal Merit Score (0-100)
2. Win Probability (based on precedents)
3. Risk Assessment Matrix
4. Procedural Options
5. Strategic Recommendations
6. Cost-Benefit Analysis

**Output:** Comprehensive analysis report with:
- Executive summary
- Strengths/weaknesses analysis
- Precedent support (with citations)
- Risk quantification
- Recommended strategy

### 3. Drafting Commands (7 commands)

**FR-006: Swiss Contract Generation**

```bash
/legal:draft-contract "Share Purchase Agreement" \
  --language de \
  --jurisdiction ZH \
  --purchase-price 5000000 \
  --clauses "warranty,indemnity,non-compete"
```

**Contract Types (v2.0):**
1. Share Purchase Agreements
2. Asset Purchase Agreements
3. Shareholders Agreements
4. Employment Contracts
5. NDAs
6. Consulting Agreements
7. License Agreements
8. Lease Agreements
9. Loan Agreements
10. [Template library: 500+ clauses]

**Quality Standards:**
- ✅ Proper Swiss legal structure
- ✅ Verified OR/ZGB citations
- ✅ Multi-lingual precision
- ✅ Risk annotations
- ✅ Market-standard language

### 4. Compliance Commands (4 commands)

**FR-008: GDPR/DSG Compliance Analysis**

```bash
/legal:gdpr-analyze @privacy-policy.pdf \
  --standard swiss-dsg \
  --cross-border-transfers
```

**Compliance Checks:**
- Legal basis verification (Art. 6 GDPR/DSG)
- Cross-border transfer assessment
- Data subject rights implementation
- Privacy by design review
- Gap analysis with recommendations

---

## Technical Specifications

### Technology Stack

**Backend:**
- Python 3.11+ (core framework)
- FastAPI (MCP communication)
- SQLAlchemy (ORM)
- Pydantic (validation)

**MCP Servers:**
- Node.js + TypeScript
- Express.js (REST APIs)
- Puppeteer (web scraping)

**Data Storage:**
- SQLite (local cache, 500K+ citations)
- Chroma (vector database for semantic search)
- PostgreSQL (optional: multi-user)

**AI/ML:**
- LLM: Claude Sonnet 4.5 (cloud) or Ollama (local)
- Embeddings: voyage-large-2-instruct
- NLP: spaCy (legal entity recognition)

### Privacy Architecture

**Three Deployment Modes:**

1. **Cloud Mode** (Default v2.0)
   - Backend: Anthropic API
   - Use: Non-confidential research
   - Performance: Best (fastest, highest quality)
   - Cost: ~CHF 0.02/query

2. **Local Mode** (v2.1+)
   - Backend: Ollama + fine-tuned LLaMA
   - Use: Confidential client matters
   - Performance: 90% of cloud quality
   - Cost: Hardware investment (CHF 3-10K)

3. **Hybrid Mode** (v2.2+)
   - Intelligent routing based on data sensitivity
   - Public research → Cloud
   - Client data → Local
   - Best of both worlds

**Data Classification:**
```python
class DataSensitivity:
    CONFIDENTIAL = "confidential"  # Always local
    SENSITIVE = "sensitive"        # User choice
    PUBLIC = "public"             # Cloud OK
```

### MCP Server Specifications

**1. BGE Search MCP**
- Data Source: bundesgericht.ch
- Coverage: BGE 1875-present (~150K decisions)
- Update Frequency: Weekly
- Response Time: <2 seconds
- Caching: Local SQLite

**2. Cantonal Courts MCP**
- v2.0 Coverage: ZH, BE, GE, BS, VD, TI
- v2.5 Coverage: All 26 cantons
- Data Sources: Canton-specific websites
- Update Frequency: Bi-weekly

**3. Legal Citations Validator**
- Database: 500K+ verified citations
- Accuracy: >99% for BGE citations
- Formats: BGE/ATF/DTF (multi-lingual)
- Dead link detection

**4. Fedlex Legislation MCP**
- API: Official Fedlex REST API
- Coverage: Complete Swiss federal law
- Historical versions support
- Multi-lingual parallel text

---

## Implementation Roadmap

### Phase 1: v2.0 - Foundation (Q1 2026)

**Duration:** 3 months  
**Team:** 2 developers + 1 legal consultant  
**Budget:** CHF 120,000

**Deliverables:**
- [x] 30 slash commands
- [x] 12 legal personas
- [x] 6 MCP servers (BGE, Cantonal x6, Citations, Fedlex, Glossary, Deadlines)
- [x] Citation verification (>95% accuracy)
- [x] Multi-lingual support (DE/FR/IT/EN)
- [x] Cloud deployment

**Success Criteria:**
- ✅ >95% citation accuracy
- ✅ <5 sec response time
- ✅ 5 pilot law firms
- ✅ NPS > 50

### Phase 2: v2.1 - Local Deployment (Q2 2026)

**Duration:** 2 months  
**Budget:** CHF 80,000

**Deliverables:**
- [ ] Ollama integration
- [ ] Swiss legal fine-tuned LLaMA
- [ ] Docker containerization
- [ ] On-premises deployment
- [ ] Enhanced audit trail

**Success Criteria:**
- ✅ Local mode = 90% cloud quality
- ✅ <10 sec inference time
- ✅ 3 on-premises deployments

### Phase 3: v2.2 - Advanced Features (Q3 2026)

**Duration:** 3 months  
**Budget:** CHF 150,000

**Deliverables:**
- [ ] Legal doctrine search
- [ ] Contract clause recommendation
- [ ] Workflow automation
- [ ] Analytics dashboard
- [ ] Citation network analysis

### Phase 4: v2.5 - Complete Coverage (Q4 2026)

**Duration:** 3 months  
**Budget:** CHF 180,000

**Deliverables:**
- [ ] All 26 cantons
- [ ] 5 additional practice areas
- [ ] Commercial DB integrations
- [ ] Enterprise features (multi-user, DMS integration)

**Total Investment Year 1:** CHF 530K

---

## Success Metrics

### Adoption Metrics (Year 1 Targets)

| Metric | Target |
|--------|--------|
| Total Users | 500 lawyers |
| Law Firms | 50 firms |
| Enterprise Clients | 3 firms (100+ attorneys) |
| Monthly Active Users | 450 |
| NPS | >50 |

### Quality Metrics

| Metric | Target |
|--------|--------|
| Citation Accuracy | >95% |
| Legal Content Accuracy | >90% |
| Hallucination Rate | <2% |
| Response Time (P95) | <5 sec (standard research) |
| System Uptime | 99.5% |

### Business Metrics (Year 2)

| Metric | Target |
|--------|--------|
| Annual Recurring Revenue | CHF 500K |
| Customer Acquisition Cost | CHF 500 |
| Lifetime Value | CHF 5,000 |
| LTV:CAC Ratio | 10:1 |
| Monthly Churn | <5% |

### Efficiency Metrics

| Metric | Target |
|--------|--------|
| Research Time Savings | 80% |
| Contract Drafting Time Savings | 60% |
| Citation Error Reduction | 25% |
| Cost Savings per Lawyer/Year | CHF 10K+ |

---

## Risk Management

### Technical Risks

**Risk 1: AI Hallucination**
- **Impact:** Critical
- **Probability:** Medium (15-30%)
- **Mitigation:**
  - Citation verification pipeline
  - Confidence scores on outputs
  - Human-in-the-loop workflows
  - Continuous accuracy testing
- **Contingency:** E&O insurance, clear disclaimers

**Risk 2: LLM Provider Dependency**
- **Impact:** High
- **Probability:** Low (5-10%)
- **Mitigation:**
  - Multi-backend support (Anthropic + Ollama)
  - Local inference option
  - SLA with Anthropic
- **Contingency:** 3-month prepaid credits, rapid provider switch

**Risk 3: Data Source Changes**
- **Impact:** Medium
- **Probability:** High (40-60% annually)
- **Mitigation:**
  - Robust scraping architecture
  - Multiple fallback selectors
  - Official API priority
- **Contingency:** 48h SLA for scraper fixes

### Legal & Regulatory Risks

**Risk 4: Anwaltsgeheimnis Compliance**
- **Impact:** Critical
- **Probability:** Low (1-5%)
- **Mitigation:**
  - Local deployment option
  - Privacy-first architecture
  - Swiss Bar consultation
- **Contingency:** Legal defense fund (CHF 100K)

**Risk 5: Professional Liability**
- **Impact:** Critical
- **Probability:** Low (1-5%)
- **Mitigation:**
  - Clear disclaimers
  - E&O insurance (CHF 5M)
  - Quality assurance (>95% accuracy)
- **Contingency:** Legal defense protocol

### Market Risks

**Risk 6: Low Adoption (Conservative Market)**
- **Impact:** High
- **Probability:** Medium (20-30%)
- **Mitigation:**
  - Pilot programs with respected firms
  - Education & training
  - Gradual adoption path
- **Contingency:** Extended runway (18 months), focus on early adopters

**Risk 7: Competitive Entry**
- **Impact:** Medium
- **Probability:** Medium (30-40% within 2 years)
- **Mitigation:**
  - First-mover advantage
  - Superior Swiss expertise
  - Lower cost
- **Contingency:** Acquisition opportunity, niche focus

---

## Appendices

### A. Swiss Legal System Overview

**Federal Structure:**
- Federal Law (ZGB, OR, StGB, ZPO, StPO)
- Cantonal Law (26 cantons, own legislation)
- Municipal Law (local regulations)

**Court System:**
- Bundesgericht (Federal Supreme Court) → BGE decisions
- Cantonal Courts (vary by canton)
- Example: Zürich: Bezirksgericht → Obergericht → Bundesgericht

**Citation Format:**
- German: BGE 142 III 102
- French: ATF 142 III 102
- Italian: DTF 142 III 102
- Same decision, different language abbreviation

### B. Competitive Analysis

| Feature | BetterCall | Swisslex | Weblaw | ChatGPT |
|---------|------------|----------|--------|---------|
| Swiss Law Expertise | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| AI Analysis | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Citation Accuracy | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Local Deployment | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | ⭐ |
| Cost/Lawyer/Year | CHF 1.2K | CHF 3K+ | CHF 2.5K+ | CHF 240 |

**Competitive Advantages:**
1. Only AI-powered Swiss legal tool with verified citations
2. 1/3 the cost of traditional databases
3. Case strategy + drafting (not just research)
4. Local deployment for Anwaltsgeheimnis compliance
5. Modern CLI interface

### C. Sample Workflows

**Workflow 1: M&A Transaction**
1. Due diligence research: `/legal:research "Verkäuferhaftung Software"`
2. Risk assessment: `/legal:assess-risk @dd-report.pdf`
3. Draft SPA: `/legal:draft-contract "SPA" --price 10M`
4. Compliance check: `/legal:compliance-check @draft-spa.docx`
**Time Savings:** 60% (40h → 16h)

**Workflow 2: Litigation Brief**
1. Precedent research: `/legal:research "Art. 97 OR Schadensersatz"`
2. Case analysis: `/legal:analyze-case @facts.pdf`
3. Argument development: `/legal:argument "breach of warranty"`
4. Draft brief: `/legal:draft-brief --type statement-of-claim`
5. Cite check: `/legal:cite-check @brief.docx --auto-fix`
**Time Savings:** 75% (30h → 7.5h)

---

## Document Control

**Version:** 2.0  
**Date:** November 16, 2025  
**Status:** Draft for Development  
**Next Review:** December 2025  

**Contact:**  
Federico Cesconi  
CEO & Co-Founder, SandSIV AG  
federico@sandsiv.com  
https://github.com/fedec65/BetterCallClaude

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

*This PRD represents a comprehensive plan to transform BetterCallClaude into a production-ready legal intelligence platform for Swiss lawyers, inspired by the architectural excellence of the SuperClaude Framework.*
