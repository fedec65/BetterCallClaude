/**
 * MCP Adapter for Legal Research Agents
 *
 * Provides real MCP client implementation that connects to MCP servers
 * (entscheidsuche, legal-citations) over stdio transport.
 *
 * This adapter implements the MCPClient interface expected by ResearcherAgent
 * and routes calls to the appropriate MCP server.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { MCPClient } from "./researcher";

// =============================================================================
// Types
// =============================================================================

/**
 * Configuration for an MCP server connection
 */
export interface MCPServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/**
 * Configuration for the MCP adapter
 */
export interface MCPAdapterConfig {
  /** Path to entscheidsuche MCP server */
  entscheidsuchePath?: string;
  /** Path to legal-citations MCP server */
  legalCitationsPath?: string;
  /** Additional environment variables */
  env?: Record<string, string>;
  /** Connection timeout in milliseconds */
  timeout?: number;
}

/**
 * Server connection state
 */
interface ServerConnection {
  client: Client;
  transport: StdioClientTransport;
  connected: boolean;
}

// =============================================================================
// Server Name Mappings
// =============================================================================

/**
 * Maps researcher server names to actual MCP servers
 */
const SERVER_MAPPINGS: Record<string, string> = {
  "bge-search": "entscheidsuche",
  "cantonal-courts": "entscheidsuche",
  entscheidsuche: "entscheidsuche",
  "legal-citations": "legal-citations",
};

/**
 * Maps method names to MCP tool names
 */
const METHOD_TO_TOOL: Record<string, Record<string, string>> = {
  entscheidsuche: {
    search: "search_decisions",
    get_decision: "get_decision_details",
    get_related: "get_related_decisions",
  },
  "legal-citations": {
    verify: "validate_citation",
    format: "format_citation",
    parse: "parse_citation",
    convert: "convert_citation",
  },
};

// =============================================================================
// MCP Adapter Implementation
// =============================================================================

/**
 * Real MCP client adapter that connects to actual MCP servers.
 *
 * Implements the MCPClient interface expected by ResearcherAgent and
 * manages connections to entscheidsuche and legal-citations MCP servers.
 *
 * @example
 * ```typescript
 * const adapter = new MCPAdapter({
 *   entscheidsuchePath: './mcp-servers/entscheidsuche/dist/index.js',
 *   legalCitationsPath: './mcp-servers/legal-citations/dist/index.js',
 * });
 *
 * await adapter.connect();
 *
 * const result = await adapter.call('entscheidsuche', 'search', {
 *   query: 'Werkvertrag Mängel',
 *   limit: 10,
 * });
 *
 * await adapter.disconnect();
 * ```
 */
export class MCPAdapter implements MCPClient {
  private config: MCPAdapterConfig;
  private connections: Map<string, ServerConnection> = new Map();
  private serverConfigs: Map<string, MCPServerConfig> = new Map();

