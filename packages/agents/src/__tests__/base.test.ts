/**
 * Unit Tests for Agent Base Classes
 *
 * Tests core agent functionality:
 * - Autonomy mode management
 * - Checkpoint creation and restoration
 * - Action recording and audit logging
 * - Sub-agent invocation
 * - Error handling
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  AgentBase,
  AgentConfig,
  AgentResult,
  AgentOutcome,
  AutonomyMode,
  ActionType,
  CaseContext,
  Checkpoint,
} from "../base.js";

// =============================================================================
// Test Implementation of AgentBase
// =============================================================================

/**
 * Concrete implementation for testing abstract AgentBase.
 */
class TestAgent extends AgentBase {
  get agentId(): string {
    return "test-agent";
  }

  get agentVersion(): string {
    return "1.0.0";
  }

  async execute(
    task: string,
    options?: Record<string, unknown>
  ): Promise<AgentResult> {
    this.markStart();
    this.resetState();

    // Simulate some work
    this.updateState("task", task);
    this.updateState("started", true);

    this.recordAction(
      ActionType.ANALYZE,
      `Analyzed task: ${task}`,
      { task },
      { result: "success" },
      100
    );

    this.createCheckpoint("auto", "After initial analysis");

    const auditLog = this.createAuditLog(AgentOutcome.SUCCESS, [
      "analysis_result",
    ]);

    return {
      success: true,
      outcome: AgentOutcome.SUCCESS,
      deliverable: { task, result: "completed" },
      auditLog,
      executionTimeMs: 100,
    };
  }

  // Expose protected methods for testing
  public testCreateCheckpoint(
    type: Checkpoint["checkpointType"],
    description: string
  ): Checkpoint {
    return this.createCheckpoint(type, description);
  }

  public testRestoreCheckpoint(checkpointId: string): boolean {
    return this.restoreCheckpoint(checkpointId);
  }

  public testGetLatestCheckpoint(): Checkpoint | undefined {
    return this.getLatestCheckpoint();
  }

  public testRecordAction(
    actionType: ActionType,
    description: string,
    inputs: Record<string, unknown>,
    outputs: Record<string, unknown>,
    durationMs: number
  ) {
    return this.recordAction(actionType, description, inputs, outputs, durationMs);
  }

  public testUpdateState(key: string, value: unknown): void {
    this.updateState(key, value);
  }

  public testGetState<T>(key: string, defaultValue?: T): T {
    return this.getState(key, defaultValue);
  }

  public testHandleError(error: Error, recoverable?: boolean): void {
    this.handleError(error, recoverable);
  }

  public testRecordSourceAccess(source: string): void {
    this.recordSourceAccess(source);
  }

  public testRecordDocumentRead(doc: string): void {
    this.recordDocumentRead(doc);
  }

  public testRecordDocumentWrite(doc: string): void {
    this.recordDocumentWrite(doc);
  }

  public testCreateAuditLog(outcome: AgentOutcome, deliverables: string[]) {
    return this.createAuditLog(outcome, deliverables);
  }

  public testRequestUserConfirmation(
    message: string,
    options?: string[]
  ): Promise<string> {
    return this.requestUserConfirmation(message, options);
  }

  public getAutonomyMode(): AutonomyMode {
    return this.autonomyMode;
  }

  public getCaseContext(): CaseContext | undefined {
    return this.caseContext;
  }
}

/**
 * Sub-agent for testing invocation.
 */
class SubTestAgent extends AgentBase {
  get agentId(): string {
    return "sub-test-agent";
  }

  get agentVersion(): string {
    return "1.0.0";
  }

  async execute(
    task: string,
    options?: Record<string, unknown>
  ): Promise<AgentResult> {
    this.markStart();
    this.resetState();

    const auditLog = this.createAuditLog(AgentOutcome.SUCCESS, ["sub_result"]);

    return {
      success: true,
      outcome: AgentOutcome.SUCCESS,
      deliverable: { subTask: task, completed: true },
      auditLog,
      executionTimeMs: 50,
    };
  }
}

