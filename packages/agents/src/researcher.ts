/**
 * BetterCallClaude Researcher Agent (TypeScript)
 *
 * The foundational legal research agent that enables the 80% time savings target.
 * Performs deep, multi-source legal research with automatic citation verification.
 *
 * Workflow:
 * 1. UNDERSTAND - Parse question, identify legal issues
 * 2. PLAN - Determine search strategy
 * 3. SEARCH - Execute parallel searches across sources
 * 4. VERIFY - Verify citations via sub-agent
 * 5. SYNTHESIZE - Analyze findings, identify patterns
 * 6. DELIVER - Generate research memo
 */

import {
  AgentBase,
  AgentConfig,
  AgentResult,
  AgentOutcome,
  ActionType,
  AutonomyMode,
  CaseContext,
} from "./base";

// =============================================================================
// Research-Specific Enums and Types
// =============================================================================

/**
 * Swiss legal domains for classification.
 */
export enum LegalDomain {
  CONTRACT = "contract", // Vertragsrecht (OR)
  TORT = "tort", // Haftpflichtrecht
  PROPERTY = "property", // Sachenrecht (ZGB)
  FAMILY = "family", // Familienrecht
  SUCCESSION = "succession", // Erbrecht
  CORPORATE = "corporate", // Gesellschaftsrecht
  EMPLOYMENT = "employment", // Arbeitsrecht
  CRIMINAL = "criminal", // Strafrecht (StGB)
  ADMINISTRATIVE = "administrative", // Verwaltungsrecht
  PROCEDURAL = "procedural", // Verfahrensrecht (ZPO, StPO)
  DEBT_COLLECTION = "debt_collection", // SchKG
  INTELLECTUAL_PROPERTY = "ip", // Immaterialgüterrecht
  OTHER = "other",
}

/**
 * Research depth levels.
 */
export enum ResearchDepth {
  QUICK = "quick", // 2 min, 10 sources
  STANDARD = "standard", // 5 min, 30 sources
  DEEP = "deep", // 10 min, 50+ sources
}

// =============================================================================
// Research-Specific Interfaces
// =============================================================================

/**
 * Extracted parameters from research question.
 */
export interface ResearchParameters {
  originalQuestion: string;
  legalDomains: LegalDomain[];
  keyTerms: string[];
  concepts: string[];
  jurisdictionFederal: boolean;
  jurisdictionCantons: string[];
  timeRangeFrom?: Date;
  timeRangeTo?: Date;
  languages: string[];
  statuteReferences: string[];
}

/**
 * Configuration for a search source.
 */
export interface SearchSource {
  name: string;
  priority: number;
  expectedVolume: number;
  mcpServer: string;
  searchMethod: string;
}

/**
 * A single search query for a source.
 */
export interface SearchQuery {
  source: string;
  query: string;
  filters: Record<string, unknown>;
  language: string;
  maxResults: number;
}

/**
 * Complete search strategy.
 */
export interface SearchStrategy {
  sources: SearchSource[];
  queries: SearchQuery[];
  relevanceThreshold: number;
  maxTotalResults: number;
  parallelLimit: number;
}

/**
 * A single search result.
 */
export interface RawResult {
  id: string;
  title: string;
  citation: string;
  date?: Date;
  court: string;
  summary: string;
  relevanceScore: number;
  source: string;
  fullTextUrl?: string;
  language: string;
}

/**
 * Aggregated search results.
 */
export interface SearchResults {
  results: RawResult[];
  bySource: Record<string, RawResult[]>;
  totalFound: number;
  deduplicatedCount: number;
  processingTimeMs: number;
}

/**
 * A verified citation.
 */
export interface VerifiedCitation {
  citation: string;
  isValid: boolean;
  isCurrent: boolean;
  formatted: string;
  court: string;
  date?: Date;
  issues: string[];
}

/**
 * Citation verification report.
 */
export interface VerificationReport {
  verified: VerifiedCitation[];
  outdated: VerifiedCitation[];
  errors: Array<{ citation: string; error: string }>;
  overallAccuracy: number;
}

/**
 * A research finding.
 */
export interface ResearchFinding {
  issue: string;
  conclusion: string;
  supportingCitations: string[];
  confidence: number;
  conflicts: string[];
}

/**
 * Research synthesis.
 */
