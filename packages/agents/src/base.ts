/**
 * BetterCallClaude Agent Base Class (TypeScript)
 *
 * This module provides the foundational classes for building legal intelligence agents.
 * All agents inherit from AgentBase and implement the execute() method.
 *
 * Architecture:
 * - AgentBase: Core functionality (checkpoints, audit, sub-agent invocation)
 * - AutonomyMode: Enum for cautious/balanced/autonomous modes
 * - CaseContext: Shared context across agent executions
 * - AgentResult: Standardized result format
 */

import { v4 as uuidv4 } from "uuid";

// =============================================================================
// Enums and Types
// =============================================================================

/**
 * Autonomy levels controlling agent interaction with user.
 */
export enum AutonomyMode {
  /** Confirms before each significant action */
  CAUTIOUS = "cautious",
  /** Confirms at key checkpoints only (default) */
  BALANCED = "balanced",
  /** Runs to completion with minimal interruption */
  AUTONOMOUS = "autonomous",
}

/**
 * Result status of agent execution.
 */
export enum AgentOutcome {
  SUCCESS = "success",
  PARTIAL = "partial",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

/**
 * Types of actions an agent can perform.
 */
export enum ActionType {
  SEARCH = "search",
  ANALYZE = "analyze",
  GENERATE = "generate",
  INVOKE_AGENT = "invoke_agent",
  CHECKPOINT = "checkpoint",
  USER_CONFIRM = "user_confirm",
}

// =============================================================================
// Interfaces
// =============================================================================

/**
 * Represents a party in a legal case.
 */
export interface Party {
  name: string;
  role: string; // e.g., "client", "plaintiff", "defendant"
  contact?: string;
  metadata: Record<string, unknown>;
}

/**
 * Jurisdiction configuration for a case.
 */
export interface Jurisdiction {
  federal: boolean;
  cantons: string[];
  languages: ("DE" | "FR" | "IT" | "EN")[];
}

/**
 * Shared context for a legal case, inherited by all agents.
 */
export interface CaseContext {
  caseId: string;
  title: string;
  caseType: "litigation" | "corporate" | "contract" | "regulatory" | "other";
  jurisdiction: Jurisdiction;
  parties: Party[];
  facts: string[];
  legalIssues: string[];
  agentHistory: string[];
  findings: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Records a single action taken by an agent.
 */
export interface AgentAction {
  actionId: string;
  timestamp: Date;
  actionType: ActionType;
  description: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  durationMs: number;
  subAgentId?: string;
}

/**
 * Snapshot of agent state for recovery.
 */
export interface Checkpoint {
  checkpointId: string;
  timestamp: Date;
  checkpointType: "auto" | "user" | "pre_external" | "pre_subagent";
  state: Record<string, unknown>;
  description: string;
}

/**
 * Complete audit trail for an agent execution.
 */
export interface AgentAuditLog {
  logId: string;
  timestamp: Date;
  caseId: string;
  userId: string;
  firmId: string;
  agentId: string;
  agentVersion: string;
  autonomyMode: AutonomyMode;
  actions: AgentAction[];
  sourcesAccessed: string[];
  documentsRead: string[];
  documentsWritten: string[];
  outcome: AgentOutcome;
  deliverables: string[];
  errors: ErrorRecord[];
  checkpoints: Checkpoint[];
}

/**
 * Error record for audit logging.
 */
export interface ErrorRecord {
  type: string;
  message: string;
  timestamp: string;
  recoverable: boolean;
}

/**
 * Standardized result format for agent execution.
 */
export interface AgentResult<T = unknown> {
  success: boolean;
  outcome: AgentOutcome;
  deliverable?: T;
  partialResults?: T;
  errorMessage?: string;
  auditLog: AgentAuditLog;
  executionTimeMs: number;
}

/**
 * Configuration options for agent instantiation.
 */
export interface AgentConfig {
  autonomyMode?: AutonomyMode;
  caseContext?: CaseContext;
  userId?: string;
  firmId?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a new AgentAction with auto-generated ID and timestamp.
 */
function createAction(
  actionType: ActionType,
  description: string,
  inputs: Record<string, unknown>,
  outputs: Record<string, unknown>,
  durationMs: number,
  subAgentId?: string
): AgentAction {
  return {
    actionId: uuidv4(),
    timestamp: new Date(),
    actionType,
    description,
    inputs,
    outputs,
    durationMs,
    subAgentId,
  };
}

/**
 * Create a new Checkpoint.
 */
function createCheckpoint(
  checkpointType: Checkpoint["checkpointType"],
  state: Record<string, unknown>,
  description: string
): Checkpoint {
  return {
    checkpointId: uuidv4(),
    timestamp: new Date(),
    checkpointType,
    state,
    description,
  };
}

// =============================================================================
// Agent Base Class
// =============================================================================

/**
 * Abstract base class for all BetterCallClaude agents.
 *
 * Provides core functionality:
 * - Autonomy mode management
 * - Checkpoint creation and recovery
 * - Audit logging
 * - Sub-agent invocation
 * - Case context handling
 *
 * Subclasses must implement:
 * - execute(): Main agent logic
 * - agentId: Unique identifier
 * - agentVersion: Version string
 */
export abstract class AgentBase {
  protected autonomyMode: AutonomyMode;
  protected caseContext?: CaseContext;
  protected userId: string;
  protected firmId: string;