// =============================================================================
// Test Suites
// =============================================================================

describe("AgentBase - Initialization", () => {
  it("should initialize with default autonomy mode", () => {
    const agent = new TestAgent();
    expect(agent.getAutonomyMode()).toBe(AutonomyMode.BALANCED);
  });

  it("should initialize with specified autonomy mode", () => {
    const agent = new TestAgent({ autonomyMode: AutonomyMode.CAUTIOUS });
    expect(agent.getAutonomyMode()).toBe(AutonomyMode.CAUTIOUS);
  });

  it("should initialize with case context", () => {
    const caseContext: CaseContext = {
      caseId: "TEST-2025-001",
      title: "Test Case",
      caseType: "litigation",
      jurisdiction: { federal: true, cantons: ["ZH"], languages: ["DE"] },
      parties: [],
      facts: [],
      legalIssues: [],
      agentHistory: [],
      findings: {},
      createdAt: new Date(),
    };

    const agent = new TestAgent({ caseContext });
    expect(agent.getCaseContext()).toEqual(caseContext);
  });

  it("should have correct agent ID and version", () => {
    const agent = new TestAgent();
    expect(agent.agentId).toBe("test-agent");
    expect(agent.agentVersion).toBe("1.0.0");
  });
});

describe("AgentBase - Execution", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent();
  });

  it("should execute task successfully", async () => {
    const result = await agent.execute("Test task");

    expect(result.success).toBe(true);
    expect(result.outcome).toBe(AgentOutcome.SUCCESS);
    expect(result.deliverable).toBeDefined();
  });

  it("should return execution time", async () => {
    const result = await agent.execute("Test task");

    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it("should include audit log", async () => {
    const result = await agent.execute("Test task");

    expect(result.auditLog).toBeDefined();
    expect(result.auditLog.agentId).toBe("test-agent");
    expect(result.auditLog.agentVersion).toBe("1.0.0");
  });
});

describe("AgentBase - Checkpoint Management", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent();
  });

  it("should create checkpoint with auto type", () => {
    const checkpoint = agent.testCreateCheckpoint("auto", "Test checkpoint");

    expect(checkpoint).toBeDefined();
    expect(checkpoint.checkpointType).toBe("auto");
    expect(checkpoint.description).toBe("Test checkpoint");
    expect(checkpoint.checkpointId).toBeDefined();
    expect(checkpoint.timestamp).toBeDefined();
  });

  it("should create checkpoint with user type", () => {
    const checkpoint = agent.testCreateCheckpoint("user", "User checkpoint");

    expect(checkpoint.checkpointType).toBe("user");
  });

  it("should create checkpoint with pre_external type", () => {
    const checkpoint = agent.testCreateCheckpoint(
      "pre_external",
      "Before API call"
    );

    expect(checkpoint.checkpointType).toBe("pre_external");
  });

  it("should create checkpoint with pre_subagent type", () => {
    const checkpoint = agent.testCreateCheckpoint(
      "pre_subagent",
      "Before sub-agent"
    );

    expect(checkpoint.checkpointType).toBe("pre_subagent");
  });

  it("should get latest checkpoint", () => {
    agent.testCreateCheckpoint("auto", "First");
    agent.testCreateCheckpoint("auto", "Second");
    const third = agent.testCreateCheckpoint("auto", "Third");

    const latest = agent.testGetLatestCheckpoint();

    expect(latest?.checkpointId).toBe(third.checkpointId);
    expect(latest?.description).toBe("Third");
  });

  it("should restore checkpoint state", () => {
    agent.testUpdateState("value", 1);
    const cp1 = agent.testCreateCheckpoint("auto", "State 1");

    agent.testUpdateState("value", 2);
    agent.testCreateCheckpoint("auto", "State 2");

    // Restore to first checkpoint
    const restored = agent.testRestoreCheckpoint(cp1.checkpointId);

    expect(restored).toBe(true);
    expect(agent.testGetState("value")).toBe(1);
  });

  it("should return false for non-existent checkpoint", () => {
    const restored = agent.testRestoreCheckpoint("non-existent-id");

    expect(restored).toBe(false);
  });

  it("should return undefined for latest checkpoint when none exist", () => {
    const latest = agent.testGetLatestCheckpoint();

    expect(latest).toBeUndefined();
  });
});

