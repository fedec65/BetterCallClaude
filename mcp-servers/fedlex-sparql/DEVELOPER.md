# Fedlex SPARQL MCP Server - Developer Documentation

## Overview

This MCP (Model Context Protocol) server provides AI assistants with direct access to Swiss Federal Legislation through the LINDAS SPARQL endpoint. It enables natural language queries about Swiss law, returning structured data about statutes, articles, and legal relationships.

**Version**: 2.0.1
**Endpoint**: https://fedlex.data.admin.ch/sparqlendpoint
**Data Model**: JOLUX Ontology (FRBR-based)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Server (index.ts)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │lookup_statute│ │ get_article │ │ search_legislation     ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
│  ┌─────────────┐ ┌─────────────────────────────────────────┐│
│  │find_related │ │ get_metadata                            ││
│  └─────────────┘ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SPARQL Client                             │
│  - 60s timeout, 3 retries                                   │
│  - Automatic error handling                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              LINDAS SPARQL Endpoint (Fedlex)                 │
│  https://fedlex.data.admin.ch/sparqlendpoint                │
└─────────────────────────────────────────────────────────────┘
```

## JOLUX Data Model

The server uses the JOLUX ontology, which is based on FRBR (Functional Requirements for Bibliographic Records):

### Core Concepts

```
jolux:Act (Work Level)
    │
    ├── jolux:classifiedByTaxonomyEntry → skos:Concept
    │   ├── skos:notation → SR Number (e.g., "220")
    │   └── skos:prefLabel → Title (with language tags: @de, @fr, @it)
    │
    ├── jolux:isRealizedBy → jolux:Expression (Language Version)
    │   └── jolux:isEmbodiedBy → jolux:Manifestation (PDF, HTML, etc.)
    │
    ├── jolux:hasPart → jolux:LegalResourceSubdivision (Articles, Sections)
    │
    └── Relationships:
        ├── jolux:legalResourceLegalResourceAmends
        ├── jolux:legalResourceLegalResourceCites
        └── jolux:legalResourceLegalResourceBasedOn
