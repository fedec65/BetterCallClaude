# BetterCallClaude Framework - Patterns & Best Practices

## Detection Architecture Patterns

### Hierarchical Priority Detection
**Pattern**: Check specific indicators before generic patterns to prevent false positives

**Implementation**:
```typescript
// Priority Order (specific → general):
1. Explicit citations (BGE/ATF/DTF with volume/chamber/page)
2. Court references (Bundesgericht, Tribunal fédéral)
3. Statute references (Art. X OR/ZGB/StGB with codes)
4. Legal keywords (generic terms like "validate", "format")
```

**Why This Matters**: Generic keywords often appear in messages with specific legal indicators. Checking keywords first creates false positives where "Find Bundesgericht decisions" becomes type='legal_query' instead of type='case_law'.

**Anti-Pattern**:
```typescript
// DON'T DO THIS:
if (hasLegalKeywords) return { type: 'legal_query' };
if (hasCourts) return { type: 'case_law' };
// Keywords checked first → false positive for court queries
```

**Correct Pattern**:
```typescript
// DO THIS:
if (hasCitations) return { type: 'citation' };
if (hasCourts) return { type: 'case_law' };
if (hasStatutes) return { type: 'statute_reference' };
if (hasLegalKeywords) return { type: 'legal_query' };
// Specific indicators checked first → accurate classification
```

### Universal Entity Extraction
**Pattern**: Extract entities from all message types, including non-matching messages

**Why**: Messages may contain partial legal references that don't match full detection patterns but still have valuable entities.

**Example**:
```typescript
// Message: "Art. 97 and Art. 184 apply"
// Has article numbers but no statute code (OR/ZGB)
// type='none' but entities=['97', '184'] is valuable

// Implementation:
const entities = this.extractEntities(message);
const hasEntities = entities.courts?.length || 
                    entities.statutes?.length || 
                    entities.articles?.length;

return {
  type: 'none',
  confidence: 0.0,
  entities: hasEntities ? entities : undefined
};
```

### Confidence Threshold Dynamics
**Pattern**: Threshold must accommodate worst-case (single match) scenarios

**Formula Understanding**:
```typescript
confidence = Math.min(0.5 + (matchCount / totalKeywords), 0.95)

// With 19 keywords:
1 match: 0.5 + (1/19) = 0.553
2 matches: 0.5 + (2/19) = 0.605

// Adding 4 keywords → 23 total:
1 match: 0.5 + (1/23) = 0.543 ⚠️ LOWER!
2 matches: 0.5 + (2/23) = 0.587
```

**Threshold Calibration Rule**:
```typescript
// Calculate minimum possible confidence (single match):
minConfidence = 0.5 + (1 / keywordCount)

// Set detection threshold slightly below this:
threshold = minConfidence - 0.05

// For 23 keywords:
// minConfidence = 0.543
// threshold = 0.5 (safe for single matches)
```

**Key Insight**: Adding keywords to improve coverage paradoxically lowers per-match confidence. Always recalibrate thresholds when modifying keyword lists.

## Persona Activation Patterns

### Two-Tier Scoring System
**Pattern**: Domain-specific keywords receive explicit priority over generic heuristics

**Problem**: Simple keyword counting treats "analyze" and "bge" equally, but "bge" is a much stronger indicator of Legal Researcher persona.

**Solution**:
```typescript
// Tier 1: Domain-specific citation bonus (highest priority)
const citationKeywords = ['bge', 'atf', 'dtf', 'bundesgericht', 
                          'tribunal fédéral', 'tribunale federale'];
const citationBonus = hasCitationKeyword ? 0.15 : 0.0;

// Tier 2: Keyword length bonus (secondary priority)
// Only applies if no citation bonus to prevent interference
const lengthBonus = !hasCitationKeyword ?
  Math.min((avgKeywordLength - 5) * 0.015, 0.08) : 0.0;

return baseStrength + citationBonus + lengthBonus;
```