describe("AgentBase - State Management", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent();
  });

  it("should update state", () => {
    agent.testUpdateState("key", "value");

    expect(agent.testGetState("key")).toBe("value");
  });

  it("should return default value for missing state", () => {
    const value = agent.testGetState("missing", "default");

    expect(value).toBe("default");
  });

  it("should preserve state in checkpoint", () => {
    agent.testUpdateState("preserved", true);
    const checkpoint = agent.testCreateCheckpoint("auto", "With state");

    expect(checkpoint.state).toHaveProperty("preserved", true);
  });
});

describe("AgentBase - Action Recording", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent();
  });

  it("should record search action", () => {
    const action = agent.testRecordAction(
      ActionType.SEARCH,
      "Searched database",
      { query: "test" },
      { results: 5 },
      200
    );

    expect(action.actionType).toBe(ActionType.SEARCH);
    expect(action.description).toBe("Searched database");
    expect(action.durationMs).toBe(200);
  });

  it("should record analyze action", () => {
    const action = agent.testRecordAction(
      ActionType.ANALYZE,
      "Analyzed data",
      { data: "sample" },
      { insights: [] },
      300
    );

    expect(action.actionType).toBe(ActionType.ANALYZE);
  });

  it("should record generate action", () => {
    const action = agent.testRecordAction(
      ActionType.GENERATE,
      "Generated report",
      { template: "summary" },
      { report: "..." },
      500
    );

    expect(action.actionType).toBe(ActionType.GENERATE);
  });

  it("should sanitize sensitive inputs", () => {
    const action = agent.testRecordAction(
      ActionType.SEARCH,
      "Test",
      { password: "secret123", token: "abc", normal: "value" },
      {},
      100
    );

    expect(action.inputs.password).toBe("[REDACTED]");
    expect(action.inputs.token).toBe("[REDACTED]");
    expect(action.inputs.normal).toBe("value");
  });

  it("should truncate long input values", () => {
    const longValue = "x".repeat(2000);
    const action = agent.testRecordAction(
      ActionType.ANALYZE,
      "Test",
      { longField: longValue },
      {},
      100
    );

    expect((action.inputs.longField as string).length).toBeLessThan(
      longValue.length
    );
    expect(action.inputs.longField).toContain("[truncated]");
  });

  it("should summarize array outputs", () => {
    const action = agent.testRecordAction(
      ActionType.SEARCH,
      "Test",
      {},
      { results: [1, 2, 3, 4, 5] },
      100
    );

    expect(action.outputs.results).toBe("[List with 5 items]");
  });

  it("should summarize object outputs", () => {
    const action = agent.testRecordAction(
      ActionType.ANALYZE,
      "Test",
      {},
      { data: { a: 1, b: 2, c: 3 } },
      100
    );

    expect(action.outputs.data).toBe("[Object with 3 keys]");
  });
});