  constructor(config: MCPAdapterConfig = {}) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    this.initializeServerConfigs();
  }

  /**
   * Initialize server configurations based on provided paths
   */
  private initializeServerConfigs(): void {
    // Default paths (relative to project root)
    const defaultEntscheidsuchePath =
      this.config.entscheidsuchePath ||
      "mcp-servers/entscheidsuche/dist/index.js";
    const defaultLegalCitationsPath =
      this.config.legalCitationsPath ||
      "mcp-servers/legal-citations/dist/index.js";

    this.serverConfigs.set("entscheidsuche", {
      name: "entscheidsuche",
      command: "node",
      args: [defaultEntscheidsuchePath],
      env: this.config.env,
    });

    this.serverConfigs.set("legal-citations", {
      name: "legal-citations",
      command: "node",
      args: [defaultLegalCitationsPath],
      env: this.config.env,
    });
  }

  /**
   * Connect to all configured MCP servers
   */
  async connect(): Promise<void> {
    const connectPromises = Array.from(this.serverConfigs.values()).map(
      (config) => this.connectToServer(config)
    );

    await Promise.all(connectPromises);
  }

  /**
   * Connect to a specific MCP server
   */
  private async connectToServer(config: MCPServerConfig): Promise<void> {
    try {
      // Create client
      const client = new Client(
        {
          name: `bettercallclaude-${config.name}`,
          version: "1.0.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      // Create stdio transport - SDK handles spawning the process
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: config.env,
      });

      // Connect client to transport
      await client.connect(transport);

      // Store connection
      this.connections.set(config.name, {
        client,
        transport,
        connected: true,
      });

      console.log(`Connected to MCP server: ${config.name}`);
    } catch (error) {
      console.error(`Failed to connect to MCP server ${config.name}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from all MCP servers
   */
  async disconnect(): Promise<void> {
    const disconnectPromises = Array.from(this.connections.entries()).map(
      async ([name, conn]) => {
        try {
          await conn.transport.close();
          await conn.client.close();
          conn.connected = false;
          console.log(`Disconnected from MCP server: ${name}`);
        } catch (error) {
          console.error(`Error disconnecting from ${name}:`, error);
        }
      }
    );

    await Promise.all(disconnectPromises);
    this.connections.clear();
  }

  /**
   * Call an MCP server method.
   *
   * This is the main interface method that ResearcherAgent uses.
   * It translates server names and method names to actual MCP tool calls.
   *
   * @param server - Logical server name (e.g., 'bge-search', 'legal-citations')
   * @param method - Method name (e.g., 'search', 'verify')
   * @param params - Parameters for the method call
   * @returns Result from the MCP server
   */
  async call(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // Map server name to actual MCP server
    const actualServer = SERVER_MAPPINGS[server] || server;

    // Get connection
    const connection = this.connections.get(actualServer);
    if (!connection || !connection.connected) {
      throw new Error(`Not connected to MCP server: ${actualServer}`);
    }

    // Map method name to MCP tool name
    const toolMappings = METHOD_TO_TOOL[actualServer] || {};
    const toolName = toolMappings[method] || method;

    // Transform parameters based on server and method
    const transformedParams = this.transformParams(actualServer, method, params);

    try {
      // Call the MCP tool
      const result = await connection.client.callTool({
        name: toolName,
        arguments: transformedParams,
      });

      // Parse and return result
      return this.parseResult(result, actualServer, method);
    } catch (error) {
      console.error(
        `MCP call failed: ${actualServer}.${toolName}`,
        error
      );
      throw error;
    }
  }

  /**
   * Transform parameters for specific server/method combinations
   */
  private transformParams(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Record<string, unknown> {
    if (server === "entscheidsuche" && method === "search") {
      // Transform ResearcherAgent search params to entscheidsuche format
      const filters = params.filters as Record<string, unknown> | undefined;
      return {
        query: params.query,
        courtLevel: params.courtLevel || "all",
        language: params.language,
        dateFrom: filters?.date_from,
        dateTo: filters?.date_to,
        limit: params.limit || 10,
      };
    }

    if (server === "legal-citations" && method === "verify") {
      // Transform verify params to validate_citation format
      return {
        citation: params.citation,
      };
    }

    // Default: pass through
    return params;
  }

  /**
   * Parse MCP result to expected format
   */
  private parseResult(
    result: unknown,
    server: string,
    method: string
  ): Record<string, unknown> {
    // MCP results come wrapped in content array
    const mcpResult = result as { content?: Array<{ type: string; text: string }> };

    if (mcpResult.content && Array.isArray(mcpResult.content)) {
      const textContent = mcpResult.content.find((c) => c.type === "text");
      if (textContent?.text) {
        try {
          const parsed = JSON.parse(textContent.text);
          return this.transformResult(parsed, server, method);
        } catch {
          return { text: textContent.text };
        }
      }
    }

    return mcpResult as Record<string, unknown>;
  }

  /**
   * Transform result to expected ResearcherAgent format
   */
  private transformResult(
    result: Record<string, unknown>,
    server: string,
    method: string
  ): Record<string, unknown> {
    if (server === "entscheidsuche" && method === "search") {
      // Transform entscheidsuche results to ResearcherAgent format
      const decisions = result.decisions as Array<Record<string, unknown>> || [];
      return {
        results: decisions.map((d) => ({
          id: d.decisionId,
          title: d.title,
          citation: d.referenceNumber,
          date: d.date,
          court: d.courtName,
          summary: d.summary,
          relevance_score: 0.8, // Default score
          full_text_url: d.fullTextUrl,
          language: d.language,
        })),
        total: result.totalResults || decisions.length,
      };
    }

    if (server === "legal-citations" && method === "verify") {
      // Transform validation result to verify format
      return {
        verified: result.valid,
        formatted: result.normalized || result.formatted,
        is_current: true,
        court: result.court || "",
        issues: [
          ...(result.errors as string[] || []),
          ...(result.warnings as string[] || []),
        ],
      };
    }

    return result;
  }

  /**
   * Check if connected to a specific server
   */
  isConnected(server?: string): boolean {
    if (server) {
      const actualServer = SERVER_MAPPINGS[server] || server;
      const conn = this.connections.get(actualServer);
      return conn?.connected ?? false;
    }
    return Array.from(this.connections.values()).every((c) => c.connected);
  }

  /**
   * List available servers
   */
  getAvailableServers(): string[] {
    return Array.from(this.serverConfigs.keys());
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create an MCP adapter with default configuration
 */
export function createMCPAdapter(config?: MCPAdapterConfig): MCPAdapter {
  return new MCPAdapter(config);
}

/**
 * Create and connect an MCP adapter
 */
export async function createConnectedMCPAdapter(
  config?: MCPAdapterConfig
): Promise<MCPAdapter> {
  const adapter = new MCPAdapter(config);
  await adapter.connect();
  return adapter;
}

// =============================================================================
// Exports
// =============================================================================

export type { MCPClient };
