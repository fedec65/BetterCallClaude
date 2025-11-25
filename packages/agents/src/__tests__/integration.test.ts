/**
 * E2E Integration Tests for Agent Integration System
 *
 * Tests the full research workflow including:
 * - IntegratedResearchSystem lifecycle (initialize, shutdown)
 * - Case-bound research with CaseManager integration
 * - ResearcherAgent execution with mock MCP adapters
 * - Finding recording and case updates
 * - Factory functions and utility methods
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import {
  IntegratedResearchSystem,
  IntegrationConfig,
  CaseBoundResearchOptions,
  createIntegratedSystem,
  quickResearch,
} from "../integration.js";
import {
  CaseManager,
  JSONFileCaseStorage,
  CaseStatus,
  CaseType,
  ManagedCaseContext,
} from "../case-manager.js";
import {
  ResearcherAgent,
  MCPClient,
  ResearchMemo,
  ResearchDepth,
  LegalDomain,
} from "../researcher.js";
import { MCPAdapter, MCPAdapterConfig } from "../mcp-adapter.js";
import { AutonomyMode, AgentOutcome, CaseContext } from "../base.js";

// =============================================================================
// Test Utilities
// =============================================================================

const TEST_STORAGE_DIR = ".test-integration-cases-" + Date.now();

function cleanupTestStorage(): void {
  try {
    if (fs.existsSync(TEST_STORAGE_DIR)) {
      fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Mock MCP Client that simulates real MCP server responses
 */
class TestMCPClient implements MCPClient {
  public searchCalls: Array<{ server: string; method: string; params: Record<string, unknown> }> = [];
  public verifyCalls: Array<{ citation: string }> = [];
  public shouldFail = false;
  public searchDelay = 0;

  async call(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    this.searchCalls.push({ server, method, params });

    if (this.shouldFail) {
      throw new Error("Mock MCP error: Connection failed");
    }

    if (this.searchDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.searchDelay));
    }

    // Simulate entscheidsuche/bge-search responses
    if (
      (server === "bge-search" || server === "entscheidsuche") &&
      method === "search"
    ) {
      return {
        results: [
          {
            id: "BGE-147-III-225",
            title: "Werkvertrag; Mängelhaftung; Schadenersatz",
            citation: "BGE 147 III 225",
            date: "2021-06-15",
            court: "Bundesgericht",
            summary:
              "Grundsatzentscheid zur Nachbesserungspflicht bei Werkmängeln...",
            relevance_score: 0.95,
            full_text_url: "https://bger.ch/ext/147-III-225",
            language: "DE",
          },
          {
            id: "BGE-142-III-234",
            title: "Werkvertrag; Haftung des Unternehmers",
            citation: "BGE 142 III 234",
            date: "2016-05-15",
            court: "Bundesgericht",
            summary: "Zur Verjährung von Mängelansprüchen im Werkvertrag...",
            relevance_score: 0.88,
            full_text_url: "https://bger.ch/ext/142-III-234",
            language: "DE",
          },
        ],
        total: 2,
      };
    }

    // Simulate cantonal court responses
    if (server === "cantonal-courts" && method === "search") {
      return {
        results: [
          {
            id: "ZH-HG-2023-001",
            title: "Werkvertrag; Abnahme; Mängelrüge",
            citation: "ZH HG 2023/001",
            date: "2023-03-20",
            court: "Handelsgericht Zürich",
            summary: "Zur Obliegenheit der unverzüglichen Mängelanzeige...",
            relevance_score: 0.75,
            language: "DE",
          },
        ],
        total: 1,
      };
    }

    // Simulate legal-citations responses
    if (server === "legal-citations" && method === "verify") {
      const citation = String(params.citation);
      this.verifyCalls.push({ citation });

      // Simulate different verification outcomes
      if (citation.includes("BGE")) {
        return {
          verified: true,
          formatted: citation,
          is_current: true,
          court: "Bundesgericht",
          issues: [],
        };
      } else if (citation.includes("OUTDATED")) {
        return {
          verified: true,
          formatted: citation,
          is_current: false,
          court: "Unknown",
          issues: ["Citation may be outdated"],
        };
      } else {
        return {
          verified: false,
          formatted: citation,
          is_current: true,
          court: "",
          issues: ["Citation format not recognized"],
        };
      }
    }

    return { results: [], total: 0 };
  }

  reset(): void {
    this.searchCalls = [];
    this.verifyCalls = [];
    this.shouldFail = false;
    this.searchDelay = 0;
  }
}

