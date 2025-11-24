/**
 * Entscheidsuche MCP Server - Unit Tests
 * Tests for Swiss federal and cantonal court decision search functionality
 */

import { describe, it, expect } from '@jest/globals';

// Court decision type definition
interface CourtDecision {
  decisionId: string;
  courtName: string;
  courtLevel: "federal" | "cantonal" | "district";
  canton?: string;
  title: string;
  date: string;
  language: string;
  summary: string;
  legalAreas?: string[];
  referenceNumber?: string;
  fullTextUrl?: string;
}

// Search parameters interface
interface SearchParams {
  query: string;
  courtLevel?: "federal" | "cantonal" | "district";
  canton?: string;
  language?: string;
  dateFrom?: string;
  dateTo?: string;
  legalAreas?: string[];
  limit?: number;
}

// Mock decisions database
const mockDecisionsDatabase: CourtDecision[] = [
  {
    decisionId: "BG-2021-001",
    courtName: "Bundesgericht (Federal Supreme Court)",
    courtLevel: "federal",
    title: "Sozialversicherungsrecht - Invalidenversicherung",
    date: "2021-09-15T00:00:00Z",
    language: "DE",
    summary: "Decision on disability insurance eligibility for mental health conditions",
    legalAreas: ["Sozialversicherungsrecht"],
    referenceNumber: "8C_413/2020",
    fullTextUrl: "https://www.bger.ch/ext/eurospider/live/de/php/aza/http/index.php?highlight_docid=aza%3A%2F%2F15-09-2021-8C_413-2020"
  },
  {
    decisionId: "ZH-2023-001",
    courtName: "Obergericht Zürich",
    courtLevel: "cantonal",
    canton: "ZH",
    title: "Arbeitsrecht - Kündigungsschutz",
    date: "2023-05-10T00:00:00Z",
    language: "DE",
    summary: "Employment law decision on unfair dismissal protection",
    legalAreas: ["Arbeitsrecht", "Zivilrecht"],
    referenceNumber: "LA220050",
    fullTextUrl: "https://www.zh.ch/de/gerichte-notariate/obergericht/entscheide.html"
  },
  {
    decisionId: "GE-2022-003",
    courtName: "Tribunal cantonal de Genève",
    courtLevel: "cantonal",
    canton: "GE",
    title: "Droit du travail - Licenciement abusif",
    date: "2022-11-20T00:00:00Z",
    language: "FR",
    summary: "Décision sur le licenciement abusif en droit du travail",
    legalAreas: ["Arbeitsrecht", "Droit civil"],
    referenceNumber: "CACI/245/2022",
    fullTextUrl: "https://ge.ch/justice/tribunal-cantonal"
  },
  {
    decisionId: "BE-2023-005",
    courtName: "Obergericht Bern",
    courtLevel: "cantonal",
    canton: "BE",
    title: "Mietrecht - Kündigungsschutz bei Sanierungen",
    date: "2023-03-15T00:00:00Z",
    language: "DE",
    summary: "Rental law decision on eviction protection during renovations",
    legalAreas: ["Mietrecht", "Zivilrecht"],
    referenceNumber: "MZK-22-456"
  }
];

/**
 * Search court decisions
 */
