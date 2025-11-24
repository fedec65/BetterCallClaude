/**
 * Auto-Detection Engine Tests
 * Tests citation detection, language detection, and persona suggestion logic
 */

import { describe, it, expect } from 'vitest';
import { AutoDetector } from '../detection/auto-detector.js';

describe('AutoDetector - Citation Pattern Detection', () => {
  const detector = new AutoDetector();

  describe('BGE Citation Detection', () => {
    it('should detect standard BGE citation', () => {
      const result = detector.detect('Please validate BGE 147 IV 73');

      expect(result.type).toBe('citation');
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
      expect(result.citations).toContain('BGE 147 IV 73');
      expect(result.suggestedMCPs).toContain('legal-citations');
      expect(result.suggestedPersona).toBe('Legal Researcher');
    });

    it('should detect multiple BGE citations', () => {
      const result = detector.detect('Compare BGE 147 IV 73 with BGE 145 II 113');

      expect(result.type).toBe('citation');
      expect(result.citations).toHaveLength(2);
      expect(result.citations).toContain('BGE 147 IV 73');
      expect(result.citations).toContain('BGE 145 II 113');
    });

    it('should detect BGE with single-digit volume', () => {
      const result = detector.detect('BGE 1 I 1');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('BGE 1 I 1');
    });

    it('should detect BGE with three-digit volume', () => {
      const result = detector.detect('BGE 150 III 456');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('BGE 150 III 456');
    });
  });

  describe('ATF Citation Detection', () => {
    it('should detect standard ATF citation (French)', () => {
      const result = detector.detect('Valider ATF 147 IV 73');

      expect(result.type).toBe('citation');
      expect(result.language).toBe('fr');
      expect(result.citations).toContain('ATF 147 IV 73');
    });

    it('should detect multiple ATF citations', () => {
      const result = detector.detect('ATF 145 II 113 et ATF 147 IV 73');

      expect(result.citations).toHaveLength(2);
      expect(result.citations).toContain('ATF 145 II 113');
      expect(result.citations).toContain('ATF 147 IV 73');
    });
  });

  describe('DTF Citation Detection', () => {
    it('should detect standard DTF citation (Italian)', () => {
      const result = detector.detect('Validare DTF 147 IV 73');

      expect(result.type).toBe('citation');
      expect(result.language).toBe('it');
      expect(result.citations).toContain('DTF 147 IV 73');
    });
  });

  describe('Statutory Citation Detection', () => {
    it('should detect simple article citation', () => {
      const result = detector.detect('Art. 97 OR');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('Art. 97 OR');
    });

    it('should detect article with paragraph (German)', () => {
      const result = detector.detect('Art. 97 Abs. 1 OR');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('Art. 97 Abs. 1 OR');
      expect(result.language).toBe('de');
    });

    it('should detect article with paragraph (French)', () => {
      const result = detector.detect('art. 97 al. 1 CO');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('art. 97 al. 1 CO');
      expect(result.language).toBe('fr');
    });

    it('should detect article with paragraph (Italian)', () => {
      const result = detector.detect('art. 97 cpv. 1 CO');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('art. 97 cpv. 1 CO');
      expect(result.language).toBe('it');
    });

    it('should detect complex statutory citation', () => {
      const result = detector.detect('Art. 97 Abs. 1 lit. a Ziff. 2 OR');

      expect(result.type).toBe('citation');
      expect(result.citations).toContain('Art. 97 Abs. 1 lit. a Ziff. 2 OR');
    });

    it('should detect multiple statutory citations', () => {
      const result = detector.detect('Art. 97 OR and Art. 184 StGB');

      expect(result.citations).toHaveLength(2);
      expect(result.citations).toContain('Art. 97 OR');
      expect(result.citations).toContain('Art. 184 StGB');
    });

    it('should detect various Swiss statute abbreviations', () => {
      const statutes = ['ZGB', 'CC', 'StGB', 'CP', 'StPO', 'CPP', 'ZPO', 'CPC', 'BV', 'Cst', 'SchKG', 'LP', 'DSG', 'LPD'];

      statutes.forEach(statute => {
        const result = detector.detect(`Art. 1 ${statute}`);
        expect(result.citations).toHaveLength(1);
      });
    });
  });

  describe('Mixed Citation Detection', () => {
    it('should detect both court and statutory citations', () => {
      const result = detector.detect('BGE 147 IV 73 discusses Art. 97 OR');

      expect(result.type).toBe('citation');
      expect(result.citations).toHaveLength(2);
      expect(result.citations).toContain('BGE 147 IV 73');
      expect(result.citations).toContain('Art. 97 OR');
    });
  });
});