export interface Synthesis {
  keyFindings: ResearchFinding[];
  precedentChain: string[];
  conflicts: Array<Record<string, unknown>>;
  gaps: string[];
  recommendations: string[];
}

/**
 * Final research deliverable.
 */
export interface ResearchMemo {
  title: string;
  executiveSummary: string;
  methodology: string;
  findings: ResearchFinding[];
  citations: VerifiedCitation[];
  limitations: string[];
  nextSteps: string[];
  metadata: Record<string, unknown>;
}

/**
 * Options for research execution.
 */
export interface ResearchOptions {
  depth?: ResearchDepth | string;
  maxSources?: number;
  outputFormat?: "memo" | "bullets" | "json";
}

// =============================================================================
// MCP Client Interface
// =============================================================================

/**
 * Abstract MCP client for legal research servers.
 * In production, this would connect to actual MCP servers.
 */
export interface MCPClient {
  call(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>>;
}

/**
 * Default mock MCP client for development.
 */
class MockMCPClient implements MCPClient {
  async call(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (server === "bge-search" && method === "search") {
      return {
        results: [
          {
            id: "BGE-142-III-234",
            title: "Werkvertrag; Mängelhaftung",
            citation: "BGE 142 III 234",
            date: "2016-05-15",
            court: "Bundesgericht",
            summary:
              "Grundsatzentscheid zur Mängelhaftung im Werkvertrag...",
            relevance_score: 0.95,
            full_text_url: "https://bger.ch/ext/142-III-234",
          },
        ],
        total: 1,
      };
    } else if (server === "cantonal-courts" && method === "search") {
      return { results: [], total: 0 };
    } else if (server === "legal-citations" && method === "verify") {
      return {
        verified: true,
        formatted: params.citation || "",
        is_current: true,
        issues: [],
      };
    }
    return { results: [], total: 0 };
  }
}

// =============================================================================
// Researcher Agent
// =============================================================================

/**
 * Legal research agent for Swiss law.
 *
 * Performs deep, multi-source research with citation verification.
 * Implements the workflow defined in AGENT_RESEARCHER_SPEC.md.
 */
export class ResearcherAgent extends AgentBase {
  // Swiss statute mappings
  private static readonly SWISS_STATUTES: Record<string, string> = {
    OR: "Obligationenrecht",
    ZGB: "Zivilgesetzbuch",
    StGB: "Strafgesetzbuch",
    ZPO: "Zivilprozessordnung",
    StPO: "Strafprozessordnung",
    SchKG: "Schuldbetreibungs- und Konkursgesetz",
    VwVG: "Verwaltungsverfahrensgesetz",
    BGG: "Bundesgerichtsgesetz",
  };

  private static readonly SWISS_CANTONS = [
    "ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR",
    "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG",
    "TI", "VD", "VS", "NE", "GE", "JU",
  ];

  private static readonly DOMAIN_KEYWORDS: Record<LegalDomain, string[]> = {
    [LegalDomain.CONTRACT]: [
      "Vertrag", "Werkvertrag", "Kaufvertrag", "Miete", "Pacht",
      "Mängel", "Gewährleistung", "Verzug", "Schadenersatz", "OR",
    ],
    [LegalDomain.TORT]: [
      "Haftung", "Haftpflicht", "Schaden", "Kausalität", "Verschulden",
      "Gefährdungshaftung", "unerlaubte Handlung",
    ],
    [LegalDomain.EMPLOYMENT]: [
      "Arbeit", "Kündigung", "Arbeitsvertrag", "Lohn", "Überstunden",
      "Ferienanspruch", "Arbeitszeugnis",
    ],
    [LegalDomain.CORPORATE]: [
      "AG", "GmbH", "Aktie", "Generalversammlung", "Verwaltungsrat",
      "Gesellschaft", "Kapital",
    ],
    [LegalDomain.CRIMINAL]: [
      "Straf", "Betrug", "Diebstahl", "Körperverletzung", "StGB",
    ],
    [LegalDomain.DEBT_COLLECTION]: [
      "Betreibung", "Konkurs", "Pfändung", "Rechtsvorschlag", "SchKG",
    ],
    [LegalDomain.PROPERTY]: [],
    [LegalDomain.FAMILY]: [],
    [LegalDomain.SUCCESSION]: [],
    [LegalDomain.ADMINISTRATIVE]: [],
    [LegalDomain.PROCEDURAL]: [],
    [LegalDomain.INTELLECTUAL_PROPERTY]: [],
    [LegalDomain.OTHER]: [],
  };

