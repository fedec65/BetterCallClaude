# BetterCallClaude Project Overview

## Purpose
BetterCallClaude is a legal intelligence framework for Swiss lawyers, built on Claude Code. It provides AI-powered legal research, case strategy development, and document drafting capabilities with deep understanding of Swiss federal and cantonal law.

## Version
- Current: 1.0.0-alpha
- Status: Foundation Phase - 60% Complete

## Target Users
- Swiss lawyers (solo practitioners and medium firms)
- Practice Areas: Corporate Law, Litigation
- Languages: German (DE), French (FR), Italian (IT), English (EN)

## Core Success Targets
- 80% time savings on legal research and precedent analysis
- 25% quality improvement through systematic verification
- >95% citation accuracy via automated verification

## Key Features
- Multi-jurisdictional Swiss law support (Federal + 6 major cantons: ZH, BE, GE, BS, VD, TI)
- Multi-lingual native support (DE/FR/IT/EN) with legal terminology precision
- Legal research with BGE precedent analysis and statute lookup
- Case strategy development with risk assessment
- Document drafting with Swiss-standard compliance
- Privacy-first design (Anwaltsgeheimnis compliant)
- Open source (MIT licensed)

## Architecture Components

### Legal Personas (3 in v1.0)
- Legal Researcher: Precedent analysis, statute lookup
- Case Strategist: Strategy development, risk assessment (IN PROGRESS)
- Legal Drafter: Document generation (IN PROGRESS)

### Swiss Law Modes
- Federal Law Mode: ZGB, OR, StGB, StPO, ZPO
- Cantonal Law Mode: ZH, BE, GE, BS, VD, TI (IN PROGRESS)
- Multi-Lingual Mode: DE/FR/IT/EN terminology precision (IN PROGRESS)

### MCP Servers (Custom implementations)
- entscheidsuche: Swiss court decision search
- legal-citations: Citation extraction and verification
- bge-search: Federal Supreme Court search
- cantonal-courts: Canton-specific court search
- commercial-registry: Swiss commercial registry
- land-registry: Land registry integration
- legal-news: Legal news aggregation

## Technology Stack

### Python Backend
- Python 3.11+
- Pytest for testing
- Black for code formatting (line-length: 100)
- Ruff for linting
- Mypy for type checking (strict mode)
- Pre-commit hooks configured

### Node.js/TypeScript MCP Servers
- Node.js 18+
- TypeScript 5.3+
- Jest for testing
- ESLint + Prettier
- Workspace-based monorepo structure

## Project Status
- Foundation Phase: 60% Complete
- Completed: Core framework files, Legal Researcher persona, directory structure
- In Progress: Case Strategist and Legal Drafter personas, Mode files, MCP implementations
- Estimated Time to MVP: 4-6 weeks