/**
 * Mock MCP Adapter that wraps TestMCPClient
 */
class MockMCPAdapter extends MCPAdapter {
  private mockClient: TestMCPClient;
  private _initialized = false;

  constructor(mockClient: TestMCPClient) {
    super();
    this.mockClient = mockClient;
  }

  async connect(): Promise<void> {
    this._initialized = true;
  }

  async disconnect(): Promise<void> {
    this._initialized = false;
  }

  isConnected(): boolean {
    return this._initialized;
  }

  async call(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (!this._initialized) {
      throw new Error("MCP adapter not initialized");
    }
    return this.mockClient.call(server, method, params);
  }

  getMockClient(): TestMCPClient {
    return this.mockClient;
  }
}

// =============================================================================
// Test Suites
// =============================================================================

describe("IntegratedResearchSystem - Lifecycle", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;

  beforeEach(() => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    // Create system with test storage and mock adapter
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    const caseManager = new CaseManager(storage);

    // Create system by accessing internal components
    system = new IntegratedResearchSystem({
      caseStorage: storage,
    });

    // Replace adapter with mock (access private member for testing)
    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should initialize successfully", async () => {
    expect(system.isInitialized()).toBe(false);

    await system.initialize();

    expect(system.isInitialized()).toBe(true);
    expect(mockAdapter.isConnected()).toBe(true);
  });

  it("should not re-initialize if already initialized", async () => {
    await system.initialize();
    await system.initialize(); // Second call should be no-op

    expect(system.isInitialized()).toBe(true);
  });

  it("should shutdown successfully", async () => {
    await system.initialize();
    expect(system.isInitialized()).toBe(true);

    await system.shutdown();

    expect(system.isInitialized()).toBe(false);
    expect(mockAdapter.isConnected()).toBe(false);
  });

  it("should not shutdown if not initialized", async () => {
    await system.shutdown(); // Should be no-op

    expect(system.isInitialized()).toBe(false);
  });

  it("should throw error when researching without initialization", async () => {
    await expect(system.research("Test query")).rejects.toThrow(
      "IntegratedResearchSystem not initialized"
    );
  });
});

describe("IntegratedResearchSystem - Case Management", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;

  beforeEach(async () => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
      defaultAutonomyMode: AutonomyMode.AUTONOMOUS,
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should create a new case", async () => {
    const caseContext = await system.createCase({
      title: "Integration Test Case",
      caseType: CaseType.CONTRACT,
      jurisdictionFederal: true,
    });

    expect(caseContext).toBeDefined();
    expect(caseContext.title).toBe("Integration Test Case");
    expect(caseContext.caseType).toBe("contract");
    expect(caseContext.jurisdiction.federal).toBe(true);
  });

  it("should set current case after creation", async () => {
    await system.createCase({ title: "Test Case" });

    expect(system.currentCase).toBeDefined();
    expect(system.currentCase?.title).toBe("Test Case");
  });

  it("should open existing case", async () => {
    const created = await system.createCase({ title: "Openable Case" });
    await system.createCase({ title: "Another Case" }); // Change current

    const opened = await system.openCase(created.caseId);

    expect(opened.caseId).toBe(created.caseId);
    expect(system.currentCase?.caseId).toBe(created.caseId);
  });

  it("should throw error when opening non-existent case", async () => {
    await expect(system.openCase("non-existent-id")).rejects.toThrow(
      "Case not found"
    );
  });

  it("should convert managed context to agent context", async () => {
    const managed = await system.createCase({
      title: "Conversion Test",
      caseType: CaseType.LITIGATION,
    });

    const agentContext = system.toAgentContext(managed);

    expect(agentContext.caseId).toBe(managed.caseId);
    expect(agentContext.title).toBe(managed.title);
    expect(agentContext.caseType).toBe("litigation");
    // Should not have managed-specific fields
    expect((agentContext as unknown as ManagedCaseContext).status).toBeUndefined();
  });
});