function searchDecisions(params: SearchParams): {
  decisions: CourtDecision[];
  totalResults: number;
  facets: Record<string, number>;
  searchTimeMs: number;
} {
  const startTime = Date.now();

  let filtered = mockDecisionsDatabase;

  // Filter by query
  if (params.query) {
    const queryLower = params.query.toLowerCase();
    filtered = filtered.filter(decision =>
      decision.title.toLowerCase().includes(queryLower) ||
      decision.summary.toLowerCase().includes(queryLower) ||
      decision.decisionId.toLowerCase().includes(queryLower)
    );
  }

  // Filter by court level
  if (params.courtLevel) {
    filtered = filtered.filter(decision => decision.courtLevel === params.courtLevel);
  }

  // Filter by canton
  if (params.canton) {
    filtered = filtered.filter(decision => decision.canton === params.canton);
  }

  // Filter by language
  if (params.language) {
    filtered = filtered.filter(decision => decision.language === params.language);
  }

  // Filter by date range
  if (params.dateFrom) {
    filtered = filtered.filter(decision => decision.date >= params.dateFrom!);
  }
  if (params.dateTo) {
    filtered = filtered.filter(decision => decision.date <= params.dateTo!);
  }

  // Filter by legal areas
  if (params.legalAreas && params.legalAreas.length > 0) {
    filtered = filtered.filter(decision =>
      decision.legalAreas?.some(area => params.legalAreas!.includes(area))
    );
  }

  // Calculate facets
  const facets: Record<string, number> = {
    federal: filtered.filter(d => d.courtLevel === "federal").length,
    cantonal: filtered.filter(d => d.courtLevel === "cantonal").length,
    district: filtered.filter(d => d.courtLevel === "district").length
  };

  // Apply limit
  const limit = params.limit || 10;
  const decisions = filtered.slice(0, limit);

  const searchTimeMs = Date.now() - startTime;

  return {
    decisions,
    totalResults: filtered.length,
    facets,
    searchTimeMs
  };
}

/**
 * Get related decisions
 */
function getRelatedDecisions(decisionId: string, limit: number = 5): {
  relatedDecisions: CourtDecision[];
} {
  // Find the base decision
  const baseDecision = mockDecisionsDatabase.find(d => d.decisionId === decisionId);

  if (!baseDecision) {
    return { relatedDecisions: [] };
  }

  // Find related decisions (same legal areas or same canton)
  const related = mockDecisionsDatabase.filter(decision =>
    decision.decisionId !== decisionId && (
      decision.legalAreas?.some(area => baseDecision.legalAreas?.includes(area)) ||
      (decision.canton && decision.canton === baseDecision.canton)
    )
  ).slice(0, limit);

  return {
    relatedDecisions: related
  };
}

/**
 * Get decision details
 */
function getDecisionDetails(decisionId: string): {
  found: boolean;
  decision?: CourtDecision;
} {
  const decision = mockDecisionsDatabase.find(d => d.decisionId === decisionId);

  return {
    found: !!decision,
    decision
  };
}