  // Execution state
  private actions: AgentAction[] = [];
  private checkpoints: Checkpoint[] = [];
  private sourcesAccessed: string[] = [];
  private documentsRead: string[] = [];
  private documentsWritten: string[] = [];
  private errors: ErrorRecord[] = [];
  protected startTime?: Date;
  private currentState: Record<string, unknown> = {};

  constructor(config: AgentConfig = {}) {
    this.autonomyMode = config.autonomyMode ?? AutonomyMode.BALANCED;
    this.caseContext = config.caseContext;
    this.userId = config.userId ?? "anonymous";
    this.firmId = config.firmId ?? "default";
  }

  /**
   * Unique identifier for this agent type (e.g., 'researcher').
   */
  abstract get agentId(): string;

  /**
   * Version string for this agent (e.g., '1.0.0').
   */
  abstract get agentVersion(): string;

  /**
   * Execute the agent's main task.
   *
   * @param task - Description of the task to perform
   * @param options - Additional task-specific parameters
   * @returns AgentResult with deliverable and audit information
   */
  abstract execute(
    task: string,
    options?: Record<string, unknown>
  ): Promise<AgentResult>;

  // ---------------------------------------------------------------------------
  // Checkpoint Management
  // ---------------------------------------------------------------------------

  /**
   * Create a checkpoint of current state.
   *
   * @param checkpointType - One of 'auto', 'user', 'pre_external', 'pre_subagent'
   * @param description - Human-readable description of the checkpoint
   * @returns The created Checkpoint object
   */
  protected createCheckpoint(
    checkpointType: Checkpoint["checkpointType"] = "auto",
    description = ""
  ): Checkpoint {
    const checkpoint = createCheckpoint(
      checkpointType,
      { ...this.currentState },
      description || `Checkpoint at ${new Date().toISOString()}`
    );
    this.checkpoints.push(checkpoint);

    // Log checkpoint action
    this.recordAction(
      ActionType.CHECKPOINT,
      `Created ${checkpointType} checkpoint`,
      {},
      { checkpointId: checkpoint.checkpointId },
      0
    );

    console.log(`Checkpoint created: ${checkpoint.checkpointId}`);
    return checkpoint;
  }

  /**
   * Restore state from a checkpoint.
   *
   * @param checkpointId - ID of the checkpoint to restore
   * @returns True if restoration successful, False otherwise
   */
  protected restoreCheckpoint(checkpointId: string): boolean {
    for (let i = this.checkpoints.length - 1; i >= 0; i--) {
      const cp = this.checkpoints[i];
      if (cp.checkpointId === checkpointId) {
        this.currentState = { ...cp.state };
        console.log(`Restored checkpoint: ${checkpointId}`);
        return true;
      }
    }

    console.warn(`Checkpoint not found: ${checkpointId}`);
    return false;
  }