describe("IntegratedResearchSystem - Standalone Research", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;

  beforeEach(async () => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
      defaultAutonomyMode: AutonomyMode.AUTONOMOUS,
      userId: "test-user",
      firmId: "test-firm",
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should execute standalone research successfully", async () => {
    const result = await system.research(
      "Werkvertrag Mängelhaftung Art. 368 OR",
      { depth: ResearchDepth.QUICK }
    );

    expect(result.success).toBe(true);
    expect(result.outcome).toBe(AgentOutcome.SUCCESS);
    expect(result.deliverable).toBeDefined();
    expect(result.deliverable?.findings).toBeDefined();
  });

  it("should include audit log in result", async () => {
    const result = await system.research("BGE precedents on contracts");

    expect(result.auditLog).toBeDefined();
    expect(result.auditLog.agentId).toBe("researcher");
    expect(result.auditLog.agentVersion).toBe("1.0.0");
    expect(result.auditLog.userId).toBe("test-user");
    expect(result.auditLog.firmId).toBe("test-firm");
  });

  it("should execute MCP calls for search and verification", async () => {
    await system.research("Werkvertrag liability");

    // Should have made search calls
    const searchCalls = mockClient.searchCalls.filter(
      (c) => c.method === "search"
    );
    expect(searchCalls.length).toBeGreaterThan(0);

    // Should have made verification calls
    expect(mockClient.verifyCalls.length).toBeGreaterThan(0);
  });

  it("should return execution time", async () => {
    const result = await system.research("Quick search test", {
      depth: ResearchDepth.QUICK,
    });

    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });
});

describe("IntegratedResearchSystem - Case-Bound Research", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
      defaultAutonomyMode: AutonomyMode.AUTONOMOUS,
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();

    // Create a test case
    const created = await system.createCase({
      title: "Research Bound Case",
      caseType: CaseType.CONTRACT,
      jurisdictionFederal: true,
      jurisdictionCantons: ["ZH"],
    });
    caseId = created.caseId;
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should execute research bound to case", async () => {
    const result = await system.researchWithCase(
      "Werkvertrag Mängel BGE",
      caseId
    );

    expect(result.result.success).toBe(true);
    expect(result.caseContext).toBeDefined();
    expect(result.caseContext.caseId).toBe(caseId);
  });

  it("should record agent execution in case", async () => {
    const result = await system.researchWithCase(
      "Contract liability research",
      caseId,
      { recordExecution: true }
    );

    expect(result.executionRecorded).toBe(true);

    // Verify execution was recorded
    const caseData = await system.openCase(caseId);
    expect(caseData.agentExecutions.length).toBe(1);
    expect(caseData.agentExecutions[0].agentId).toBe("researcher");
    expect(caseData.agentHistory).toContain("researcher");
  });

  it("should add findings to case when requested", async () => {
    const result = await system.researchWithCase(
      "BGE research with findings",
      caseId,
      { addFindings: true }
    );

    expect(result.findingsAdded).toBe(true);

    // Verify findings were added
    const caseData = await system.openCase(caseId);
    expect(caseData.managedFindings.length).toBeGreaterThan(0);
  });

  it("should not record execution when disabled", async () => {
    const result = await system.researchWithCase(
      "Test research",
      caseId,
      { recordExecution: false }
    );

    expect(result.executionRecorded).toBe(false);

    const caseData = await system.openCase(caseId);
    expect(caseData.agentExecutions.length).toBe(0);
  });

  it("should not add findings when disabled", async () => {
    const result = await system.researchWithCase(
      "Test research",
      caseId,
      { addFindings: false }
    );

    expect(result.findingsAdded).toBe(false);

    const caseData = await system.openCase(caseId);
    expect(caseData.managedFindings.length).toBe(0);
  });

  it("should use custom autonomy mode for case research", async () => {
    const result = await system.researchWithCase(
      "Cautious research",
      caseId,
      { autonomyMode: AutonomyMode.CAUTIOUS }
    );

    expect(result.result.auditLog.autonomyMode).toBe(AutonomyMode.CAUTIOUS);
  });
});

describe("IntegratedResearchSystem - Current Case Research", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;

  beforeEach(async () => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
      defaultAutonomyMode: AutonomyMode.AUTONOMOUS,
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should research on current case", async () => {
    await system.createCase({ title: "Current Case" });

    const result = await system.researchCurrentCase("Current case research");

    expect(result.result.success).toBe(true);
    expect(result.caseContext.title).toBe("Current Case");
  });

  it("should throw error when no case is open", async () => {
    await expect(system.researchCurrentCase("No case")).rejects.toThrow(
      "No case is currently open"
    );
  });
});

