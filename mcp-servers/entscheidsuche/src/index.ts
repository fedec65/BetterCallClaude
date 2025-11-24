#!/usr/bin/env node

/**
 * Entscheidsuche MCP Server - Production Version
 *
 * Provides unified access to Swiss federal and cantonal court decisions
 * via the Model Context Protocol over stdio transport.
 *
 * Features:
 * - Real API integration for federal (Bundesgericht) and cantonal courts
 * - Multi-canton parallel search aggregation
 * - Database persistence for all decisions
 * - Cache-first strategy for performance
 * - Unified search across court levels
 *
 * Tools:
 * - search_decisions: Unified search across federal and cantonal courts
 * - search_canton: Search specific canton(s) with parallel aggregation
 * - get_related_decisions: Find related decisions via citation graph
 * - get_decision_details: Retrieve full decision details
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import shared infrastructure
import {
  getConfig,
  getLogger,
  Logger,
  getDataSource,
  BundesgerichtClient,
  CantonalClient,
  CantonalClientFactory,
  DecisionRepository,
  CacheRepository,
  type Canton,
  type BundesgerichtSearchFilters,
  type CantonalSearchFilters,
  type BundesgerichtDecision,
  type CantonalDecision,
  type APIClientOptions,
} from "@bettercallclaude/shared";

// Unified search parameters interface (MCP tool input)
interface SearchParams {
  query: string;
  courtLevel?: "federal" | "cantonal" | "all";
  cantons?: Canton[];
  language?: string;
  dateFrom?: string;
  dateTo?: string;
  legalAreas?: string[];
  limit?: number;
}

// Canton-specific search parameters
interface CantonSearchParams {
  query: string;
  cantons: Canton[];
  language?: string;
  dateFrom?: string;
  dateTo?: string;
  legalAreas?: string[];
  limit?: number;
}

/**
 * Global instances
 */
let bundesgerichtClient: BundesgerichtClient;
let cantonalClients: Record<Canton, CantonalClient>;
let decisionRepo: DecisionRepository;
let cacheRepo: CacheRepository;
let logger: Logger;

/**
 * Initialize infrastructure components
 */
async function initializeInfrastructure() {
  // Load configuration
  const config = getConfig();
  const winstonLogger = getLogger(config.logging);
  logger = new Logger(winstonLogger);

  logger.info("Initializing Entscheidsuche MCP server", {
    version: "2.0.0",
    environment: config.environment,
  });

  // Initialize database connection
  const dataSource = await getDataSource(config.database);
  logger.info("Database connection established", {
    type: config.database.type,
  });

  // Initialize repositories
  decisionRepo = new DecisionRepository(dataSource);
  cacheRepo = new CacheRepository(dataSource);
  logger.info("Repositories initialized");

  // Initialize Bundesgericht API client
  bundesgerichtClient = new BundesgerichtClient({
    config: config.apis.bundesgericht,
    logger,
    serviceName: "bundesgericht",
  });
  logger.info("Bundesgericht API client initialized", {
    baseUrl: config.apis.bundesgericht.baseUrl,
  });

  // Initialize cantonal clients for all configured cantons
  const cantonConfigs: Record<Canton, APIClientOptions> = {} as Record<Canton, APIClientOptions>;
  const availableCantons: Canton[] = ['ZH', 'BE', 'GE', 'BS', 'VD', 'TI'];

  for (const canton of availableCantons) {
    if (config.apis.cantons[canton]) {
      cantonConfigs[canton] = {
        config: config.apis.cantons[canton],
        logger,
        serviceName: `cantonal-${canton.toLowerCase()}`,
      };
    }
  }

  cantonalClients = CantonalClientFactory.createClients(
    cantonConfigs,
    logger
  );
  logger.info("Cantonal API clients initialized", {
    cantons: Object.keys(cantonalClients),
  });
}

/**
 * Unified search across federal and cantonal courts with cache-first strategy
 */
