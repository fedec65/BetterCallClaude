# AI Coder Context - Fedlex SPARQL MCP Server

This document provides essential context for AI coding assistants working on this project.

## Quick Reference

**What is this?** An MCP server that queries Swiss federal legislation via SPARQL.

**Key files to understand:**
- `src/index.ts` - Main server, all 5 tool implementations
- `src/types/legislation.ts` - All TypeScript types
- `src/queries/*.ts` - SPARQL query builders

**Ontology:** JOLUX (not ELI) - based on FRBR model

## Critical Knowledge

### 1. Data Model (JOLUX)

```
jolux:Act = Legal work (statute)
    ↓
jolux:classifiedByTaxonomyEntry → skos:Concept
    ├── skos:notation = SR number (e.g., "220")
    └── skos:prefLabel = Title with @de/@fr/@it tags

jolux:LegalResourceSubdivision = Article/section
    ↓
jolux:legalResourceSubdivisionIsPartOf → parent Act
```

### 2. SR Numbers

These are the Swiss classification system:
- `101` = Federal Constitution (BV)
- `210` = Civil Code (ZGB)
- `220` = Code of Obligations (OR)
- `311.0` = Criminal Code (StGB)
- `272` = Civil Procedure (ZPO)

### 3. Multi-lingual

Swiss law exists in DE, FR, IT. Titles use RDF language tags:
```sparql
?taxonomy skos:prefLabel ?title .
FILTER(LANG(?title) = "de")  # German
```

## Common Tasks

### Adding a New Query Builder

1. Add function in appropriate `src/queries/*.ts`
2. Export from `src/queries/index.ts`
3. Add tests in `tests/queries.test.ts`
4. Use `escapeForSPARQL()` for all user input

### Adding a New Tool

1. Define input/output types in `src/types/legislation.ts`
2. Add tool schema in `src/index.ts` (tools array)
3. Add handler in switch statement
4. Implement handler function

### Modifying SPARQL Queries

Key predicates:
```
jolux:Act                              # Main statute type
jolux:classifiedByTaxonomyEntry        # Link to taxonomy
jolux:hasPart                          # Contains articles
jolux:legalResourceSubdivisionIsPartOf # Article → parent
jolux:isRealizedBy                     # Work → Expression
jolux:isEmbodiedBy                     # Expression → Manifestation
jolux:legalResourceImpactHasLegalResource  # Amendment relationships
jolux:legalResourceLegalResourceCites  # Citation relationship
```

## Code Patterns

### Query Builder Pattern

```typescript
export function buildSomeQuery(
  param: string,
  language?: Language,
  limit: number = 50
): string {
  const langFilter = language
    ? `FILTER(LANG(?title) = "${language}")`
    : '';

  return withPrefixes(`
SELECT DISTINCT ?act ?srNumber ?title
WHERE {
  ?act a jolux:Act ;
       jolux:classifiedByTaxonomyEntry ?taxonomy .

  ?taxonomy skos:notation ?srNumber ;
            skos:prefLabel ?title .

  FILTER(STR(?srNumber) = "${escapeForSPARQL(param)}")
  ${langFilter}
}
LIMIT ${limit}
  `);
}
```

### Tool Handler Pattern

```typescript
async function handleSomeTool(
  input: SomeInput
): Promise<SomeResult> {
  try {
    const query = buildSomeQuery(input.param, input.language);
    const response = await sparqlClient.query(query);

    if (!response.results?.bindings?.length) {
      return { found: false };
    }

    // Transform SPARQL bindings to typed output
    return {
      found: true,
      data: transformBindings(response.results.bindings),
    };
  } catch (error) {
    return {
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

## Testing

```bash
npm test                    # Run all 76 tests
npm test -- queries.test.ts # Query builder tests only
```

Test patterns:
- Query builders: Verify SPARQL contains expected clauses
- Security: Verify escaping of special characters
- Tool handlers: Mock SPARQL responses

## Gotchas

1. **Always use `escapeForSPARQL()`** for user input to prevent injection
2. **SR numbers are strings**, not numbers (e.g., "311.0" not 311)
3. **Titles come from taxonomy** via `skos:prefLabel`, not from Act directly
4. **Articles use inverse relationship**: article → parent (not parent → article in all cases)
5. **Language filter** uses `LANG(?var)` not `LANGMATCHES`

## Recent Changes

| Date | Change |
|------|--------|
| Latest | CI fix: removed unused `_status` variable in search.ts |
| Previous | JOLUX migration: rewrote all queries from ELI to JOLUX ontology |
| Previous | Added 76 comprehensive tests |

## Debugging

### Test SPARQL Locally

```bash
curl -X POST https://fedlex.data.admin.ch/sparqlendpoint \
  -H "Content-Type: application/sparql-query" \
  -H "Accept: application/sparql-results+json" \
  -d 'PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?act ?title WHERE {
  ?act a jolux:Act ;
       jolux:classifiedByTaxonomyEntry/skos:prefLabel ?title .
} LIMIT 5'
```

### Check Build

```bash
npm run build && npm run lint && npm run typecheck
```

## File Quick Reference

| File | Purpose |
|------|---------|
| `src/index.ts` | MCP server, tool definitions, handlers |
| `src/sparql-client.ts` | HTTP client with retry logic |
| `src/types/legislation.ts` | All TypeScript interfaces |
| `src/queries/prefixes.ts` | SPARQL PREFIX declarations |
| `src/queries/lookup.ts` | Statute lookup queries |
| `src/queries/articles.ts` | Article retrieval queries |
| `src/queries/search.ts` | Full-text search queries |
| `src/queries/related.ts` | Relationship queries |
| `src/queries/metadata.ts` | Metadata queries |
| `tests/queries.test.ts` | Unit tests for query builders |

## Resources

- [Fedlex SPARQL Endpoint](https://fedlex.data.admin.ch/sparqlendpoint)
- [JOLUX Ontology](http://data.legilux.public.lu/resource/ontology/jolux)
- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [Swiss Classified Compilation](https://www.fedlex.admin.ch/en/cc)