**Results**:
```
"Analyze BGE 147 IV 73":
- Legal Researcher: 0.65 + 0.15 (citation) = 0.80 ✅
- Case Strategist: 0.65 + 0.0 = 0.65

"Prepare litigation documents":
- Case Strategist: 0.65 + 0.045 (length: "litigation" 10 chars) = 0.695 ✅
- Legal Drafter: 0.65 + 0.045 (length: "document" 8 chars) = 0.695
```

**Key Principle**: Domain knowledge should be explicitly encoded, not emergent from generic heuristics.

### Keyword Selection Strategy
**Pattern**: Use domain-specific keywords first, generic action words second

**Legal Researcher Keywords** (domain-specific first):
```typescript
[
  // Domain-specific (highest priority):
  'bge', 'atf', 'dtf',
  'bundesgericht', 'tribunal fédéral', 'tribunale federale',
  'precedent', 'case law',
  
  // Generic action words (lower priority):
  'research', 'find', 'search', 'locate', 'discover'
]
```

**Why**: Domain keywords are strong indicators, action words provide breadth but less specificity.

## Testing Patterns

### Test-Implementation Alignment
**Pattern**: Test expectations should match actual implementation behavior, not ideal behavior

**Anti-Pattern**:
```typescript
// Test: "should convert with all translations"
// Context: flags: { lang: 'fr' }  // ❌ No 'all' flag
// Expectation: allTranslations present  // ❌ Wrong!
```

**Correct Pattern**:
```typescript
// Test: "should convert with all translations"
// Context: flags: { lang: 'fr' }
// Expectation: allTranslations undefined  // ✅ Matches code

// Separate test: "should show all translations with --all flag"
// Context: flags: { lang: 'fr', all: true }
// Expectation: allTranslations present  // ✅ Tests flag behavior
```

**Principle**: Separate concerns with distinct tests for base behavior vs optional flag behavior.

### Regression Prevention Strategy
**Pattern**: Run full test suite after each fix to catch unintended side effects

**Example from this session**:
1. Fixed keyword threshold (6 tests pass)
2. ⚠️ Caused regression in persona tests (different tests fail)
3. Run full suite → caught regression immediately
4. Fixed persona scoring → verify full suite again

**Best Practice**: Never commit after fixing one test class. Always verify entire test suite.

### Threshold Testing
**Pattern**: Test worst-case scenarios, not ideal cases

**Anti-Pattern**:
```typescript
// Testing with 2 keyword matches (ideal case)
expect(confidence).toBeGreaterThan(0.7);  // Passes
```

**Correct Pattern**:
```typescript
// Testing with 1 keyword match (worst case)
expect(confidence).toBeGreaterThan(0.5);  // Realistic threshold
```

**Principle**: Production will see all cases, including worst-case. Tests should reflect this.

## Swiss Legal Domain Patterns

### Citation Recognition Priority
**Pattern**: Citation-specific keywords indicate research intent more strongly than action verbs

**Citation Keywords** (highest priority):
- Court abbreviations: BGE, ATF, DTF
- Court names: Bundesgericht, Tribunal fédéral, Tribunale federale

**Why**: "Analyze BGE 147 IV 73" is clearly a legal research query, not a general strategic analysis, because it contains a specific Swiss federal court citation.

### Multi-Lingual Keyword Mapping
**Pattern**: Map equivalent keywords across DE/FR/IT languages

**German Keywords**:
```typescript
['validate', 'validieren', 'überprüfen', 'urteil', 'entscheid', 'gesetz']
```

**French Keywords**:
```typescript
['valider', 'vérifier', 'arrêt', 'décision', 'loi']
```

**Italian Keywords**:
```typescript
['validare', 'verificare', 'sentenza', 'decisione', 'legge']
```

**Confidence Calculation**: Use language with most matches, not aggregate across languages.

### Language Detection Patterns
**Pattern**: Language-specific formatting indicators trump generic detection

**German Indicators**:
- `Abs.` (Absatz = paragraph)
- `lit.` (litera = letter)
- `Ziff.` (Ziffer = number)
- `BGE` (Bundesgerichtsentscheid)