async function searchDecisions(params: SearchParams): Promise<{
  decisions: Array<BundesgerichtDecision | CantonalDecision>;
  totalResults: number;
  searchTimeMs: number;
  fromCache: boolean;
  facets: {
    byCourtLevel: Record<string, number>;
    byCanton: Record<string, number>;
  };
}> {
  const startTime = Date.now();

  try {
    // Create cache key from search parameters
    const cacheKey = `unified_search:${JSON.stringify(params)}`;

    // Check cache first
    const cached = await cacheRepo.get(cacheKey);
    if (cached) {
      logger.info("Cache hit for unified search", { cacheKey });
      const cachedResult = JSON.parse(cached);
      return {
        ...cachedResult,
        searchTimeMs: Date.now() - startTime,
        fromCache: true,
      };
    }

    logger.info("Cache miss - fetching from APIs", { cacheKey });

    const allDecisions: Array<BundesgerichtDecision | CantonalDecision> = [];

    // Search federal court if requested
    if (!params.courtLevel || params.courtLevel === "federal" || params.courtLevel === "all") {
      const federalFilters: BundesgerichtSearchFilters = {
        query: params.query,
        language: params.language as "de" | "fr" | "it" | undefined,
        legalArea: params.legalAreas?.[0],
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        limit: params.limit || 10,
      };

      const federalResult = await bundesgerichtClient.searchDecisions(federalFilters);

      // Store federal decisions in database
      if (federalResult.decisions.length > 0) {
        await Promise.all(
          federalResult.decisions.map(async (decision: BundesgerichtDecision) => {
            await decisionRepo.upsert({
              decisionId: decision.decisionId,
              courtLevel: "federal" as const,
              title: decision.title,
              summary: decision.summary,
              decisionDate: new Date(decision.decisionDate),
              language: decision.language,
              legalAreas: decision.legalAreas,
              fullText: decision.fullText,
              relatedDecisions: decision.relatedDecisions,
              metadata: decision.metadata,
              chamber: decision.chamber,
              bgeReference: decision.bgeReference,
              sourceUrl: decision.sourceUrl,
              lastFetchedAt: new Date(),
            });
          })
        );
        logger.info("Stored federal decisions in database", {
          count: federalResult.decisions.length,
        });
      }

      allDecisions.push(...federalResult.decisions);
    }

    // Search cantonal courts if requested
    if (!params.courtLevel || params.courtLevel === "cantonal" || params.courtLevel === "all") {
      const cantonalFilters: CantonalSearchFilters = {
        query: params.query,
        language: params.language as "de" | "fr" | "it" | undefined,
        legalArea: params.legalAreas?.[0],
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        limit: params.limit || 10,
      };

      // If specific cantons requested, filter clients
      const clientsToUse = params.cantons
        ? Object.fromEntries(
            params.cantons.map(canton => [canton, cantonalClients[canton]])
          )
        : cantonalClients;

      // Search across cantons in parallel
      const cantonalResult = await CantonalClientFactory.searchAcrossCantons(
        clientsToUse as Record<Canton, CantonalClient>,
        cantonalFilters
      );

      // Store cantonal decisions in database
      if (cantonalResult.decisions.length > 0) {
        await Promise.all(
          cantonalResult.decisions.map(async (decision: CantonalDecision) => {
            await decisionRepo.upsert({
              decisionId: decision.decisionId,
              courtLevel: "cantonal" as const,
              canton: decision.canton,
              title: decision.title,
              summary: decision.summary,
              decisionDate: new Date(decision.decisionDate),
              language: decision.language,
              legalAreas: decision.legalAreas,
              fullText: decision.fullText,
              relatedDecisions: decision.relatedDecisions,
              metadata: decision.metadata,
              sourceUrl: decision.sourceUrl,
              lastFetchedAt: new Date(),
            });
          })
        );
        logger.info("Stored cantonal decisions in database", {
          count: cantonalResult.decisions.length,
          byCanton: cantonalResult.byCanton,
        });
      }

      allDecisions.push(...cantonalResult.decisions);
    }

    // Sort all decisions by date (most recent first)
    allDecisions.sort((a, b) =>
      new Date(b.decisionDate).getTime() - new Date(a.decisionDate).getTime()
    );

    // Calculate facets
    const facets = {
      byCourtLevel: {
        federal: allDecisions.filter(d => "bgeReference" in d).length,
        cantonal: allDecisions.filter(d => "canton" in d).length,
      },
      byCanton: allDecisions
        .filter((d): d is CantonalDecision => "canton" in d)
        .reduce((acc, d) => {
          acc[d.canton] = (acc[d.canton] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
    };

    // Cache the results (TTL: 1 hour)
    const result = {
      decisions: allDecisions.slice(0, params.limit || 10),
      totalResults: allDecisions.length,
      facets,
    };
    await cacheRepo.set(cacheKey, JSON.stringify(result), 3600);

    return {
      ...result,
      searchTimeMs: Date.now() - startTime,
      fromCache: false,
    };
  } catch (error) {
    logger.error("Unified search failed", error as Error, { params });
    throw error;
  }
}

/**
 * Search specific canton(s) with parallel aggregation
 */
async function searchCanton(params: CantonSearchParams): Promise<{
  decisions: CantonalDecision[];
  totalResults: number;
  searchTimeMs: number;
  fromCache: boolean;
  byCanton: Record<Canton, number>;
}> {
  const startTime = Date.now();

  try {
    // Create cache key from search parameters
    const cacheKey = `canton_search:${JSON.stringify(params)}`;

    // Check cache first
    const cached = await cacheRepo.get(cacheKey);
    if (cached) {
      logger.info("Cache hit for canton search", { cacheKey });
      const cachedResult = JSON.parse(cached);
      return {
        ...cachedResult,
        searchTimeMs: Date.now() - startTime,
        fromCache: true,
      };
    }

    logger.info("Cache miss - fetching from cantonal APIs", { cacheKey });

    const filters: CantonalSearchFilters = {
      query: params.query,
      language: params.language as "de" | "fr" | "it" | undefined,
      legalArea: params.legalAreas?.[0],
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      limit: params.limit || 10,
    };

    // Filter clients to only requested cantons
    const clientsToUse = Object.fromEntries(
      params.cantons.map(canton => [canton, cantonalClients[canton]])
    );

    // Search across cantons in parallel
    const cantonalResult = await CantonalClientFactory.searchAcrossCantons(
      clientsToUse as Record<Canton, CantonalClient>,
      filters
    );

    // Store cantonal decisions in database
    if (cantonalResult.decisions.length > 0) {
      await Promise.all(
        cantonalResult.decisions.map(async (decision: CantonalDecision) => {
          await decisionRepo.upsert({
            decisionId: decision.decisionId,
            courtLevel: "cantonal" as const,
            canton: decision.canton,
            title: decision.title,
            summary: decision.summary,
            decisionDate: new Date(decision.decisionDate),
            language: decision.language,
            legalAreas: decision.legalAreas,
            fullText: decision.fullText,
            relatedDecisions: decision.relatedDecisions,
            metadata: decision.metadata,
            sourceUrl: decision.sourceUrl,
            lastFetchedAt: new Date(),
          });
        })
      );
      logger.info("Stored cantonal decisions in database", {
        count: cantonalResult.decisions.length,
        byCanton: cantonalResult.byCanton,
      });
    }

    // Cache the results (TTL: 1 hour)
    const result = {
      decisions: cantonalResult.decisions,
      totalResults: cantonalResult.total,
      byCanton: cantonalResult.byCanton,
    };
    await cacheRepo.set(cacheKey, JSON.stringify(result), 3600);

    return {
      ...result,
      searchTimeMs: Date.now() - startTime,
      fromCache: false,
    };
  } catch (error) {
    logger.error("Canton search failed", error as Error, { params });
    throw error;
  }
}

/**
 * Get related decisions via citation graph
 */
async function getRelatedDecisions(decisionId: string, limit: number = 5): Promise<{
  found: boolean;
  relatedDecisions: Array<BundesgerichtDecision | CantonalDecision>;
  fromCache: boolean;
}> {
  try {
    // Create cache key
    const cacheKey = `related:${decisionId}:${limit}`;

    // Check cache
    const cached = await cacheRepo.get(cacheKey);
    if (cached) {
      logger.info("Cache hit for related decisions", { decisionId });
      return {
        ...JSON.parse(cached),
        fromCache: true,
      };
    }

    logger.info("Cache miss - fetching related decisions", { decisionId });

    // Query database for decision and its relations
    const related = await decisionRepo.findRelated(decisionId, limit);

    if (related.length === 0) {
      return {
        found: false,
        relatedDecisions: [],
        fromCache: false,
      };
    }

    // Convert Decision entities to API format (Date → string)
    const relatedDecisions = related.map(d => ({
      ...d,
      decisionDate: d.decisionDate.toISOString().split('T')[0],
    })) as Array<BundesgerichtDecision | CantonalDecision>;

    // Cache the results (TTL: 24 hours)
    const result = {
      found: true,
      relatedDecisions,
    };
    await cacheRepo.set(cacheKey, JSON.stringify(result), 86400);

    return {
      ...result,
      fromCache: false,
    };
  } catch (error) {
    logger.error("Get related decisions failed", error as Error, { decisionId });
    throw error;
  }
}

/**
 * Get decision details by ID
 */
async function getDecisionDetails(decisionId: string): Promise<{
  found: boolean;
  decision?: BundesgerichtDecision | CantonalDecision;
  fromCache: boolean;
}> {
  try {
    // Create cache key
    const cacheKey = `decision:${decisionId}`;

    // Check cache
    const cached = await cacheRepo.get(cacheKey);
    if (cached) {
      logger.info("Cache hit for decision details", { decisionId });
      return {
        ...JSON.parse(cached),
        fromCache: true,
      };
    }

    logger.info("Cache miss - fetching decision details", { decisionId });

    // Query database
    const decision = await decisionRepo.findById(decisionId);

    if (!decision) {
      return {
        found: false,
        fromCache: false,
      };
    }

    // Convert Decision entity to API format (Date → string)
    const apiDecision = {
      ...decision,
      decisionDate: decision.decisionDate.toISOString().split('T')[0],
    } as BundesgerichtDecision | CantonalDecision;

    // Cache the results (TTL: 24 hours)
    const result = {
      found: true,
      decision: apiDecision,
    };
    await cacheRepo.set(cacheKey, JSON.stringify(result), 86400);

    return {
      ...result,
      fromCache: false,
    };
  } catch (error) {
    logger.error("Get decision details failed", error as Error, { decisionId });
    throw error;
  }
}

/**
 * Main server setup
 */
async function main() {
  // Initialize infrastructure
  await initializeInfrastructure();

  const server = new Server(
    {
      name: "entscheidsuche",
      version: "2.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search_decisions",
          description:
            "Unified search across Swiss federal (Bundesgericht) and cantonal court decisions. Uses real APIs with database caching. Supports multi-canton parallel search.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "Search query for court decisions (searches title, summary, full text)",
              },
              courtLevel: {
                type: "string",
                enum: ["federal", "cantonal", "all"],
                description: "Filter by court level (default: all)",
              },
              cantons: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["ZH", "BE", "GE", "BS", "VD", "TI"],
                },
                description:
                  "Filter by specific cantons (ZH=Zürich, BE=Bern, GE=Geneva, BS=Basel, VD=Vaud, TI=Ticino)",
              },
              language: {
                type: "string",
                enum: ["de", "fr", "it"],
                description: "Language filter (de=German, fr=French, it=Italian)",
              },
              dateFrom: {
                type: "string",
                format: "date",
                description: "Start date filter (ISO 8601 format: YYYY-MM-DD)",
              },
              dateTo: {
                type: "string",
                format: "date",
                description: "End date filter (ISO 8601 format: YYYY-MM-DD)",
              },
              legalAreas: {
                type: "array",
                items: { type: "string" },
                description:
                  "Filter by legal areas (e.g., 'Sozialversicherungsrecht', 'Arbeitsrecht')",
              },
              limit: {
                type: "number",
                minimum: 1,
                maximum: 100,
                default: 10,
                description: "Maximum number of results to return",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "search_canton",
          description:
            "Search specific canton(s) with parallel aggregation. Optimized for cantonal-only searches across multiple cantons.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query for cantonal decisions",
              },
              cantons: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["ZH", "BE", "GE", "BS", "VD", "TI"],
                },
                description: "Cantons to search (required)",
              },
              language: {
                type: "string",
                enum: ["de", "fr", "it"],
                description: "Language filter",
              },
              dateFrom: {
                type: "string",
                format: "date",
                description: "Start date filter (ISO 8601 format: YYYY-MM-DD)",
              },
              dateTo: {
                type: "string",
                format: "date",
                description: "End date filter (ISO 8601 format: YYYY-MM-DD)",
              },
              legalAreas: {
                type: "array",
                items: { type: "string" },
                description: "Filter by legal areas",
              },
              limit: {
                type: "number",
                minimum: 1,
                maximum: 100,
                default: 10,
                description: "Maximum number of results per canton",
              },
            },
            required: ["query", "cantons"],
          },
        },
        {
          name: "get_related_decisions",
          description:
            "Find related court decisions via citation graph analysis. Uses database citation relationships.",
          inputSchema: {
            type: "object",
            properties: {
              decisionId: {
                type: "string",
                description: "Decision ID to find related decisions for",
              },
              limit: {
                type: "number",
                minimum: 1,
                maximum: 20,
                default: 5,
                description: "Maximum number of related decisions to return",
              },
            },
            required: ["decisionId"],
          },
        },
        {
          name: "get_decision_details",
          description:
            "Retrieve full details of a specific court decision by ID. Uses cache-first strategy with 24-hour TTL.",
          inputSchema: {
            type: "object",
            properties: {
              decisionId: {
                type: "string",
                description: "Unique decision identifier",
              },
            },
            required: ["decisionId"],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === "search_decisions") {
        const searchParams = args as unknown as SearchParams;
        const result = await searchDecisions(searchParams);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      if (name === "search_canton") {
        const cantonParams = args as unknown as CantonSearchParams;
        const result = await searchCanton(cantonParams);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      if (name === "get_related_decisions") {
        const { decisionId, limit } = args as unknown as {
          decisionId: string;
          limit?: number;
        };
        const result = await getRelatedDecisions(decisionId, limit);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      if (name === "get_decision_details") {
        const { decisionId } = args as unknown as { decisionId: string };
        const result = await getDecisionDetails(decisionId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Tool execution failed", error as Error, { toolName: name });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: errorMessage }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info("Entscheidsuche MCP server running on stdio");
  console.error("Entscheidsuche MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