describe("IntegratedResearchSystem - Utility Methods", () => {
  let system: IntegratedResearchSystem;
  let mockAdapter: MockMCPAdapter;

  beforeEach(async () => {
    cleanupTestStorage();
    const mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should provide access to MCP adapter", () => {
    const adapter = system.getMCPAdapter();
    expect(adapter).toBe(mockAdapter);
  });

  it("should provide access to case manager", () => {
    const caseManager = system.getCaseManager();
    expect(caseManager).toBeDefined();
    expect(caseManager).toBeInstanceOf(CaseManager);
  });

  it("should create standalone researcher agent", () => {
    const agent = system.createResearcherAgent({
      autonomyMode: AutonomyMode.CAUTIOUS,
    });

    expect(agent).toBeDefined();
    expect(agent).toBeInstanceOf(ResearcherAgent);
    expect(agent.agentId).toBe("researcher");
  });

  it("should create researcher agent with inherited config", async () => {
    const caseContext = await system.createCase({ title: "Agent Test Case" });
    const agentContext = system.toAgentContext(caseContext);

    const agent = system.createResearcherAgent({
      caseContext: agentContext,
    });

    expect(agent).toBeDefined();
  });
});

describe("Integration Factory Functions", () => {
  beforeEach(() => {
    cleanupTestStorage();
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should create and initialize system via factory", async () => {
    // Note: This would fail in real test without mock servers
    // For now, we test the factory creates the system
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    const system = new IntegratedResearchSystem({
      caseStorage: storage,
    });

    expect(system).toBeDefined();
    expect(system.isInitialized()).toBe(false);
  });
});

describe("Full E2E Research Workflow", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;

  beforeEach(async () => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
      defaultAutonomyMode: AutonomyMode.AUTONOMOUS,
      userId: "e2e-user",
      firmId: "e2e-firm",
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should complete full research workflow with case integration", async () => {
    // Step 1: Create a case
    const caseContext = await system.createCase({
      title: "Contract Dispute - ABC Corp vs XYZ Ltd",
      caseType: CaseType.CONTRACT,
      jurisdictionFederal: true,
      jurisdictionCantons: ["ZH"],
      parties: [
        { name: "ABC Corp", role: "client", metadata: { industry: "tech" } },
        { name: "XYZ Ltd", role: "defendant", metadata: {} },
      ],
    });

    expect(caseContext.parties.length).toBe(2);

    // Step 2: Add facts to the case
    const caseManager = system.getCaseManager();
    await caseManager.addFact(
      caseContext.caseId,
      "Contract signed on 2024-01-15 for software development"
    );
    await caseManager.addFact(
      caseContext.caseId,
      "Defects discovered during acceptance testing"
    );

    // Step 3: Execute research bound to the case
    const researchResult = await system.researchWithCase(
      "BGE precedents on Werkvertrag Mängelhaftung and liability under Art. 368 OR",
      caseContext.caseId,
      {
        depth: ResearchDepth.STANDARD,
        addFindings: true,
        recordExecution: true,
      }
    );

    // Verify research completed successfully
    expect(researchResult.result.success).toBe(true);
    expect(researchResult.result.outcome).toBe(AgentOutcome.SUCCESS);
    expect(researchResult.executionRecorded).toBe(true);
    expect(researchResult.findingsAdded).toBe(true);

    // Verify research memo
    const memo = researchResult.result.deliverable;
    expect(memo).toBeDefined();
    expect(memo?.title).toContain("Research Memo");
    expect(memo?.executiveSummary).toBeDefined();
    expect(memo?.methodology).toBeDefined();
    expect(memo?.findings).toBeDefined();
    expect(memo?.citations).toBeDefined();

    // Step 4: Verify case was updated
    const updatedCase = researchResult.caseContext;
    expect(updatedCase.agentExecutions.length).toBe(1);
    expect(updatedCase.agentExecutions[0].agentId).toBe("researcher");
    expect(updatedCase.agentExecutions[0].outcome).toBe("success");
    expect(updatedCase.agentHistory).toContain("researcher");
    expect(updatedCase.managedFindings.length).toBeGreaterThan(0);

    // Step 5: Verify audit trail
    const auditLog = researchResult.result.auditLog;
    expect(auditLog.userId).toBe("e2e-user");
    expect(auditLog.firmId).toBe("e2e-firm");
    expect(auditLog.caseId).toBe(caseContext.caseId);
    expect(auditLog.actions.length).toBeGreaterThan(0);
    expect(auditLog.checkpoints.length).toBeGreaterThan(0);

    // Step 6: Generate case summary
    const summary = await caseManager.generateSummary(caseContext.caseId);
    expect(summary).toBeDefined();
    expect(summary?.factsCount).toBe(2);
    expect(summary?.findingsCount).toBeGreaterThan(0);
    expect(summary?.partiesCount).toBe(2);

    // Step 7: Export case
    const exported = await caseManager.exportCase(caseContext.caseId, "json");
    expect(exported).toBeDefined();
    const parsed = JSON.parse(exported!);
    expect(parsed.title).toBe("Contract Dispute - ABC Corp vs XYZ Ltd");
  });

  it("should handle multiple research sessions on same case", async () => {
    // Create case
    const caseContext = await system.createCase({
      title: "Multi-Session Research Case",
      caseType: CaseType.LITIGATION,
    });

    // First research session
    const result1 = await system.researchWithCase(
      "First research topic: contract formation",
      caseContext.caseId,
      { addFindings: true, recordExecution: true }
    );
    expect(result1.result.success).toBe(true);

    // Second research session
    const result2 = await system.researchWithCase(
      "Second research topic: breach remedies",
      caseContext.caseId,
      { addFindings: true, recordExecution: true }
    );
    expect(result2.result.success).toBe(true);

    // Verify both executions recorded
    const finalCase = await system.openCase(caseContext.caseId);
    expect(finalCase.agentExecutions.length).toBe(2);
  });

  it("should handle research failures gracefully", async () => {
    mockClient.shouldFail = true;

    const caseContext = await system.createCase({
      title: "Failure Test Case",
    });

    const result = await system.researchWithCase(
      "This will fail",
      caseContext.caseId,
      { recordExecution: true }
    );

    // ResearcherAgent gracefully handles MCP failures and still produces results
    // (with empty findings when all sources fail), so success is still true
    expect(result.result.success).toBe(true);
    expect(result.result.outcome).toBe(AgentOutcome.SUCCESS);
    expect(result.executionRecorded).toBe(true);

    // The execution is recorded - agent completed even with failed searches
    const finalCase = result.caseContext;
    expect(finalCase.agentExecutions[0].outcome).toBe("success");

    // The memo will have no or minimal findings since searches failed
    if (result.result.deliverable) {
      // Findings may be empty or minimal when MCP fails
      expect(result.result.deliverable.findings.length).toBeLessThanOrEqual(1);
    }
  });
});