describe("AgentBase - Audit Logging", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent({
      autonomyMode: AutonomyMode.BALANCED,
      userId: "test-user",
      firmId: "test-firm",
      caseContext: {
        caseId: "CASE-001",
        title: "Test Case",
        caseType: "litigation",
        jurisdiction: { federal: true, cantons: [], languages: ["DE"] },
        parties: [],
        facts: [],
        legalIssues: [],
        agentHistory: [],
        findings: {},
        createdAt: new Date(),
      },
    });
  });

  it("should create audit log with agent info", () => {
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, ["doc1"]);

    expect(auditLog.agentId).toBe("test-agent");
    expect(auditLog.agentVersion).toBe("1.0.0");
    expect(auditLog.autonomyMode).toBe(AutonomyMode.BALANCED);
  });

  it("should include user and firm info", () => {
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    expect(auditLog.userId).toBe("test-user");
    expect(auditLog.firmId).toBe("test-firm");
  });

  it("should include case ID", () => {
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    expect(auditLog.caseId).toBe("CASE-001");
  });

  it("should track outcome", () => {
    const successLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);
    const failedLog = agent.testCreateAuditLog(AgentOutcome.FAILED, []);

    expect(successLog.outcome).toBe(AgentOutcome.SUCCESS);
    expect(failedLog.outcome).toBe(AgentOutcome.FAILED);
  });

  it("should track deliverables", () => {
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, [
      "report.pdf",
      "analysis.json",
    ]);

    expect(auditLog.deliverables).toContain("report.pdf");
    expect(auditLog.deliverables).toContain("analysis.json");
  });
});

describe("AgentBase - Source and Document Tracking", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent();
  });

  it("should track source access", () => {
    agent.testRecordSourceAccess("BGE Database");
    agent.testRecordSourceAccess("Entscheidsuche");

    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    expect(auditLog.sourcesAccessed).toContain("BGE Database");
    expect(auditLog.sourcesAccessed).toContain("Entscheidsuche");
  });

  it("should track documents read", () => {
    agent.testRecordDocumentRead("contract.pdf");
    agent.testRecordDocumentRead("evidence.docx");

    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    expect(auditLog.documentsRead).toContain("contract.pdf");
    expect(auditLog.documentsRead).toContain("evidence.docx");
  });

  it("should track documents written", () => {
    agent.testRecordDocumentWrite("analysis.pdf");
    agent.testRecordDocumentWrite("summary.docx");

    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    expect(auditLog.documentsWritten).toContain("analysis.pdf");
    expect(auditLog.documentsWritten).toContain("summary.docx");
  });
});

describe("AgentBase - Error Handling", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent({ autonomyMode: AutonomyMode.BALANCED });
  });

  it("should record error in audit log", () => {
    agent.testHandleError(new Error("Test error"), true);

    const auditLog = agent.testCreateAuditLog(AgentOutcome.PARTIAL, []);

    expect(auditLog.errors.length).toBe(1);
    expect(auditLog.errors[0].message).toBe("Test error");
  });

  it("should escalate to cautious mode on recoverable error", () => {
    agent.testHandleError(new Error("Recoverable"), true);

    expect(agent.getAutonomyMode()).toBe(AutonomyMode.CAUTIOUS);
  });

  it("should mark error as recoverable or not", () => {
    agent.testHandleError(new Error("Error 1"), true);
    agent.testHandleError(new Error("Error 2"), false);

    const auditLog = agent.testCreateAuditLog(AgentOutcome.FAILED, []);

    expect(auditLog.errors[0].recoverable).toBe(true);
    expect(auditLog.errors[1].recoverable).toBe(false);
  });
});

describe("AgentBase - User Confirmation", () => {
  it("should skip confirmation in autonomous mode", async () => {
    const agent = new TestAgent({ autonomyMode: AutonomyMode.AUTONOMOUS });

    const response = await agent.testRequestUserConfirmation("Proceed?");

    expect(response).toBe("yes");
  });

  it("should request confirmation in balanced mode", async () => {
    const agent = new TestAgent({ autonomyMode: AutonomyMode.BALANCED });

    const response = await agent.testRequestUserConfirmation("Proceed?");

    // In test implementation, always returns "yes"
    expect(response).toBe("yes");
  });

  it("should record confirmation action", async () => {
    const agent = new TestAgent({ autonomyMode: AutonomyMode.CAUTIOUS });

    await agent.testRequestUserConfirmation("Confirm action?");
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    expect(auditLog.actions.length).toBe(1);
    expect(auditLog.actions[0].actionType).toBe(ActionType.USER_CONFIRM);
  });
});