  /**
   * Get the most recent checkpoint.
   */
  protected getLatestCheckpoint(): Checkpoint | undefined {
    return this.checkpoints[this.checkpoints.length - 1];
  }

  // ---------------------------------------------------------------------------
  // Action Recording
  // ---------------------------------------------------------------------------

  /**
   * Record an action in the audit log.
   */
  protected recordAction(
    actionType: ActionType,
    description: string,
    inputs: Record<string, unknown>,
    outputs: Record<string, unknown>,
    durationMs: number,
    subAgentId?: string
  ): AgentAction {
    const action = createAction(
      actionType,
      description,
      this.sanitizeInputs(inputs),
      this.summarizeOutputs(outputs),
      durationMs,
      subAgentId
    );
    this.actions.push(action);
    return action;
  }

  /**
   * Sanitize inputs for audit logging.
   * Removes sensitive data and truncates large values.
   */
  private sanitizeInputs(
    inputs: Record<string, unknown>
  ): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const sensitiveKeys = ["password", "token", "secret", "key", "credential"];

    for (const [key, value] of Object.entries(inputs)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "string" && value.length > 1000) {
        sanitized[key] = value.substring(0, 1000) + "...[truncated]";
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Summarize outputs for audit logging.
   * Creates compact representation of large outputs.
   */
  private summarizeOutputs(
    outputs: Record<string, unknown>
  ): Record<string, unknown> {
    const summarized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(outputs)) {
      if (Array.isArray(value)) {
        summarized[key] = `[List with ${value.length} items]`;
      } else if (typeof value === "object" && value !== null) {
        summarized[key] = `[Object with ${Object.keys(value).length} keys]`;
      } else if (typeof value === "string" && value.length > 500) {
        summarized[key] = value.substring(0, 500) + "...[truncated]";
      } else {
        summarized[key] = value;
      }
    }

    return summarized;
  }

  // ---------------------------------------------------------------------------
  // Sub-Agent Invocation
  // ---------------------------------------------------------------------------

  /**
   * Invoke a sub-agent with context inheritance.
   *
   * @param AgentClass - The agent class to instantiate
   * @param task - Task description for the sub-agent
   * @param autonomyOverride - Optional autonomy mode override
   * @param options - Additional parameters for the sub-agent
   * @returns AgentResult from the sub-agent
   */
  protected async invokeSubAgent<T extends AgentBase>(
    AgentClass: new (config: AgentConfig) => T,
    task: string,
    autonomyOverride?: AutonomyMode,
    options?: Record<string, unknown>
  ): Promise<AgentResult> {
    // Create checkpoint before sub-agent invocation
    this.createCheckpoint(
      "pre_subagent",
      `Before invoking ${AgentClass.name}`
    );

    // Inherit autonomy mode unless overridden
    const subAutonomy = autonomyOverride ?? this.autonomyMode;

    // Instantiate sub-agent with inherited context
    const subAgent = new AgentClass({
      autonomyMode: subAutonomy,
      caseContext: this.caseContext,
      userId: this.userId,
      firmId: this.firmId,
    });

    const start = Date.now();
    const result = await subAgent.execute(task, options);
    const durationMs = Date.now() - start;

    // Record the sub-agent invocation
    this.recordAction(
      ActionType.INVOKE_AGENT,
      `Invoked ${subAgent.agentId}`,
      { task, ...options },
      { outcome: result.outcome },
      durationMs,
      subAgent.agentId
    );

    return result;
  }

  // ---------------------------------------------------------------------------
  // User Interaction
  // ---------------------------------------------------------------------------

