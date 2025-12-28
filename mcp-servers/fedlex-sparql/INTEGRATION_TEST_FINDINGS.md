# Fedlex SPARQL Integration Test Findings

**Test Date**: 2025-12-28
**Version**: 2.0.1

## Summary

The fedlex-sparql MCP server was designed with queries for the **ELI (European Legislation Identifier) ontology** but the actual Fedlex SPARQL endpoint uses the **JOLUX ontology** with a FRBR-like data model.

## Correct Endpoint

- **Working endpoint**: `https://fedlex.data.admin.ch/sparqlendpoint`
- **Original (incorrect)**: `https://ld.admin.ch/query` (LINDAS - limited Fedlex data)

## Data Model Discoveries

### Ontology Used
- **Expected by queries**: ELI (`http://data.europa.eu/eli/ontology#`)
- **Actual Fedlex**: JOLUX (`http://data.legilux.public.lu/resource/ontology/jolux#`)

### Key Classes
| Class | Count | Purpose |
|-------|-------|---------|
| `jolux:Act` | 366,419 | Primary legislation entity |
| `jolux:Expression` | 991,814 | Language-specific version |
| `jolux:Manifestation` | (via isEmbodiedBy) | Physical format (PDF, XML, etc.) |

### FRBR Model
```
Work (Act) → Expression (language) → Manifestation (format)
              jolux:isRealizedBy      jolux:isEmbodiedBy
```

### Important Predicates
| Query Expected | Fedlex Actual | Notes |
|----------------|---------------|-------|
| `eli:LegalResource` | `jolux:Act` | Type class |
| `eli:title` | `jolux:title` | On Expression, NO language tags |
| `eli:id_local` | `skos:notation` (via taxonomy) | SR number |
| `dcterms:title` | Not used on Acts | Use taxonomy prefLabel |

### SR Number Access
SR numbers are NOT directly on Acts. Access pattern:
```sparql
?act jolux:classifiedByTaxonomyEntry ?tax .
?tax skos:notation ?srNumber .
?tax skos:prefLabel ?title .  # German title here
```

### Title Access Patterns
1. **Taxonomy labels** (recommended for SR lookup):
   - `skos:prefLabel` on `legal-taxonomy` concepts
   - Has language tags (de, fr, it, en)
   
2. **Expression titles** (for OC/FGA acts):
   - `jolux:title` on Expression entities
   - **NO language tags** (791,784 titles)
   - CC (Classified Collection) acts don't have these

### Working Query Examples

**Find ZGB (SR 210):**
```sparql
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?act ?sr ?title WHERE {
  ?act a jolux:Act .
  ?act jolux:classifiedByTaxonomyEntry ?tax .
  ?tax skos:notation ?sr .
  ?tax skos:prefLabel ?title .
  FILTER(STR(?sr) = "210")
  FILTER(LANG(?title) = "de")
}
```

**Get Expression title (OC acts):**
```sparql
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>

SELECT ?act ?expr ?title WHERE {
  ?act a jolux:Act .
  ?act jolux:isRealizedBy ?expr .
  ?expr jolux:title ?title .
}
# Note: No FILTER(LANG(?title)) - titles have no language tags
```

## Required Changes

### 1. Endpoint Configuration
Update `src/sparql-client.ts`:
```typescript
export const DEFAULT_CONFIG: SparqlConfig = {
  endpoint: 'https://fedlex.data.admin.ch/sparqlendpoint',  // Changed
  // ...
};
```

### 2. Query Builders
All query builders in `src/queries/*.ts` need refactoring:
- Replace ELI prefixes with JOLUX
- Use taxonomy for SR number lookup
- Remove language filters from `jolux:title`
- Add taxonomy label queries for titles

### 3. Type Adjustments
The TypeScript types in `src/types/legislation.ts` remain valid - they model the business domain, not the RDF ontology.

## Test Results

| Test | Status | Notes |
|------|--------|-------|
| Endpoint connectivity | ✅ PASS | HTTP 200 |
| SR 210 (ZGB) lookup | ✅ PASS | Found via taxonomy |
| SR 220 (OR) lookup | ✅ PASS | Found via taxonomy |
| Expression titles | ⚠️ PARTIAL | Works for OC/FGA, not CC |
| ELI-based queries | ❌ FAIL | Wrong ontology |

## Conclusion

The fedlex-sparql MCP server **queries need significant refactoring** to use the JOLUX ontology instead of ELI. The core functionality (endpoint communication, result parsing) works correctly. Unit tests pass because they mock the SPARQL layer.

**Follow-up**: See `GITHUB_ISSUE_JOLUX_REFACTOR.md` for the detailed issue to be created on GitHub.