  private mcpClient: MCPClient;

  constructor(config: AgentConfig & { mcpClient?: MCPClient } = {}) {
    super(config);
    this.mcpClient = config.mcpClient ?? new MockMCPClient();
  }

  get agentId(): string {
    return "researcher";
  }

  get agentVersion(): string {
    return "1.0.0";
  }

  /**
   * Execute legal research workflow.
   */
  async execute(
    task: string,
    options?: ResearchOptions
  ): Promise<AgentResult<ResearchMemo>> {
    this.startTime = new Date();
    this.resetState();

    const depth = this.parseDepth(options?.depth);
    const maxSources = options?.maxSources ?? 50;

    this.updateState("depth", depth);
    this.updateState("maxSources", maxSources);
    this.createCheckpoint("auto", "Research started");

    try {
      // Step 1: UNDERSTAND
      const params = await this.understand(task);
      this.createCheckpoint("auto", "Parameters extracted");

      // Step 2: PLAN
      const strategy = await this.plan(params, depth, maxSources);

      if (this.autonomyMode === AutonomyMode.CAUTIOUS) {
        await this.confirmStrategy(strategy);
      } else if (this.autonomyMode === AutonomyMode.BALANCED) {
        await this.showStrategySummary(strategy);
      }

      // Step 3: SEARCH
      const results = await this.search(strategy);
      this.createCheckpoint(
        "auto",
        `Search completed: ${results.results.length} results`
      );

      // Step 4: VERIFY
      const verification = await this.verify(results);

      if (
        this.autonomyMode === AutonomyMode.CAUTIOUS ||
        this.autonomyMode === AutonomyMode.BALANCED
      ) {
        await this.reportVerification(verification);
      }

      // Step 5: SYNTHESIZE
      const synthesis = await this.synthesize(results, verification, params);
      this.createCheckpoint("auto", "Synthesis completed");

      // Step 6: DELIVER
      const memo = await this.deliver(synthesis, params, results, verification);

      return this.createSuccessResult(memo);
    } catch (error) {
      this.handleError(error as Error);
      return this.createFailureResult(error as Error);
    }
  }

  private parseDepth(depth?: ResearchDepth | string): ResearchDepth {
    if (!depth) return ResearchDepth.STANDARD;
    if (Object.values(ResearchDepth).includes(depth as ResearchDepth)) {
      return depth as ResearchDepth;
    }
    return ResearchDepth.STANDARD;
  }

  // ---------------------------------------------------------------------------
  // Step 1: UNDERSTAND
  // ---------------------------------------------------------------------------

  private async understand(question: string): Promise<ResearchParameters> {
    const start = Date.now();

    const domains = this.detectDomains(question);
    const keyTerms = this.extractKeyTerms(question);
    const statuteRefs = this.extractStatuteReferences(question);
    const [federal, cantons] = this.detectJurisdiction(question);
    const languages = this.detectLanguages(question);
    const concepts = this.extractConcepts(question, domains);

    const params: ResearchParameters = {
      originalQuestion: question,
      legalDomains: domains,
      keyTerms,
      concepts,
      jurisdictionFederal: federal,
      jurisdictionCantons: cantons,
      languages,
      statuteReferences: statuteRefs,
    };

    const durationMs = Date.now() - start;

    this.recordAction(
      ActionType.ANALYZE,
      "Parsed research question",
      { question },
      {
        domains: domains.map((d) => d),
        keyTerms,
        cantons,
      },
      durationMs
    );

    this.updateState("parameters", params);
    return params;
  }

  private detectDomains(question: string): LegalDomain[] {
    const questionLower = question.toLowerCase();
    const detected: LegalDomain[] = [];

    for (const [domain, keywords] of Object.entries(
      ResearcherAgent.DOMAIN_KEYWORDS
    )) {
      for (const keyword of keywords) {
        if (questionLower.includes(keyword.toLowerCase())) {
          const domainEnum = domain as LegalDomain;
          if (!detected.includes(domainEnum)) {
            detected.push(domainEnum);
          }
          break;
        }
      }
    }

    if (detected.length === 0) {
      detected.push(LegalDomain.OTHER);
    }

    return detected;
  }

