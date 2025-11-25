/**
 * BetterCallClaude Agent Integration Module
 *
 * Provides a unified API for integrating CaseManager with agents
 * and MCP adapters for streamlined legal research workflows.
 */

import {
  CaseManager,
  ManagedCaseContext,
  CreateCaseOptions,
  CaseStorage,
  JSONFileCaseStorage,
} from "./case-manager";
import {
  ResearcherAgent,
  ResearchMemo,
  ResearchOptions,
} from "./researcher";
import { MCPAdapter, MCPAdapterConfig } from "./mcp-adapter";
import { AgentConfig, AgentResult, AutonomyMode, CaseContext } from "./base";

// =============================================================================
// Types
// =============================================================================

/**
 * Configuration for the integrated research system
 */
export interface IntegrationConfig {
  /** Case storage implementation (defaults to JSONFileCaseStorage) */
  caseStorage?: CaseStorage;
  /** MCP adapter configuration */
  mcpConfig?: MCPAdapterConfig;
  /** Default autonomy mode for agents */
  defaultAutonomyMode?: AutonomyMode;
  /** Default user ID */
  userId?: string;
  /** Default firm ID */
  firmId?: string;
}

/**
 * Options for case-bound research
 */
export interface CaseBoundResearchOptions extends ResearchOptions {
  /** Record agent execution in case history */
  recordExecution?: boolean;
  /** Add findings to case record */
  addFindings?: boolean;
  /** Custom autonomy mode for this research */
  autonomyMode?: AutonomyMode;
}

/**
 * Result of case-bound research
 */
export interface CaseBoundResearchResult {
  /** The research result */
  result: AgentResult<ResearchMemo>;
  /** The case context after research */
  caseContext: ManagedCaseContext;
  /** Whether execution was recorded */
  executionRecorded: boolean;
  /** Whether findings were added */
  findingsAdded: boolean;
}

// =============================================================================
// IntegratedResearchSystem
// =============================================================================

/**
 * Integrated research system that combines CaseManager, ResearcherAgent,
 * and MCP adapters into a unified workflow.
 *
 * @example
 * ```typescript
 * // Create integrated system
 * const system = new IntegratedResearchSystem({
 *   mcpConfig: {
 *     entscheidsuchePath: './mcp-servers/entscheidsuche/dist/index.js',
 *     legalCitationsPath: './mcp-servers/legal-citations/dist/index.js',
 *   },
 * });
 *
 * // Initialize (connects to MCP servers)
 * await system.initialize();
 *
 * // Create a new case
 * const caseContext = await system.createCase({
 *   title: "Contract Dispute - ABC Corp",
 *   caseType: "contract",
 *   cantons: ["ZH"],
 *   languages: ["DE", "EN"],
 * });
 *
 * // Run research bound to the case
 * const result = await system.researchWithCase(
 *   "BGE precedents on contractual liability under Art. 97 OR",
 *   caseContext.caseId,
 *   { depth: "deep", addFindings: true }
 * );
 *
 * // Shutdown
 * await system.shutdown();
 * ```
 */
export class IntegratedResearchSystem {
  private config: IntegrationConfig;
  private caseManager: CaseManager;
  private mcpAdapter: MCPAdapter;
  private initialized = false;