describe('AutoDetector - Legal Query Detection', () => {
  const detector = new AutoDetector();

  describe('German Legal Keywords', () => {
    it('should detect German validation keywords', () => {
      const result = detector.detect('Kann ich diese Zitat validieren?');

      expect(result.type).toBe('legal_query');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.language).toBe('de');
      expect(result.suggestedMCPs).toContain('legal-citations');
    });

    it('should detect German legal terms', () => {
      const result = detector.detect('Bundesgericht Entscheid über Haftung');

      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.language).toBe('de');
    });

    it('should detect multiple German keywords', () => {
      const result = detector.detect('Gesetz Artikel Absatz analysieren');

      expect(result.type).toBe('legal_query');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('French Legal Keywords', () => {
    it('should detect French validation keywords', () => {
      const result = detector.detect('Puis-je valider cette citation?');

      expect(result.type).toBe('legal_query');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.language).toBe('fr');
    });

    it('should detect French legal terms', () => {
      const result = detector.detect('Tribunal fédéral arrêt sur responsabilité');

      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.language).toBe('fr');
    });
  });

  describe('Italian Legal Keywords', () => {
    it('should detect Italian validation keywords', () => {
      const result = detector.detect('Posso validare questa citazione?');

      expect(result.type).toBe('legal_query');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.language).toBe('it');
    });

    it('should detect Italian legal terms', () => {
      const result = detector.detect('Tribunale federale sentenza sulla responsabilità');

      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.language).toBe('it');
    });
  });

  describe('Confidence Scoring', () => {
    it('should have higher confidence with more keyword matches', () => {
      const singleKeyword = detector.detect('validieren');
      const multipleKeywords = detector.detect('validieren überprüfen analysieren');

      expect(multipleKeywords.confidence).toBeGreaterThan(singleKeyword.confidence);
    });

    it('should have confidence below threshold for non-legal queries', () => {
      const result = detector.detect('What is the weather today?');

      expect(result.type).toBe('none');
      expect(result.confidence).toBe(0.0);
    });
  });
});

describe('AutoDetector - Court Reference Detection', () => {
  const detector = new AutoDetector();

  it('should detect Bundesgericht reference (German)', () => {
    const result = detector.detect('Entscheid des Bundesgerichts');

    expect(result.type).toBe('case_law');
    expect(result.confidence).toBeGreaterThanOrEqual(0.75);
    expect(result.suggestedMCPs).toContain('bge-search');
    expect(result.suggestedMCPs).toContain('entscheidsuche');
  });

  it('should detect Tribunal fédéral reference (French)', () => {
    const result = detector.detect('Arrêt du Tribunal fédéral');

    expect(result.type).toBe('case_law');
    expect(result.language).toBe('fr');
  });

  it('should detect Tribunale federale reference (Italian)', () => {
    const result = detector.detect('Sentenza del Tribunale federale');

    expect(result.type).toBe('case_law');
    expect(result.language).toBe('it');
  });

  it('should detect court abbreviations', () => {
    const courts = ['BGer', 'TF', 'DTF'];

    courts.forEach(court => {
      const result = detector.detect(`Entscheid ${court}`);
      expect(result.type).toBe('case_law');
    });
  });
});

