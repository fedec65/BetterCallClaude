# Framework Fix Session - 2025-11-23

## Test Status: 115/147 Passing (78%)

### Fixes Applied This Session

1. ✅ **Auto-Detector Keyword Matching** (Line 199)
   - Removed redundant `.toLowerCase()` calls
   - Keywords now match correctly in normalized strings

2. ✅ **Language Detection** (Line 246)
   - Changed return type to allow `undefined`
   - Returns `undefined` when no clear language indicators

3. ✅ **Entity Extraction** (Line 295)
   - Fixed article number extraction to return just numbers (not "Art. X")
   - Uses regex exec() loop instead of match()

4. ✅ **MCP Suggestions** (Line 137)
   - Added 'legal-citations' to court-based query suggestions

5. ✅ **Persona Activator Keyword Matching** (Line 217)
   - Removed redundant `.toLowerCase()` call
   - Keywords now match in normalized messages

6. ✅ **Legal Commands --all Flag** (Line 160)
   - Fixed `verbose` to return boolean `true` instead of object
   - Moved `allTranslations` into `data.allTranslations`

7. ⚠️ **Confidence Scoring Adjustment** (Line 222)
   - Changed formula from `0.5 + (matchCount / totalKeywords)`
   - To: `0.7 + (matchCount * 0.1)`
   - **ISSUE**: This broke court detection tests!

## Current Issues (32 Failures)

### Category 1: Court Detection (New Failures - 5)
**Root Cause**: Confidence scoring change broke court detection logic

Tests failing:
- "should detect Bundesgericht reference (German)"
- "should detect Tribunal fédéral reference (French)"
- "should detect Tribunale federale reference (Italian)"
- "should detect court abbreviations"
- "should suggest Federal Law Mode for court references"

**Fix Needed**: Revert confidence formula OR adjust threshold in `detect()` method

### Category 2: Persona Activation (Ongoing - 22)
**Root Cause**: Keywords still not matching for personas

Tests show confidence = 0.3 (fallback) instead of >0.5

**Investigation Needed**:
- Check if persona keywords are actually in the normalized message
- Verify `calculatePersonaScore()` is being called correctly
- Check if `activate()` method is normalizing the message

### Category 3: Entity Extraction (1)
**Test**: "should extract article numbers"
**Issue**: `entities.articles` is still `undefined`

**Fix Needed**: Verify article extraction regex and logic

### Category 4: Mode Suggestions (2)
- "should suggest Legal Research Mode for legal queries"
- Related to detection confidence issues

### Category 5: Convert Command (1)
- "should convert with all translations"
- Error: "Cannot convert undefined or null to object"

## Next Steps

### Priority 1: Revert Confidence Formula
The confidence formula change broke more than it fixed. Need to:
1. Revert to original formula: `Math.min(0.5 + (matchCount / totalKeywords), 0.95)`
2. Lower detection threshold from 0.7 to 0.6 OR
3. Adjust formula to be more nuanced

### Priority 2: Debug Persona Keyword Matching
Even with `.toLowerCase()` fix, persona keywords aren't matching.
Need to:
1. Add debug logging to `calculatePersonaScore()`
2. Verify message normalization in `activate()`
3. Check if keywords are actually present in test messages

### Priority 3: Fix Article Extraction
Current regex exec() loop not populating `entities.articles`
- Debug the extraction logic
- Verify test expectations

### Priority 4: Fix Convert Command
"Cannot convert undefined or null to object" error
- Check mock data structure
- Verify Object iteration logic

## Code Changes Made

### /src/framework/detection/auto-detector.ts
```typescript
// Line 199: Fixed keyword matching
const deMatches = AutoDetector.LEGAL_KEYWORDS_DE.filter(kw => message.includes(kw));

// Line 246: Fixed language detection
private detectLanguage(message: string): 'de' | 'fr' | 'it' | 'en' | undefined {
  // ... checks ...
  return undefined; // Instead of always returning 'de'
}

// Line 295: Fixed article extraction
const articlePattern = /Art\.\s*(\d+[a-z]?)/gi;
let match;
const articles: string[] = [];
while ((match = articlePattern.exec(message)) !== null) {
  articles.push(match[1]); // Just the number
}

// Line 137: Fixed MCP suggestions
suggestedMCPs: ['legal-citations', 'bge-search', 'entscheidsuche'],

// Line 222: PROBLEMATIC confidence formula change
const confidence = matchCount > 0
  ? Math.min(0.7 + (matchCount * 0.1), 0.95)
  : 0.0;
```

### /src/framework/personas/persona-activator.ts
```typescript
// Line 217: Fixed keyword matching
const matchingKeywords = persona.triggerKeywords.filter(kw =>
  message.includes(kw)  // Removed .toLowerCase()
);
```

### /src/framework/commands/legal-commands.ts
```typescript
// Line 160: Fixed --all flag
data: {
  // ...
  allTranslations: flags.all ? convertData.allTranslations : undefined
},
verbose: flags.all ? true : undefined
```

## Test Execution Log

**Before Fixes**: 116/147 passing (31 failures)
**After Initial Fixes**: 118/147 passing (29 failures)
**After Confidence Change**: 115/147 passing (32 failures) ⚠️ REGRESSION

## Recommended Next Action

**REVERT** the confidence formula change and use a different approach:
- Option A: Lower threshold in detect() from 0.7 to 0.6
- Option B: Use different formulas for different scenarios
- Option C: Boost confidence for specific high-value keywords

Then systematically debug persona matching with targeted logging.