describe("AgentBase - Sub-Agent Invocation", () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent({
      autonomyMode: AutonomyMode.BALANCED,
      caseContext: {
        caseId: "PARENT-001",
        title: "Parent Case",
        caseType: "litigation",
        jurisdiction: { federal: true, cantons: ["ZH"], languages: ["DE"] },
        parties: [],
        facts: [],
        legalIssues: [],
        agentHistory: [],
        findings: {},
        createdAt: new Date(),
      },
      userId: "parent-user",
      firmId: "parent-firm",
    });
  });

  it("should invoke sub-agent successfully", async () => {
    // Access protected method through a workaround
    const invokeSubAgent = (agent as unknown as {
      invokeSubAgent: <T extends AgentBase>(
        AgentClass: new (config: AgentConfig) => T,
        task: string,
        autonomyOverride?: AutonomyMode,
        options?: Record<string, unknown>
      ) => Promise<AgentResult>;
    }).invokeSubAgent.bind(agent);

    const result = await invokeSubAgent(SubTestAgent, "Sub task");

    expect(result.success).toBe(true);
    expect(result.outcome).toBe(AgentOutcome.SUCCESS);
  });

  it("should create checkpoint before sub-agent invocation", async () => {
    const invokeSubAgent = (agent as unknown as {
      invokeSubAgent: <T extends AgentBase>(
        AgentClass: new (config: AgentConfig) => T,
        task: string,
        autonomyOverride?: AutonomyMode,
        options?: Record<string, unknown>
      ) => Promise<AgentResult>;
    }).invokeSubAgent.bind(agent);

    await invokeSubAgent(SubTestAgent, "Sub task");
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    const preSubagentCheckpoints = auditLog.checkpoints.filter(
      (cp) => cp.checkpointType === "pre_subagent"
    );

    expect(preSubagentCheckpoints.length).toBeGreaterThan(0);
  });

  it("should record sub-agent invocation action", async () => {
    const invokeSubAgent = (agent as unknown as {
      invokeSubAgent: <T extends AgentBase>(
        AgentClass: new (config: AgentConfig) => T,
        task: string,
        autonomyOverride?: AutonomyMode,
        options?: Record<string, unknown>
      ) => Promise<AgentResult>;
    }).invokeSubAgent.bind(agent);

    await invokeSubAgent(SubTestAgent, "Sub task");
    const auditLog = agent.testCreateAuditLog(AgentOutcome.SUCCESS, []);

    const invokeActions = auditLog.actions.filter(
      (a) => a.actionType === ActionType.INVOKE_AGENT
    );

    expect(invokeActions.length).toBe(1);
    expect(invokeActions[0].subAgentId).toBe("sub-test-agent");
  });
});

describe("AgentOutcome Enum", () => {
  it("should have correct values", () => {
    expect(AgentOutcome.SUCCESS).toBe("success");
    expect(AgentOutcome.PARTIAL).toBe("partial");
    expect(AgentOutcome.FAILED).toBe("failed");
    expect(AgentOutcome.CANCELLED).toBe("cancelled");
  });
});

describe("AutonomyMode Enum", () => {
  it("should have correct values", () => {
    expect(AutonomyMode.CAUTIOUS).toBe("cautious");
    expect(AutonomyMode.BALANCED).toBe("balanced");
    expect(AutonomyMode.AUTONOMOUS).toBe("autonomous");
  });
});

describe("ActionType Enum", () => {
  it("should have correct values", () => {
    expect(ActionType.SEARCH).toBe("search");
    expect(ActionType.ANALYZE).toBe("analyze");
    expect(ActionType.GENERATE).toBe("generate");
    expect(ActionType.INVOKE_AGENT).toBe("invoke_agent");
    expect(ActionType.CHECKPOINT).toBe("checkpoint");
    expect(ActionType.USER_CONFIRM).toBe("user_confirm");
  });
});