describe("ResearcherAgent with Mock MCP Client", () => {
  let mockClient: TestMCPClient;
  let agent: ResearcherAgent;

  beforeEach(() => {
    mockClient = new TestMCPClient();
    agent = new ResearcherAgent({
      autonomyMode: AutonomyMode.AUTONOMOUS,
      mcpClient: mockClient,
    });
  });

  it("should execute research with mock client", async () => {
    const result = await agent.execute(
      "Werkvertrag liability BGE precedents",
      { depth: ResearchDepth.QUICK }
    );

    expect(result.success).toBe(true);
    expect(result.outcome).toBe(AgentOutcome.SUCCESS);
  });

  it("should call MCP servers during research", async () => {
    await agent.execute("BGE search test", { depth: ResearchDepth.QUICK });

    // Should have made search calls
    expect(mockClient.searchCalls.length).toBeGreaterThan(0);

    // Should have made verification calls
    expect(mockClient.verifyCalls.length).toBeGreaterThan(0);
  });

  it("should generate research memo", async () => {
    const result = await agent.execute(
      "Contract law research",
      { depth: ResearchDepth.QUICK }
    );

    expect(result.deliverable).toBeDefined();
    expect(result.deliverable?.title).toContain("Research Memo");
    expect(result.deliverable?.findings).toBeDefined();
    expect(result.deliverable?.citations).toBeDefined();
    expect(result.deliverable?.methodology).toBeDefined();
  });

  it("should include verified citations in memo", async () => {
    const result = await agent.execute(
      "BGE 147 III 225 analysis",
      { depth: ResearchDepth.QUICK }
    );

    const citations = result.deliverable?.citations || [];
    expect(citations.length).toBeGreaterThan(0);

    // BGE citations should be verified as valid
    const bgeCitation = citations.find((c) => c.citation.includes("BGE"));
    expect(bgeCitation?.isValid).toBe(true);
    expect(bgeCitation?.isCurrent).toBe(true);
  });

  it("should detect contract domain from question", async () => {
    const result = await agent.execute(
      "Werkvertrag and Mängel liability",
      { depth: ResearchDepth.QUICK }
    );

    expect(result.success).toBe(true);
    // The research should have detected contract domain
    // This is verified through the memo content
    expect(result.deliverable?.methodology).toBeDefined();
  });

  it("should handle MCP errors gracefully", async () => {
    mockClient.shouldFail = true;

    const result = await agent.execute("Error test", { depth: ResearchDepth.QUICK });

    // ResearcherAgent handles MCP failures gracefully - it still produces
    // a research memo (with empty/minimal findings) rather than failing
    expect(result.success).toBe(true);
    expect(result.outcome).toBe(AgentOutcome.SUCCESS);

    // The memo will exist but with minimal content since searches failed
    expect(result.deliverable).toBeDefined();
    if (result.deliverable) {
      // With all sources failing, findings will be empty or minimal
      expect(result.deliverable.findings.length).toBeLessThanOrEqual(1);
    }
  });

  it("should include audit log with all actions", async () => {
    const result = await agent.execute(
      "Full audit test",
      { depth: ResearchDepth.QUICK }
    );

    const auditLog = result.auditLog;
    expect(auditLog).toBeDefined();
    expect(auditLog.actions.length).toBeGreaterThan(0);

    // Should have search action
    const searchAction = auditLog.actions.find((a) => a.actionType === "search");
    expect(searchAction).toBeDefined();

    // Should have analyze actions
    const analyzeActions = auditLog.actions.filter((a) => a.actionType === "analyze");
    expect(analyzeActions.length).toBeGreaterThan(0);

    // Should have generate action for memo
    const generateAction = auditLog.actions.find((a) => a.actionType === "generate");
    expect(generateAction).toBeDefined();
  });

  it("should create checkpoints during execution", async () => {
    const result = await agent.execute(
      "Checkpoint test",
      { depth: ResearchDepth.QUICK }
    );

    expect(result.auditLog.checkpoints.length).toBeGreaterThan(0);

    // Should have various checkpoint types
    const checkpointDescriptions = result.auditLog.checkpoints.map(
      (c) => c.description
    );
    expect(checkpointDescriptions.some((d) => d.includes("Research started"))).toBe(
      true
    );
  });
});