  private extractKeyTerms(question: string): string[] {
    const stopwords = new Set([
      "der", "die", "das", "und", "oder", "ist", "sind", "was",
      "wie", "wer", "welche", "welcher", "nach", "bei", "für",
      "the", "and", "or", "is", "are", "what", "how", "which",
    ]);

    const words = question.match(/\b\w+\b/g) || [];
    const terms: string[] = [];

    for (const word of words) {
      if (word.length > 3 && !stopwords.has(word.toLowerCase())) {
        if (word[0] === word[0].toUpperCase() || word === word.toUpperCase()) {
          terms.push(word);
        }
      }
    }

    // Extract quoted phrases
    const quoted = question.match(/"([^"]+)"/g) || [];
    terms.push(...quoted.map((q) => q.replace(/"/g, "")));

    return [...new Set(terms)].slice(0, 20);
  }

  private extractStatuteReferences(question: string): string[] {
    const patterns = [
      /Art\.?\s*\d+(?:\s*(?:Abs|lit|Ziff)\.?\s*\d+)*\s*(?:OR|ZGB|StGB|ZPO|StPO|SchKG|BGG)/gi,
      /§\s*\d+\s*[A-Za-z]+/g,
    ];

    const refs: string[] = [];
    for (const pattern of patterns) {
      const matches = question.match(pattern) || [];
      refs.push(...matches);
    }

    return [...new Set(refs)];
  }

  private detectJurisdiction(question: string): [boolean, string[]] {
    const questionUpper = question.toUpperCase();
    const cantons: string[] = [];

    for (const canton of ResearcherAgent.SWISS_CANTONS) {
      if (
        questionUpper.includes(canton) ||
        questionUpper.includes(`KANTON ${canton}`)
      ) {
        cantons.push(canton);
      }
    }

    const cantonalKeywords = [
      "kantonal", "cantonal", "Obergericht", "Handelsgericht",
    ];
    const hasCantonal = cantonalKeywords.some((kw) =>
      question.toLowerCase().includes(kw.toLowerCase())
    );

    const federalKeywords = ["BGE", "Bundesgericht", "federal", "eidgenössisch"];
    const hasFederal = federalKeywords.some((kw) =>
      question.toLowerCase().includes(kw.toLowerCase())
    );

    const federal = hasFederal || (!hasCantonal && cantons.length === 0);

    return [federal, cantons];
  }

  private detectLanguages(question: string): string[] {
    const indicators: Record<string, string[]> = {
      DE: ["Vertrag", "Recht", "Gesetz", "Urteil"],
      FR: ["contrat", "droit", "loi", "arrêt"],
      IT: ["contratto", "diritto", "legge", "sentenza"],
      EN: ["contract", "law", "judgment", "ruling"],
    };

    const languages: string[] = [];

    for (const [lang, words] of Object.entries(indicators)) {
      if (words.some((word) => question.includes(word))) {
        languages.push(lang);
      }
    }

    return languages.length > 0 ? languages : ["DE"];
  }

  private extractConcepts(
    question: string,
    domains: LegalDomain[]
  ): string[] {
    const conceptMap: Partial<Record<LegalDomain, string[]>> = {
      [LegalDomain.CONTRACT]: [
        "Vertragsabschluss", "Vertragserfüllung", "Vertragsverletzung",
        "Leistungsstörung", "Mängelhaftung", "Gewährleistung",
      ],
      [LegalDomain.TORT]: [
        "Kausalzusammenhang", "Widerrechtlichkeit", "Verschulden",
        "Schaden", "Haftungsvoraussetzungen",
      ],
      [LegalDomain.EMPLOYMENT]: [
        "Arbeitspflicht", "Fürsorgepflicht", "Treuepflicht",
        "Kündigungsschutz", "Lohnanspruch",
      ],
    };

    const concepts: string[] = [];

    for (const domain of domains) {
      const domainConcepts = conceptMap[domain] || [];
      for (const concept of domainConcepts) {
        if (question.toLowerCase().includes(concept.toLowerCase())) {
          concepts.push(concept);
        }
      }
    }

    return [...new Set(concepts)];
  }

  // ---------------------------------------------------------------------------
  // Step 2: PLAN
  // ---------------------------------------------------------------------------

  private async plan(
    params: ResearchParameters,
    depth: ResearchDepth,
    maxSources: number
  ): Promise<SearchStrategy> {
    const start = Date.now();

    const sources = this.configureSources(params);
    const queries = this.generateQueries(params, sources);

    const parallelConfig: Record<ResearchDepth, number> = {
      [ResearchDepth.QUICK]: 3,
      [ResearchDepth.STANDARD]: 5,
      [ResearchDepth.DEEP]: 8,
    };

    const strategy: SearchStrategy = {
      sources,
      queries,
      relevanceThreshold: 0.5,
      maxTotalResults: maxSources,
      parallelLimit: parallelConfig[depth],
    };

    const durationMs = Date.now() - start;

    this.recordAction(
      ActionType.ANALYZE,
      "Created search strategy",
      { depth, maxSources },
      {
        sourcesCount: sources.length,
        queriesCount: queries.length,
      },
      durationMs
    );

    this.updateState("strategy", strategy);
    return strategy;
  }

  private configureSources(params: ResearchParameters): SearchSource[] {
    const sources: SearchSource[] = [];

    if (params.jurisdictionFederal) {
      sources.push({
        name: "BGE",
        priority: 1,
        expectedVolume: 30,
        mcpServer: "bge-search",
        searchMethod: "search",
      });
    }

    for (const canton of params.jurisdictionCantons) {
      sources.push({
        name: `Cantonal-${canton}`,
        priority: 2,
        expectedVolume: 20,
        mcpServer: "cantonal-courts",
        searchMethod: "search",
      });
    }

    sources.push({
      name: "Entscheidsuche",
      priority: 3,
      expectedVolume: 50,
      mcpServer: "entscheidsuche",
      searchMethod: "search",
    });

    return sources;
  }

  private generateQueries(
    params: ResearchParameters,
    sources: SearchSource[]
  ): SearchQuery[] {
    const queries: SearchQuery[] = [];
    const baseQuery = params.keyTerms.slice(0, 5).join(" ");
    const statuteQuery = params.statuteReferences.join(" OR ");

    for (const source of sources) {
      let queryText = baseQuery;
      if (statuteQuery) {
        queryText = `(${baseQuery}) AND (${statuteQuery})`;
      }

      const filters: Record<string, unknown> = {};
      if (params.timeRangeFrom) {
        filters.date_from = params.timeRangeFrom.toISOString();
      }
      if (params.timeRangeTo) {
        filters.date_to = params.timeRangeTo.toISOString();
      }

      for (const lang of params.languages) {
        queries.push({
          source: source.name,
          query: queryText,
          filters,
          language: lang,
          maxResults: source.expectedVolume,
        });
      }
    }

    return queries;
  }

  private async confirmStrategy(strategy: SearchStrategy): Promise<void> {
    const summary =
      `Search strategy:\n` +
      `- ${strategy.sources.length} sources\n` +
      `- ${strategy.queries.length} queries\n` +
      `- Max ${strategy.maxTotalResults} results\n` +
      `Proceed?`;
    await this.requestUserConfirmation(summary);
  }

  private async showStrategySummary(_strategy: SearchStrategy): Promise<void> {
    // In real implementation, would display to user
  }

  // ---------------------------------------------------------------------------
  // Step 3: SEARCH
  // ---------------------------------------------------------------------------

  private async search(strategy: SearchStrategy): Promise<SearchResults> {
    const start = Date.now();

    const allResults: RawResult[] = [];
    const bySource: Record<string, RawResult[]> = {};

    // Execute queries in parallel batches
    for (let i = 0; i < strategy.queries.length; i += strategy.parallelLimit) {
      const batch = strategy.queries.slice(i, i + strategy.parallelLimit);
      const batchResults = await Promise.allSettled(
        batch.map((q) => this.executeQuery(q))
      );

      for (let j = 0; j < batch.length; j++) {
        const query = batch[j];
        const result = batchResults[j];

        if (result.status === "rejected") {
          this.handleSearchError(result.reason, query.source);
          continue;
        }

        const sourceResults = this.parseResults(result.value, query.source);
        allResults.push(...sourceResults);

        if (!bySource[query.source]) {
          bySource[query.source] = [];
        }
        bySource[query.source].push(...sourceResults);

        this.recordSourceAccess(query.source);
      }
    }

    // Deduplicate and sort
    let deduplicated = this.deduplicateResults(allResults);
    deduplicated.sort((a, b) => b.relevanceScore - a.relevanceScore);
    deduplicated = deduplicated.slice(0, strategy.maxTotalResults);

    const durationMs = Date.now() - start;

    this.recordAction(
      ActionType.SEARCH,
      "Executed parallel searches",
      { queries: strategy.queries.length },
      {
        totalFound: allResults.length,
        deduplicated: deduplicated.length,
      },
      durationMs
    );

    return {
      results: deduplicated,
      bySource,
      totalFound: allResults.length,
      deduplicatedCount: deduplicated.length,
      processingTimeMs: durationMs,
    };
  }

  private async executeQuery(
    query: SearchQuery
  ): Promise<Record<string, unknown>> {
    const mcpServer = this.getMcpServer(query.source);

    return await this.mcpClient.call(mcpServer, "search", {
      query: query.query,
      filters: query.filters,
      language: query.language,
      limit: query.maxResults,
    });
  }

  private getMcpServer(sourceName: string): string {
    if (sourceName === "BGE") {
      return "bge-search";
    } else if (sourceName.startsWith("Cantonal-")) {
      return "cantonal-courts";
    }
    return "entscheidsuche";
  }

  private parseResults(
    response: Record<string, unknown>,
    source: string
  ): RawResult[] {
    const results: RawResult[] = [];
    const items = (response.results as Array<Record<string, unknown>>) || [];

    for (const item of items) {
      try {
        let date: Date | undefined;
        if (item.date) {
          date = new Date(String(item.date).replace("Z", "+00:00"));
        }

        results.push({
          id: String(item.id || ""),
          title: String(item.title || ""),
          citation: String(item.citation || ""),
          date,
          court: String(item.court || ""),
          summary: String(item.summary || ""),
          relevanceScore: Number(item.relevance_score || 0.5),
          source,
          fullTextUrl: item.full_text_url
            ? String(item.full_text_url)
            : undefined,
          language: String(item.language || "DE"),
        });
      } catch {
        // Skip malformed results
      }
    }

    return results;
  }

  private deduplicateResults(results: RawResult[]): RawResult[] {
    const seenCitations = new Set<string>();
    const unique: RawResult[] = [];

    for (const result of results) {
      const citationKey = result.citation.toLowerCase().trim();
      if (citationKey && !seenCitations.has(citationKey)) {
        seenCitations.add(citationKey);
        unique.push(result);
      }
    }

    return unique;
  }

  private handleSearchError(error: unknown, source: string): void {
    console.error(`Search error for ${source}:`, error);
  }

  // ---------------------------------------------------------------------------
  // Step 4: VERIFY
  // ---------------------------------------------------------------------------

  private async verify(results: SearchResults): Promise<VerificationReport> {
    const start = Date.now();

    const verified: VerifiedCitation[] = [];
    const outdated: VerifiedCitation[] = [];
    const errors: Array<{ citation: string; error: string }> = [];

    const citations = [
      ...new Set(results.results.map((r) => r.citation).filter(Boolean)),
    ];

    for (const citation of citations) {
      try {
        const response = await this.mcpClient.call("legal-citations", "verify", {
          citation,
        });

        const verifiedCitation: VerifiedCitation = {
          citation,
          isValid: Boolean(response.verified),
          isCurrent: Boolean(response.is_current ?? true),
          formatted: String(response.formatted || citation),
          court: String(response.court || ""),
          date: undefined,
          issues: (response.issues as string[]) || [],
        };

        if (verifiedCitation.isCurrent) {
          verified.push(verifiedCitation);
        } else {
          outdated.push(verifiedCitation);
        }
      } catch (e) {
        errors.push({
          citation,
          error: String(e),
        });
      }
    }

    const total = verified.length + outdated.length + errors.length;
    const accuracy = total > 0 ? verified.length / total : 1.0;

    const durationMs = Date.now() - start;

    this.recordAction(
      ActionType.ANALYZE,
      "Verified citations",
      { citationsCount: citations.length },
      {
        verified: verified.length,
        outdated: outdated.length,
        errors: errors.length,
        accuracy,
      },
      durationMs
    );

    return {
      verified,
      outdated,
      errors,
      overallAccuracy: accuracy,
    };
  }

  private async reportVerification(
    report: VerificationReport
  ): Promise<void> {
    if (report.outdated.length > 0 || report.errors.length > 0) {
      const message =
        `Citation verification complete:\n` +
        `- ${report.verified.length} verified\n` +
        `- ${report.outdated.length} outdated\n` +
        `- ${report.errors.length} errors\n` +
        `Continue with synthesis?`;
      await this.requestUserConfirmation(message);
    }
  }

  // ---------------------------------------------------------------------------
  // Step 5: SYNTHESIZE
  // ---------------------------------------------------------------------------

  private async synthesize(
    results: SearchResults,
    verification: VerificationReport,
    params: ResearchParameters
  ): Promise<Synthesis> {
    const start = Date.now();

    const grouped = this.groupByIssue(results.results, params);

    const findings: ResearchFinding[] = [];
    for (const [issue, issueResults] of Object.entries(grouped)) {
      const finding = this.generateFinding(issue, issueResults, verification);
      findings.push(finding);
    }

    const precedentChain = this.buildPrecedentChain(results.results);
    const conflicts = this.identifyConflicts(findings);
    const gaps = this.identifyGaps(params, findings);
    const recommendations = this.generateRecommendations(findings, gaps);

    const durationMs = Date.now() - start;

    this.recordAction(
      ActionType.ANALYZE,
      "Synthesized research findings",
      { resultsCount: results.results.length },
      {
        findings: findings.length,
        conflicts: conflicts.length,
        gaps: gaps.length,
      },
      durationMs
    );

    return {
      keyFindings: findings,
      precedentChain,
      conflicts,
      gaps,
      recommendations,
    };
  }

  private groupByIssue(
    results: RawResult[],
    params: ResearchParameters
  ): Record<string, RawResult[]> {
    const grouped: Record<string, RawResult[]> = {};

    for (const result of results) {
      for (const domain of params.legalDomains) {
        const issue = domain;
        if (!grouped[issue]) {
          grouped[issue] = [];
        }
        grouped[issue].push(result);
      }
    }

    return grouped;
  }

  private generateFinding(
    issue: string,
    results: RawResult[],
    verification: VerificationReport
  ): ResearchFinding {
    const resultCitations = results.map((r) => r.citation);
    const verifiedCitations = verification.verified
      .filter((v) => resultCitations.includes(v.citation))
      .map((v) => v.formatted);

    const confidence = Math.min(verifiedCitations.length / 5, 1.0);

    let conclusion: string;
    if (results.length > 0) {
      conclusion = `Based on ${results.length} precedents, the legal position on ${issue} is established.`;
    } else {
      conclusion = `No clear precedent found for ${issue}.`;
    }

    return {
      issue,
      conclusion,
      supportingCitations: verifiedCitations.slice(0, 5),
      confidence,
      conflicts: [],
    };
  }

  private buildPrecedentChain(results: RawResult[]): string[] {
    const dated = results.filter((r) => r.date);
    dated.sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
    return dated.slice(0, 10).map((r) => r.citation);
  }

  private identifyConflicts(_findings: ResearchFinding[]): Array<Record<string, unknown>> {
    // Simplified - would use more sophisticated analysis
    return [];
  }

  private identifyGaps(
    params: ResearchParameters,
    findings: ResearchFinding[]
  ): string[] {
    const gaps: string[] = [];

    const coveredIssues = new Set(findings.map((f) => f.issue));
    for (const domain of params.legalDomains) {
      if (!coveredIssues.has(domain)) {
        gaps.push(`No findings for ${domain}`);
      }
    }

    const lowConfidence = findings.filter((f) => f.confidence < 0.5);
    for (const finding of lowConfidence) {
      gaps.push(`Low confidence for ${finding.issue}`);
    }

    return gaps;
  }

  private generateRecommendations(
    findings: ResearchFinding[],
    gaps: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (gaps.length > 0) {
      recommendations.push("Consider additional research to address gaps");
    }

    const lowConfidence = findings.filter((f) => f.confidence < 0.7);
    if (lowConfidence.length > 0) {
      recommendations.push("Consult doctrine for low-confidence findings");
    }

    return recommendations;
  }

  // ---------------------------------------------------------------------------
  // Step 6: DELIVER
  // ---------------------------------------------------------------------------

  private async deliver(
    synthesis: Synthesis,
    params: ResearchParameters,
    results: SearchResults,
    verification: VerificationReport
  ): Promise<ResearchMemo> {
    const start = Date.now();

    const executiveSummary = this.generateExecutiveSummary(synthesis, params);
    const methodology = this.generateMethodology(params, results);
    const limitations = this.compileLimitations(results, verification);

    const nextSteps = [...synthesis.recommendations];
    if (synthesis.gaps.length > 0) {
      nextSteps.push("Address identified research gaps");
    }

    const metadata: Record<string, unknown> = {
      researchDate: new Date().toISOString(),
      question: params.originalQuestion,
      sourcesSearched: Object.keys(results.bySource).length,
      totalResults: results.totalFound,
      verifiedCitations: verification.verified.length,
      processingTimeMs: results.processingTimeMs,
      autonomyMode: this.autonomyMode,
    };

    const durationMs = Date.now() - start;

    this.recordAction(
      ActionType.GENERATE,
      "Generated research memo",
      {},
      { sections: 6 },
      durationMs
    );

    const memo: ResearchMemo = {
      title: `Research Memo: ${params.originalQuestion.slice(0, 50)}...`,
      executiveSummary,
      methodology,
      findings: synthesis.keyFindings,
      citations: verification.verified,
      limitations,
      nextSteps,
      metadata,
    };

    this.recordDocumentWrite("research_memo");
    return memo;
  }

  private generateExecutiveSummary(
    synthesis: Synthesis,
    params: ResearchParameters
  ): string {
    const findingsSummary: string[] = [];
    for (const finding of synthesis.keyFindings) {
      if (finding.confidence >= 0.7) {
        findingsSummary.push(finding.conclusion);
      }
    }

    if (findingsSummary.length > 0) {
      return findingsSummary.slice(0, 3).join(" ");
    }
    return `Research completed for: ${params.originalQuestion}. See detailed findings below.`;
  }

  private generateMethodology(
    params: ResearchParameters,
    results: SearchResults
  ): string {
    const sources = Object.keys(results.bySource);
    return (
      `This research analyzed ${results.totalFound} sources from ${sources.length} databases ` +
      `(${sources.join(", ")}). Results were deduplicated and verified for currency. ` +
      `Languages: ${params.languages.join(", ")}.`
    );
  }

  private compileLimitations(
    results: SearchResults,
    verification: VerificationReport
  ): string[] {
    const limitations: string[] = [];

    if (verification.outdated.length > 0) {
      limitations.push(
        `${verification.outdated.length} citations may be outdated`
      );
    }

    if (verification.errors.length > 0) {
      limitations.push(
        `${verification.errors.length} citations could not be verified`
      );
    }

    return limitations;
  }

  // ---------------------------------------------------------------------------
  // Result Creation
  // ---------------------------------------------------------------------------

  private createSuccessResult(memo: ResearchMemo): AgentResult<ResearchMemo> {
    const executionTime = Date.now() - (this.startTime?.getTime() ?? Date.now());

    const auditLog = this.createAuditLog(AgentOutcome.SUCCESS, ["research_memo"]);

    return {
      success: true,
      outcome: AgentOutcome.SUCCESS,
      deliverable: memo,
      partialResults: undefined,
      errorMessage: undefined,
      auditLog,
      executionTimeMs: executionTime,
    };
  }

  private createFailureResult(error: Error): AgentResult<ResearchMemo> {
    const executionTime = Date.now() - (this.startTime?.getTime() ?? Date.now());

    const params = this.getState<ResearchParameters>("parameters");
    const partial = params ? this.createPartialResult(params) : undefined;

    const auditLog = this.createAuditLog(AgentOutcome.FAILED, []);

    return {
      success: false,
      outcome: AgentOutcome.FAILED,
      deliverable: undefined,
      // Cast partial results - contains recovery metadata, not a full ResearchMemo
      partialResults: partial as ResearchMemo | undefined,
      errorMessage: error.message,
      auditLog,
      executionTimeMs: executionTime,
    };
  }
}

// =============================================================================
// Exports
// =============================================================================

export {
  MockMCPClient,
};