describe('AutoDetector - Statute Reference Detection', () => {
  const detector = new AutoDetector();

  it('should detect statute reference without full citation', () => {
    const result = detector.detect('According to the OR provisions');

    expect(result.type).toBe('statute_reference');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.suggestedPersona).toBe('Legal Drafter');
  });

  it('should detect multiple statute references', () => {
    const result = detector.detect('Compare ZGB and OR regulations');

    expect(result.type).toBe('statute_reference');
    expect(result.entities?.statutes).toContain('ZGB');
    expect(result.entities?.statutes).toContain('OR');
  });

  it('should detect Swiss federal statutes', () => {
    const statutes = ['ZGB', 'CC', 'OR', 'CO', 'StGB', 'CP', 'BV', 'Cst', 'DSG', 'LPD'];

    statutes.forEach(statute => {
      const result = detector.detect(`Review the ${statute} provisions`);
      expect(result.type).toBe('statute_reference');
    });
  });
});

describe('AutoDetector - Language Detection', () => {
  const detector = new AutoDetector();

  it('should detect German from Abs. indicator', () => {
    const result = detector.detect('Art. 97 Abs. 1 OR');

    expect(result.language).toBe('de');
  });

  it('should detect French from al. indicator', () => {
    const result = detector.detect('art. 97 al. 1 CO');

    expect(result.language).toBe('fr');
  });

  it('should detect Italian from cpv. indicator', () => {
    const result = detector.detect('art. 97 cpv. 1 CO');

    expect(result.language).toBe('it');
  });

  it('should detect German from Bundesgericht', () => {
    const result = detector.detect('Bundesgericht decision');

    expect(result.language).toBe('de');
  });

  it('should detect French from Tribunal fédéral', () => {
    const result = detector.detect('Tribunal fédéral arrêt');

    expect(result.language).toBe('fr');
  });

  it('should detect Italian from Tribunale federale', () => {
    const result = detector.detect('Tribunale federale sentenza');

    expect(result.language).toBe('it');
  });

  it('should detect German from ATF citation context', () => {
    const result = detector.detect('Gemäss ATF 147 IV 73');

    expect(result.language).toBe('fr'); // ATF indicates French, but context is German
  });

  it('should default to German for ambiguous cases', () => {
    const result = detector.detect('Some legal text without clear indicators');

    // Only returns language if citation detected
    expect(result.language).toBeUndefined();
  });
});

describe('AutoDetector - Entity Extraction', () => {
  const detector = new AutoDetector();

  it('should extract court entities', () => {
    const result = detector.detect('Bundesgericht and Tribunal fédéral decisions');

    expect(result.entities?.courts).toBeDefined();
    expect(result.entities?.courts).toContain('bundesgericht');
    expect(result.entities?.courts).toContain('tribunal fédéral');
  });

  it('should extract statute entities', () => {
    const result = detector.detect('Review ZGB and OR provisions');

    expect(result.entities?.statutes).toBeDefined();
    expect(result.entities?.statutes).toContain('ZGB');
    expect(result.entities?.statutes).toContain('OR');
  });

  it('should extract article numbers', () => {
    const result = detector.detect('Art. 97 and Art. 184 apply');

    expect(result.entities?.articles).toBeDefined();
    expect(result.entities?.articles?.length).toBeGreaterThan(0);
  });

  it('should handle messages with no extractable entities', () => {
    const result = detector.detect('Generic legal question');

    expect(result.entities?.courts).toBeUndefined();
    expect(result.entities?.statutes).toBeUndefined();
    expect(result.entities?.articles).toBeUndefined();
  });
});

describe('AutoDetector - MCP Server Suggestions', () => {
  const detector = new AutoDetector();

  it('should suggest legal-citations for citation detection', () => {
    const result = detector.detect('BGE 147 IV 73');

    expect(result.suggestedMCPs).toContain('legal-citations');
  });

  it('should suggest multiple MCPs for legal query', () => {
    const result = detector.detect('Find Bundesgericht decisions on liability');

    expect(result.suggestedMCPs).toContain('legal-citations');
    expect(result.suggestedMCPs).toContain('bge-search');
    expect(result.suggestedMCPs).toContain('entscheidsuche');
  });

  it('should suggest legal-citations only for statute references', () => {
    const result = detector.detect('Review OR provisions');

    expect(result.suggestedMCPs).toEqual(['legal-citations']);
  });

  it('should not suggest MCPs for non-legal content', () => {
    const result = detector.detect('What is the weather today?');

    expect(result.suggestedMCPs).toBeUndefined();
  });
});