```

### SR Number System

Swiss legislation is classified by SR (Systematische Rechtssammlung) numbers:

| Prefix | Domain |
|--------|--------|
| 1 | Constitutional Law (Staat - Volk - Behörden) |
| 2 | Private Law (Privatrecht - Zivilrechtspflege) |
| 3 | Criminal Law (Strafrecht - Strafrechtspflege) |
| 4 | Education (Schule - Wissenschaft - Kultur) |
| 5 | National Defense (Landesverteidigung) |
| 6 | Finance (Finanzen) |
| 7 | Public Works (Öffentliche Werke - Energie - Verkehr) |
| 8 | Health & Labor (Gesundheit - Arbeit - Soziale Sicherheit) |
| 9 | Economy (Wirtschaft - Technische Zusammenarbeit) |

### Common Statutes

```typescript
const COMMON_SR_NUMBERS = {
  'BV': '101',      // Federal Constitution
  'ZGB': '210',     // Civil Code
  'OR': '220',      // Code of Obligations
  'StGB': '311.0',  // Criminal Code
  'ZPO': '272',     // Civil Procedure Code
  'StPO': '312.0',  // Criminal Procedure Code
  'SchKG': '281.1', // Debt Collection Act
  'IPRG': '291',    // Private International Law Act
};
```

## MCP Tools

### 1. `lookup_statute`

Retrieves a legal act by SR number with full details.

**Input:**
```typescript
{
  srNumber: string;      // SR number (e.g., "220" for OR)
  language?: Language;   // "de" | "fr" | "it" | "en"
  includeArticles?: boolean;  // Include table of contents
}
```

**Output:**
```typescript
{
  found: boolean;
  act?: LegalAct;
  articles?: Article[];
  error?: string;
}
```

### 2. `get_article`

Retrieves a specific article from a statute.

**Input:**
```typescript
{
  srNumber: string;      // Parent statute SR number
  articleNumber: string; // Article number (e.g., "1", "97")
  paragraph?: number;    // Optional specific paragraph
  language?: Language;
}
```

**Output:**
```typescript
{
  found: boolean;
  article?: Article;
  error?: string;
}
```

### 3. `search_legislation`

Full-text search across Swiss legislation.

**Input:**
```typescript
{
  query: string;           // Search text
  language?: Language;
  srNumberPrefix?: string; // Filter by domain (e.g., "2" for private law)
  actType?: string[];      // Filter by document type
  limit?: number;          // Default: 50
  offset?: number;         // For pagination
}
```

**Output:**
```typescript
{
  results: LegalAct[];
  totalCount: number;
  hasMore: boolean;
}
```

### 4. `find_related`

Finds related legislation through legal relationships.

**Input:**
```typescript
{
  srNumber: string;
  relationType?: RelationType;  // "amends" | "cites" | "based_on" | etc.
  language?: Language;
  limit?: number;
}
```

**Output:**
```typescript
{
  relatedActs: RelatedAct[];
  relationshipSummary: Record<string, number>;
}
```

### 5. `get_metadata`

Retrieves comprehensive metadata for a legal act.

**Input:**
```typescript
{
  srNumber: string;
  language?: Language;
  includeHistory?: boolean;
  includeFormats?: boolean;
}
```

**Output:**
```typescript
{
  metadata: LegalActMetadata;
  availableLanguages: LanguageInfo[];
  legalStatus: LegalStatus;
  versionHistory?: VersionInfo[];
  availableFormats?: FormatInfo[];
}
```

## Project Structure

```
fedlex-sparql/
├── src/
│   ├── index.ts              # MCP server entry point, tool handlers
│   ├── sparql-client.ts      # SPARQL HTTP client with retry logic
│   ├── types/
│   │   └── legislation.ts    # TypeScript type definitions
│   └── queries/
│       ├── index.ts          # Barrel exports
│       ├── prefixes.ts       # SPARQL prefixes (jolux:, skos:, etc.)
│       ├── lookup.ts         # Statute lookup queries
│       ├── articles.ts       # Article retrieval queries
│       ├── search.ts         # Full-text search queries
│       ├── related.ts        # Relationship queries
│       └── metadata.ts       # Metadata queries
├── tests/
│   ├── queries.test.ts       # Query builder unit tests
│   └── integration.test.ts   # Live API integration tests
├── dist/                     # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
cd mcp-servers/fedlex-sparql
npm install
npm run build
```

### Testing

```bash
# Run all tests (76 tests)
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- queries.test.ts
```

### Build

```bash
npm run build    # Compile TypeScript
npm run lint     # Run ESLint
npm run typecheck # Type checking only
```

## SPARQL Query Patterns

### Basic Statute Lookup

```sparql
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?act ?srNumber ?title ?abbreviation
WHERE {
  ?act a jolux:Act ;
       jolux:classifiedByTaxonomyEntry ?taxonomy .

  ?taxonomy skos:notation ?srNumber ;
            skos:prefLabel ?title .

  FILTER(STR(?srNumber) = "220")
  FILTER(LANG(?title) = "de")

  OPTIONAL { ?act jolux:titleShort ?abbreviation }
}
```

### Key SPARQL Prefixes

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX fedlex: <https://fedlex.data.admin.ch/vocabulary/>
```

## Security

- All user inputs are escaped using `escapeForSPARQL()` to prevent injection
- Tests verify injection attempts are properly escaped
- No authentication required (public endpoint)

## Error Handling

The server implements:
- Automatic retry (3 attempts) for transient failures
- Timeout handling (60 seconds)
- Graceful degradation for missing data
- Structured error responses

## Current State

- **Version**: 2.0.1
- **Tests**: 76 passing
- **Migration**: JOLUX ontology migration complete
- **CI**: GitHub Actions passing
- **Last Update**: CI lint fix (unused variable removal)

## Contributing

1. Run tests before submitting: `npm test`
2. Ensure lint passes: `npm run lint`
3. Follow existing code patterns
4. Add tests for new query builders