  /**
   * Request confirmation from user based on autonomy mode.
   *
   * In CAUTIOUS mode: Always requests
   * In BALANCED mode: Requests at checkpoints
   * In AUTONOMOUS mode: Skips (returns default)
   *
   * @param message - Message to show user
   * @param options - List of valid options (default: ["yes", "no"])
   * @returns User's response or "yes" in autonomous mode
   */
  protected async requestUserConfirmation(
    message: string,
    options: string[] = ["yes", "no"]
  ): Promise<string> {
    if (this.autonomyMode === AutonomyMode.AUTONOMOUS) {
      return "yes";
    }

    // In real implementation, this would interact with the user
    console.log(`User confirmation requested: ${message}`);

    this.recordAction(
      ActionType.USER_CONFIRM,
      `Requested user confirmation: ${message}`,
      { message, options },
      { response: "yes" },
      0
    );

    return "yes";
  }

  // ---------------------------------------------------------------------------
  // Audit Log Generation
  // ---------------------------------------------------------------------------

  /**
   * Generate complete audit log for the execution.
   */
  protected createAuditLog(
    outcome: AgentOutcome,
    deliverables: string[]
  ): AgentAuditLog {
    return {
      logId: uuidv4(),
      timestamp: this.startTime ?? new Date(),
      caseId: this.caseContext?.caseId ?? "no_case",
      userId: this.userId,
      firmId: this.firmId,
      agentId: this.agentId,
      agentVersion: this.agentVersion,
      autonomyMode: this.autonomyMode,
      actions: this.actions,
      sourcesAccessed: this.sourcesAccessed,
      documentsRead: this.documentsRead,
      documentsWritten: this.documentsWritten,
      outcome,
      deliverables,
      errors: this.errors,
      checkpoints: this.checkpoints,
    };
  }

  // ---------------------------------------------------------------------------
  // Error Handling
  // ---------------------------------------------------------------------------

  /**
   * Handle an error during execution.
   *
   * @param error - The error that occurred
   * @param recoverable - Whether execution can continue
   */
  protected handleError(error: Error, recoverable = true): void {
    const errorRecord: ErrorRecord = {
      type: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
      recoverable,
    };
    this.errors.push(errorRecord);
    console.error(`Agent error: ${error.message}`, error);

    if (recoverable) {
      // Escalate to cautious mode
      this.autonomyMode = AutonomyMode.CAUTIOUS;
      console.log("Escalated to cautious mode after error");
    }
  }

  /**
   * Create a partial result package when execution fails midway.
   */
  protected createPartialResult<T>(partialData: T): Record<string, unknown> {
    const latestCheckpoint = this.getLatestCheckpoint();
    return {
      partialData,
      checkpointId: latestCheckpoint?.checkpointId,
      actionsCompleted: this.actions.length,
      recoveredAt: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // Utility Methods
  // ---------------------------------------------------------------------------

  /**
   * Record access to an external source (for audit).
   */
  protected recordSourceAccess(source: string): void {
    this.sourcesAccessed.push(source);
  }

  /**
   * Record reading a document (for audit).
   */
  protected recordDocumentRead(document: string): void {
    this.documentsRead.push(document);
  }

  /**
   * Record writing a document (for audit).
   */
  protected recordDocumentWrite(document: string): void {
    this.documentsWritten.push(document);
  }

  /**
   * Update internal state (included in checkpoints).
   */
  protected updateState(key: string, value: unknown): void {
    this.currentState[key] = value;
  }

  /**
   * Get value from internal state.
   */
  protected getState<T = unknown>(key: string, defaultValue?: T): T {
    return (this.currentState[key] as T) ?? (defaultValue as T);
  }

  /**
   * Mark execution start time.
   */
  protected markStart(): void {
    this.startTime = new Date();
  }

  /**
   * Reset execution state for new run.
   */
  protected resetState(): void {
    this.actions = [];
    this.checkpoints = [];
    this.sourcesAccessed = [];
    this.documentsRead = [];
    this.documentsWritten = [];
    this.errors = [];
    this.startTime = undefined;
    this.currentState = {};
  }
}

// =============================================================================
// Exports
// =============================================================================

export {
  createAction,
  createCheckpoint,
};