  constructor(config: IntegrationConfig = {}) {
    this.config = {
      defaultAutonomyMode: AutonomyMode.BALANCED,
      userId: "system",
      firmId: "default",
      ...config,
    };

    // Use provided storage or default JSONFileCaseStorage
    const storage = this.config.caseStorage ?? new JSONFileCaseStorage();
    this.caseManager = new CaseManager(storage);
    this.mcpAdapter = new MCPAdapter(this.config.mcpConfig);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Initialize the system by connecting to MCP servers.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.mcpAdapter.connect();
      this.initialized = true;
      console.log("IntegratedResearchSystem initialized successfully");
    } catch (error) {
      console.error("Failed to initialize IntegratedResearchSystem:", error);
      throw error;
    }
  }

  /**
   * Shutdown the system by disconnecting from MCP servers.
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.mcpAdapter.disconnect();
      this.initialized = false;
      console.log("IntegratedResearchSystem shutdown successfully");
    } catch (error) {
      console.error("Error during shutdown:", error);
      throw error;
    }
  }

  /**
   * Check if the system is initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  // ---------------------------------------------------------------------------
  // Case Management
  // ---------------------------------------------------------------------------

  /**
   * Create a new case.
   */
  async createCase(options: CreateCaseOptions): Promise<ManagedCaseContext> {
    return this.caseManager.createCase(options);
  }

  /**
   * Open an existing case.
   * @throws Error if case not found
   */
  async openCase(caseId: string): Promise<ManagedCaseContext> {
    const caseContext = await this.caseManager.openCase(caseId);
    if (!caseContext) {
      throw new Error(`Case not found: ${caseId}`);
    }
    return caseContext;
  }

  /**
   * Get the currently open case.
   */
  get currentCase(): ManagedCaseContext | null {
    return this.caseManager.currentCase;
  }

  /**
   * Convert managed case context to agent-compatible context.
   */
  toAgentContext(managed: ManagedCaseContext): CaseContext {
    return this.caseManager.toAgentContext(managed);
  }

  // ---------------------------------------------------------------------------
  // Research Operations
  // ---------------------------------------------------------------------------

  /**
   * Run research without case binding.
   * Useful for standalone research queries.
   */
  async research(
    task: string,
    options: ResearchOptions = {}
  ): Promise<AgentResult<ResearchMemo>> {
    this.ensureInitialized();

    const agent = new ResearcherAgent({
      autonomyMode: this.config.defaultAutonomyMode,
      userId: this.config.userId,
      firmId: this.config.firmId,
      mcpClient: this.mcpAdapter,
    });

    return agent.execute(task, options);
  }

  /**
   * Run research bound to a specific case.
   * Optionally records execution and adds findings to the case.
   */
  async researchWithCase(
    task: string,
    caseId: string,
    options: CaseBoundResearchOptions = {}
  ): Promise<CaseBoundResearchResult> {
    this.ensureInitialized();

    // Open the case
    const caseContext = await this.openCase(caseId);
    const agentContext = this.toAgentContext(caseContext);

    // Execute research
    const agent = new ResearcherAgent({
      autonomyMode: options.autonomyMode ?? this.config.defaultAutonomyMode,
      caseContext: agentContext,
      userId: this.config.userId,
      firmId: this.config.firmId,
      mcpClient: this.mcpAdapter,
    });

    const result = await agent.execute(task, options);

    let executionRecorded = false;
    let findingsAdded = false;

    // Record execution if requested
    if (options.recordExecution !== false) {
      await this.caseManager.recordAgentExecution(caseId, {
        agentId: agent.agentId,
        task,
        outcome: result.outcome,
        summary: result.success
          ? `Completed research: ${task}`
          : `Failed research: ${result.errorMessage ?? "Unknown error"}`,
        durationMs: result.executionTimeMs,
        deliverables: result.success ? ["research_memo"] : [],
      });
      executionRecorded = true;
    }

    // Add findings if requested and research succeeded
    if (options.addFindings !== false && result.success && result.deliverable) {
      const memo = result.deliverable;
      for (const finding of memo.findings) {
        await this.caseManager.addFinding(caseId, {
          content: finding.conclusion,
          source: `ResearcherAgent: ${task}`,
          category: finding.issue,
          confidence: finding.confidence,
          citations: finding.supportingCitations,
          agentId: agent.agentId,
        });
      }
      findingsAdded = true;
    }

    // Get updated case context
    const updatedContext = await this.openCase(caseId);

    return {
      result,
      caseContext: updatedContext,
      executionRecorded,
      findingsAdded,
    };
  }

  /**
   * Run research on the currently open case.
   */
  async researchCurrentCase(
    task: string,
    options: CaseBoundResearchOptions = {}
  ): Promise<CaseBoundResearchResult> {
    const current = this.currentCase;
    if (!current) {
      throw new Error("No case is currently open");
    }
    return this.researchWithCase(task, current.caseId, options);
  }

  // ---------------------------------------------------------------------------
  // Utility Methods
  // ---------------------------------------------------------------------------

  /**
   * Get the MCP adapter for direct access if needed.
   */
  getMCPAdapter(): MCPAdapter {
    return this.mcpAdapter;
  }

  /**
   * Get the case manager for direct access if needed.
   */
  getCaseManager(): CaseManager {
    return this.caseManager;
  }

  /**
   * Create a standalone ResearcherAgent with the system's MCP adapter.
   */
  createResearcherAgent(config?: Partial<AgentConfig>): ResearcherAgent {
    this.ensureInitialized();

    return new ResearcherAgent({
      autonomyMode: config?.autonomyMode ?? this.config.defaultAutonomyMode,
      caseContext: config?.caseContext,
      userId: config?.userId ?? this.config.userId,
      firmId: config?.firmId ?? this.config.firmId,
      mcpClient: this.mcpAdapter,
    });
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        "IntegratedResearchSystem not initialized. Call initialize() first."
      );
    }
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create and initialize an integrated research system.
 */
export async function createIntegratedSystem(
  config?: IntegrationConfig
): Promise<IntegratedResearchSystem> {
  const system = new IntegratedResearchSystem(config);
  await system.initialize();
  return system;
}

/**
 * Quick research function for standalone queries.
 * Creates a temporary system, runs research, and shuts down.
 */
export async function quickResearch(
  task: string,
  options: ResearchOptions & { mcpConfig?: MCPAdapterConfig } = {}
): Promise<AgentResult<ResearchMemo>> {
  const { mcpConfig, ...researchOptions } = options;
  const system = await createIntegratedSystem({ mcpConfig });

  try {
    return await system.research(task, researchOptions);
  } finally {
    await system.shutdown();
  }
}

// =============================================================================
// Exports
// =============================================================================

export { AutonomyMode };
