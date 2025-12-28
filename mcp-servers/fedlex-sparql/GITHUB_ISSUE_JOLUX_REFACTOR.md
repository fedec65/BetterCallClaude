# GitHub Issue: JOLUX Ontology Refactoring

> **Instructions**: Create this issue on GitHub at https://github.com/fedec65/BetterCallClaude/issues/new
>
> **Title**: `refactor(fedlex-sparql): Migrate queries from ELI to JOLUX ontology`
>
> **Labels**: `enhancement`, `refactor`

---

## Background

The fedlex-sparql MCP server (v2.0.1) was designed with queries for the **ELI (European Legislation Identifier) ontology**, but the actual Fedlex SPARQL endpoint uses the **JOLUX ontology** with a FRBR-like data model.

**Reference**: See `mcp-servers/fedlex-sparql/INTEGRATION_TEST_FINDINGS.md` for detailed integration test results.

### Current State
- ✅ Unit tests pass (76 tests) - they mock the SPARQL layer
- ✅ TypeScript compilation succeeds
- ❌ Real endpoint queries return empty results due to ontology mismatch

### Correct Endpoint
- **Working**: `https://fedlex.data.admin.ch/sparqlendpoint`
- **Original (limited)**: `https://ld.admin.ch/query` (LINDAS)

## Problem: Ontology Mismatch

| Query Expects | Fedlex Reality | Notes |
|---------------|----------------|-------|
| `eli:LegalResource` | `jolux:Act` | Type class |
| `eli:title` | `jolux:title` | On Expression, NO language tags |
| `eli:id_local` | `skos:notation` (via taxonomy) | SR number |
| `dcterms:title` | Not used on Acts | Use taxonomy prefLabel |

### FRBR Data Model
```
Work (Act) → Expression (language) → Manifestation (format)
              jolux:isRealizedBy      jolux:isEmbodiedBy
```

## Acceptance Criteria

- [ ] All query builders use JOLUX prefixes and predicates
- [ ] SR number lookup works via taxonomy path (`jolux:classifiedByTaxonomyEntry` → `skos:notation`)
- [ ] Title retrieval handles Expression-level titles (no language tags)
- [ ] Fallback to taxonomy `skos:prefLabel` for CC acts without Expression titles
- [ ] Integration tests pass against live Fedlex endpoint
- [ ] Unit tests updated to reflect new query patterns
- [ ] No breaking changes to external tool interfaces

## Technical Tasks

### A. Prefix Updates
- [ ] Update `src/queries/prefixes.ts` with JOLUX namespace
- [ ] Add SKOS prefix for taxonomy operations
- [ ] Replace ELI prefixes throughout query builders

### B. Query Pattern Refactoring
- [ ] Refactor `legislation-queries.ts` for `jolux:Act` lookup
- [ ] Refactor `search-queries.ts` for title search via Expression
- [ ] Implement taxonomy-based SR number lookup
- [ ] Handle FRBR model navigation (Act → Expression)

### C. Result Mapping
- [ ] Map `jolux:Act` URI to `LegislationSearchResult.uri`
- [ ] Map `jolux:title` or `skos:prefLabel` to title field
- [ ] Map `skos:notation` to `srNumber` field
- [ ] Preserve `datePublished`, `dateInForce` from Act properties

### D. Test Updates
- [ ] Update unit test mocks with JOLUX-based responses
- [ ] Create integration test script for live endpoint validation
- [ ] Document expected query patterns in tests

## Working Query Examples

### SR Number Lookup (verified working)
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

### Expression Title Lookup (verified working)
```sparql
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>

SELECT ?act ?expr ?title WHERE {
  ?act a jolux:Act .
  ?act jolux:isRealizedBy ?expr .
  ?expr jolux:title ?title .
}
# Note: No FILTER(LANG(?title)) - titles have no language tags
```

## Testing Strategy

| Environment | Approach |
|-------------|----------|
| **CI (main)** | Unit tests only - fast, reliable, mocked |
| **Integration** | Separate script/workflow against live endpoint |

Integration tests should be:
- Runnable manually or via dedicated GitHub Action
- Allowed to fail without blocking releases (network/endpoint issues)
- Documented in CONTRIBUTING.md

## Risk Assessment

- **Risk Level**: Medium
- **Mitigation**: Comprehensive test coverage before/after refactoring
- **Note**: CC (Classified Collection) acts may not have Expression titles - requires fallback to taxonomy labels

## Estimated Effort

- **Size**: Medium
- **Time**: 3-4 hours
- **Complexity**: Moderate (query logic changes + testing)

## Design Decisions

1. **No Breaking Changes**: External tool interfaces remain unchanged
2. **Minimal Scope**: Query refactor only, no new FRBR-aware tools
3. **Backward Compatible**: Same `LegislationSearchResult` schema
4. **Future Enhancement**: FRBR hierarchy exposure can be separate issue if requested

---

**Priority**: 🔴 High - Should be addressed before further v2.0.1 promotion

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