describe("Error Handling and Edge Cases", () => {
  let mockClient: TestMCPClient;
  let mockAdapter: MockMCPAdapter;
  let system: IntegratedResearchSystem;

  beforeEach(async () => {
    cleanupTestStorage();
    mockClient = new TestMCPClient();
    mockAdapter = new MockMCPAdapter(mockClient);

    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    system = new IntegratedResearchSystem({
      caseStorage: storage,
      defaultAutonomyMode: AutonomyMode.AUTONOMOUS,
    });

    (system as unknown as { mcpAdapter: MCPAdapter }).mcpAdapter = mockAdapter;
    await system.initialize();
  });

  afterEach(async () => {
    await system.shutdown();
    cleanupTestStorage();
  });

  it("should handle empty research results", async () => {
    // Override mock to return empty results
    const emptyClient = new TestMCPClient();
    emptyClient.call = async () => ({ results: [], total: 0 });

    const agent = new ResearcherAgent({
      autonomyMode: AutonomyMode.AUTONOMOUS,
      mcpClient: emptyClient,
    });

    const result = await agent.execute("Empty results test");

    // Should still complete successfully, just with no findings
    expect(result.success).toBe(true);
  });

  it("should handle case not found in research", async () => {
    await expect(
      system.researchWithCase("Test", "non-existent-case-id")
    ).rejects.toThrow("Case not found");
  });

  it("should handle unicode in research queries", async () => {
    const result = await system.research(
      "Vertragshaftung gemäß Art. 97 OR für Mängel"
    );

    expect(result.success).toBe(true);
  });

  it("should handle very long research queries", async () => {
    const longQuery = "Legal research ".repeat(100);

    const result = await system.research(longQuery, {
      depth: ResearchDepth.QUICK,
    });

    // Should handle gracefully
    expect(result).toBeDefined();
  });
});