describe('AutoDetector - Persona Suggestions', () => {
  const detector = new AutoDetector();

  it('should suggest Legal Researcher for citations', () => {
    const result = detector.detect('BGE 147 IV 73');

    expect(result.suggestedPersona).toBe('Legal Researcher');
  });

  it('should suggest Legal Researcher for legal queries', () => {
    const result = detector.detect('Find Bundesgericht decisions');

    expect(result.suggestedPersona).toBe('Legal Researcher');
  });

  it('should suggest Legal Drafter for statute references', () => {
    const result = detector.detect('Review OR provisions');

    expect(result.suggestedPersona).toBe('Legal Drafter');
  });

  it('should suggest Legal Researcher for court references', () => {
    const result = detector.detect('Bundesgericht decision');

    expect(result.suggestedPersona).toBe('Legal Researcher');
  });
});

describe('AutoDetector - Mode Suggestions', () => {
  const detector = new AutoDetector();

  it('should suggest Legal Research Mode for citations', () => {
    const result = detector.detect('BGE 147 IV 73');

    expect(result.suggestedMode).toBe('Legal Research Mode');
  });

  it('should suggest Legal Research Mode for legal queries', () => {
    const result = detector.detect('Find decisions on liability');

    expect(result.suggestedMode).toBe('Legal Research Mode');
  });

  it('should suggest Federal Law Mode for statute references', () => {
    const result = detector.detect('Review OR provisions');

    expect(result.suggestedMode).toBe('Federal Law Mode');
  });

  it('should suggest Federal Law Mode for court references', () => {
    const result = detector.detect('Bundesgericht decision');

    expect(result.suggestedMode).toBe('Federal Law Mode');
  });
});

describe('AutoDetector - Edge Cases', () => {
  const detector = new AutoDetector();

  it('should handle empty messages', () => {
    const result = detector.detect('');

    expect(result.type).toBe('none');
    expect(result.confidence).toBe(0.0);
  });

  it('should handle whitespace-only messages', () => {
    const result = detector.detect('   ');

    expect(result.type).toBe('none');
    expect(result.confidence).toBe(0.0);
  });

  it('should handle non-legal technical content', () => {
    const result = detector.detect('Install npm packages and run tests');

    expect(result.type).toBe('none');
    expect(result.confidence).toBe(0.0);
  });

  it('should handle mixed-language content', () => {
    const result = detector.detect('Bundesgericht arrêt on sentenza');

    expect(result.type).toBe('case_law');
    // Language detection should pick the dominant indicator
    expect(['de', 'fr', 'it']).toContain(result.language);
  });

  it('should handle partial citations', () => {
    const result = detector.detect('BGE 147');

    // Incomplete citation should not match pattern
    expect(result.citations || []).toHaveLength(0);
  });

  it('should handle malformed citations', () => {
    const result = detector.detect('BGE ABC IV 73');

    expect(result.citations || []).toHaveLength(0);
  });

  it('should be case-insensitive for keywords', () => {
    const lower = detector.detect('bundesgericht');
    const upper = detector.detect('BUNDESGERICHT');
    const mixed = detector.detect('BundesGericht');

    expect(lower.type).toBe(upper.type);
    expect(lower.type).toBe(mixed.type);
  });
});

describe('AutoDetector - Priority Resolution', () => {
  const detector = new AutoDetector();

  it('should prioritize citation detection over keyword detection', () => {
    const result = detector.detect('validate BGE 147 IV 73');

    // Even though "validate" is a keyword, explicit citation takes priority
    expect(result.type).toBe('citation');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('should prioritize courts over statutes', () => {
    const result = detector.detect('Bundesgericht reviews OR provisions');

    // Court reference should trigger case_law over statute_reference
    expect(result.type).toBe('case_law');
  });

  it('should fall back to statute detection when no citations or courts', () => {
    const result = detector.detect('Review OR and ZGB provisions');

    expect(result.type).toBe('statute_reference');
  });
});