describe('Entscheidsuche MCP Server', () => {
  describe('searchDecisions', () => {
    it('should return all decisions when no filters applied', () => {
      const result = searchDecisions({ query: '' });
      expect(result.decisions).toHaveLength(4);
      expect(result.totalResults).toBe(4);
    });

    it('should filter by query text in title', () => {
      const result = searchDecisions({ query: 'Arbeitsrecht' });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].title).toContain('Arbeitsrecht');
    });

    it('should filter by query text in summary', () => {
      const result = searchDecisions({ query: 'disability insurance' });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].decisionId).toBe('BG-2021-001');
    });

    it('should filter by query text in decision ID', () => {
      const result = searchDecisions({ query: 'ZH-2023' });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].decisionId).toBe('ZH-2023-001');
    });

    it('should filter by court level - federal', () => {
      const result = searchDecisions({ query: '', courtLevel: 'federal' });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].courtLevel).toBe('federal');
      expect(result.decisions[0].decisionId).toBe('BG-2021-001');
    });

    it('should filter by court level - cantonal', () => {
      const result = searchDecisions({ query: '', courtLevel: 'cantonal' });
      expect(result.decisions).toHaveLength(3);
      expect(result.decisions.every(d => d.courtLevel === 'cantonal')).toBe(true);
    });

    it('should filter by canton', () => {
      const result = searchDecisions({ query: '', canton: 'ZH' });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].canton).toBe('ZH');
    });

    it('should filter by language - DE', () => {
      const result = searchDecisions({ query: '', language: 'DE' });
      expect(result.decisions).toHaveLength(3);
      expect(result.decisions.every(d => d.language === 'DE')).toBe(true);
    });

    it('should filter by language - FR', () => {
      const result = searchDecisions({ query: '', language: 'FR' });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].language).toBe('FR');
      expect(result.decisions[0].decisionId).toBe('GE-2022-003');
    });

    it('should filter by legal area', () => {
      const result = searchDecisions({ query: '', legalAreas: ['Arbeitsrecht'] });
      expect(result.decisions).toHaveLength(2);
      expect(result.decisions.every(d => d.legalAreas?.includes('Arbeitsrecht'))).toBe(true);
    });

    it('should filter by multiple legal areas', () => {
      const result = searchDecisions({ query: '', legalAreas: ['Mietrecht', 'Sozialversicherungsrecht'] });
      expect(result.decisions).toHaveLength(2);
    });

    it('should filter by date range - from', () => {
      const result = searchDecisions({
        query: '',
        dateFrom: '2022-01-01T00:00:00Z'
      });
      expect(result.decisions).toHaveLength(3);
      expect(result.decisions.every(d => d.date >= '2022-01-01T00:00:00Z')).toBe(true);
    });

    it('should filter by date range - to', () => {
      const result = searchDecisions({
        query: '',
        dateTo: '2022-12-31T23:59:59Z'
      });
      expect(result.decisions).toHaveLength(2);
      expect(result.decisions.every(d => d.date <= '2022-12-31T23:59:59Z')).toBe(true);
    });

    it('should filter by date range - from and to', () => {
      const result = searchDecisions({
        query: '',
        dateFrom: '2022-01-01T00:00:00Z',
        dateTo: '2023-03-31T23:59:59Z'
      });
      expect(result.decisions).toHaveLength(2);
    });

    it('should respect limit parameter', () => {
      const result = searchDecisions({ query: '', limit: 2 });
      expect(result.decisions).toHaveLength(2);
      expect(result.totalResults).toBe(4);
    });

    it('should return search time', () => {
      const result = searchDecisions({ query: '' });
      expect(result.searchTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should return facets', () => {
      const result = searchDecisions({ query: '' });
      expect(result.facets).toBeDefined();
      expect(result.facets.federal).toBe(1);
      expect(result.facets.cantonal).toBe(3);
      expect(result.facets.district).toBe(0);
    });

    it('should combine multiple filters', () => {
      const result = searchDecisions({
        query: '',
        courtLevel: 'cantonal',
        language: 'DE',
        legalAreas: ['Arbeitsrecht']
      });
      expect(result.decisions).toHaveLength(1);
      expect(result.decisions[0].decisionId).toBe('ZH-2023-001');
    });

    it('should return empty array for no matches', () => {
      const result = searchDecisions({ query: 'xyznonexistent' });
      expect(result.decisions).toHaveLength(0);
      expect(result.totalResults).toBe(0);
    });
  });

  describe('getRelatedDecisions', () => {
    it('should find related decisions by legal area', () => {
      const result = getRelatedDecisions('ZH-2023-001');
      expect(result.relatedDecisions.length).toBeGreaterThan(0);
      expect(result.relatedDecisions.some(d => d.legalAreas?.includes('Arbeitsrecht'))).toBe(true);
    });

    it('should find related decisions by canton', () => {
      const result = getRelatedDecisions('ZH-2023-001');
      expect(result.relatedDecisions.length).toBeGreaterThan(0);
      // Should not include the decision itself
      expect(result.relatedDecisions.every(d => d.decisionId !== 'ZH-2023-001')).toBe(true);
    });

    it('should respect limit parameter', () => {
      const result = getRelatedDecisions('ZH-2023-001', 1);
      expect(result.relatedDecisions).toHaveLength(1);
    });

    it('should return empty array for non-existent decision', () => {
      const result = getRelatedDecisions('INVALID-ID');
      expect(result.relatedDecisions).toHaveLength(0);
    });

    it('should not include the decision itself in results', () => {
      const result = getRelatedDecisions('BG-2021-001');
      expect(result.relatedDecisions.every(d => d.decisionId !== 'BG-2021-001')).toBe(true);
    });

    it('should find decisions with overlapping legal areas', () => {
      const result = getRelatedDecisions('ZH-2023-001'); // Has Arbeitsrecht
      const hasRelatedLegalArea = result.relatedDecisions.some(d =>
        d.legalAreas?.includes('Arbeitsrecht')
      );
      expect(hasRelatedLegalArea).toBe(true);
    });
  });

  describe('getDecisionDetails', () => {
    it('should find existing decision', () => {
      const result = getDecisionDetails('BG-2021-001');
      expect(result.found).toBe(true);
      expect(result.decision).toBeDefined();
      expect(result.decision?.decisionId).toBe('BG-2021-001');
    });

    it('should return not found for non-existent decision', () => {
      const result = getDecisionDetails('INVALID-999');
      expect(result.found).toBe(false);
      expect(result.decision).toBeUndefined();
    });

    it('should return full decision details', () => {
      const result = getDecisionDetails('ZH-2023-001');
      expect(result.decision?.courtName).toBe('Obergericht Zürich');
      expect(result.decision?.courtLevel).toBe('cantonal');
      expect(result.decision?.canton).toBe('ZH');
      expect(result.decision?.legalAreas).toContain('Arbeitsrecht');
    });

    it('should find federal decision', () => {
      const result = getDecisionDetails('BG-2021-001');
      expect(result.found).toBe(true);
      expect(result.decision?.courtLevel).toBe('federal');
    });

    it('should find cantonal decision with French language', () => {
      const result = getDecisionDetails('GE-2022-003');
      expect(result.found).toBe(true);
      expect(result.decision?.language).toBe('FR');
    });
  });

  describe('Integration Tests', () => {
    it('should support search -> get details workflow', () => {
      const search = searchDecisions({ query: 'Arbeitsrecht', limit: 1 });
      expect(search.decisions.length).toBeGreaterThan(0);

      const firstDecisionId = search.decisions[0].decisionId;
      const details = getDecisionDetails(firstDecisionId);
      expect(details.found).toBe(true);
      expect(details.decision?.decisionId).toBe(firstDecisionId);
    });

    it('should support search -> get related workflow', () => {
      const search = searchDecisions({ query: 'Arbeitsrecht', limit: 1 });
      expect(search.decisions.length).toBeGreaterThan(0);

      const firstDecisionId = search.decisions[0].decisionId;
      const related = getRelatedDecisions(firstDecisionId);
      // Should have related decisions with same legal area
      expect(related.relatedDecisions.length).toBeGreaterThan(0);
    });

    it('should support get details -> get related workflow', () => {
      const details = getDecisionDetails('ZH-2023-001');
      expect(details.found).toBe(true);

      const related = getRelatedDecisions(details.decision!.decisionId);
      expect(related.relatedDecisions.length).toBeGreaterThan(0);
      // Related decisions should share legal areas or canton
      const hasCommonality = related.relatedDecisions.some(d =>
        d.legalAreas?.some(area => details.decision!.legalAreas?.includes(area)) ||
        d.canton === details.decision!.canton
      );
      expect(hasCommonality).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty query', () => {
      const result = searchDecisions({ query: '' });
      expect(result.totalResults).toBeGreaterThan(0);
    });

    it('should handle query with no results', () => {
      const result = searchDecisions({ query: 'xyznonexistent' });
      expect(result.decisions).toHaveLength(0);
      expect(result.totalResults).toBe(0);
    });

    it('should handle empty legal areas filter', () => {
      const result = searchDecisions({ query: '', legalAreas: [] });
      expect(result.decisions).toHaveLength(4);
    });

    it('should handle limit larger than results', () => {
      const result = searchDecisions({ query: '', limit: 100 });
      expect(result.decisions).toHaveLength(4);
    });

    it('should handle limit of 1', () => {
      const result = searchDecisions({ query: '', limit: 1 });
      expect(result.decisions).toHaveLength(1);
    });

    it('should handle non-existent court level', () => {
      const result = searchDecisions({ query: '', courtLevel: 'district' });
      expect(result.decisions).toHaveLength(0);
    });

    it('should handle non-existent canton', () => {
      const result = searchDecisions({ query: '', canton: 'XX' });
      expect(result.decisions).toHaveLength(0);
    });

    it('should handle case-insensitive query', () => {
      const result1 = searchDecisions({ query: 'arbeitsrecht' });
      const result2 = searchDecisions({ query: 'ARBEITSRECHT' });
      expect(result1.totalResults).toBe(result2.totalResults);
    });

    it('should handle special characters in query', () => {
      const result = searchDecisions({ query: 'Kündigungsschutz' });
      expect(result.decisions.length).toBeGreaterThan(0);
    });
  });
});