**French Indicators**:
- ` al. ` (alinéa = paragraph, requires spaces!)
- ` let. ` (lettre = letter, requires spaces!)
- ` ch. ` (chiffre = number, requires spaces!)
- `ATF` (Arrêt du Tribunal Fédéral)

**Italian Indicators**:
- `cpv.` (capoverso = paragraph)
- `lett.` (lettera = letter)
- ` n. ` (numero = number, requires spaces!)
- `DTF` (Decisione del Tribunale Federale)

**Key Insight**: Space sensitivity matters! French/Italian use ` al. ` not `al.` to avoid false matches.

## Code Quality Patterns

### Normalized String Matching
**Pattern**: Normalize once at entry point, use consistently throughout

```typescript
// ✅ DO THIS:
detect(message: string): DetectionResult {
  const normalizedMessage = message.toLowerCase();
  
  // All subsequent checks use normalized string
  const hasCourts = this.containsCourts(normalizedMessage);
  const hasKeywords = this.containsLegalKeywords(normalizedMessage);
}

private containsCourts(message: string): boolean {
  // message is already normalized, don't normalize again
  return SWISS_COURTS.some(court => 
    message.includes(court.toLowerCase())
  );
}
```

**Anti-Pattern**:
```typescript
// ❌ DON'T DO THIS:
private containsCourts(message: string): boolean {
  // Normalizing inside every method is inefficient
  return SWISS_COURTS.some(court => 
    message.toLowerCase().includes(court.toLowerCase())
  );
}
```

### Confidence Scoring Transparency
**Pattern**: Document confidence calculation logic in comments

```typescript
// Calculate base score: 1 match = 0.6, 2 matches = 0.75, 3+ matches = 0.85+
const baseStrength = Math.min(0.5 + (matchingKeywords.length * 0.15), 0.95);

// Bonus for domain-specific legal citation keywords (BGE, ATF, DTF)
// These should be strongly favored as they indicate specific legal research needs
const citationBonus = hasCitationKeyword ? 0.15 : 0.0;
```

**Why**: Future maintainers need to understand scoring rationale to avoid breaking carefully calibrated thresholds.

## Performance Patterns

### Early Exit Optimization
**Pattern**: Check highest-confidence patterns first, exit on match

```typescript
// ✅ Optimal order (most confident first):
if (citations.length > 0) {
  return { type: 'citation', confidence: 0.95, ... };
}

if (hasCourts) {
  return { type: 'case_law', confidence: 0.75, ... };
}

// Only check keywords if nothing more specific matched
if (hasLegalKeywords.confidence > 0.5) {
  return { type: 'legal_query', confidence: hasLegalKeywords.confidence, ... };
}
```

**Benefit**: Most messages match specific patterns, avoiding unnecessary keyword list iteration.

### Regex Compilation
**Pattern**: Compile regex patterns as static readonly class properties

```typescript
// ✅ DO THIS (compile once):
private static readonly BGE_PATTERN = /BGE\s+\d{1,3}\s+[IVX]+\s+\d+/gi;

// ❌ DON'T DO THIS (recompile every call):
private extractBGE(text: string): string[] {
  const pattern = /BGE\s+\d{1,3}\s+[IVX]+\s+\d+/gi;
  return text.match(pattern) || [];
}
```

**Impact**: Regex compilation is expensive. Static patterns are compiled once per class load.

## Summary of Key Patterns

1. **Hierarchical Priority**: Specific → General detection order prevents false positives
2. **Universal Extraction**: Extract entities from all message types for comprehensive coverage
3. **Dynamic Thresholds**: Calibrate thresholds to worst-case formula scenarios
4. **Domain Priority**: Explicit domain knowledge beats generic heuristics
5. **Test-Code Alignment**: Tests verify actual behavior, not aspirational behavior
6. **Normalized Matching**: Normalize once, use consistently
7. **Early Exit**: Check high-confidence patterns first
8. **Static Compilation**: Compile regex patterns once as class properties

These patterns emerged from achieving 100% test coverage and represent battle-tested approaches for detection, classification, and scoring systems.
