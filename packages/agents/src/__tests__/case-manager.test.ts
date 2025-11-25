/**
 * Unit Tests for Case Manager
 *
 * Tests case lifecycle management:
 * - Case creation, opening, closing, archiving
 * - Party, fact, deadline, finding management
 * - Summary generation and export
 * - Storage operations
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  CaseManager,
  CaseStatus,
  CaseType,
  LegalArea,
  JSONFileCaseStorage,
  ManagedCaseContext,
  CreateCaseOptions,
} from "../case-manager.js";

// =============================================================================
// Test Utilities
// =============================================================================

const TEST_STORAGE_DIR = ".test-cases-" + Date.now();

function cleanupTestStorage(): void {
  try {
    if (fs.existsSync(TEST_STORAGE_DIR)) {
      fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors
  }
}

// =============================================================================
// Test Suites
// =============================================================================

describe("CaseManager - Case Creation", () => {
  let manager: CaseManager;

  beforeEach(() => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should create a new case with minimal options", async () => {
    const caseData = await manager.createCase({
      title: "Test Case",
    });

    expect(caseData).toBeDefined();
    expect(caseData.title).toBe("Test Case");
    expect(caseData.caseId).toBeDefined();
    expect(caseData.status).toBe(CaseStatus.ACTIVE);
  });

  it("should generate unique case IDs", async () => {
    const case1 = await manager.createCase({ title: "Case One" });
    const case2 = await manager.createCase({ title: "Case Two" });

    expect(case1.caseId).not.toBe(case2.caseId);
  });

  it("should create case with specified type", async () => {
    const caseData = await manager.createCase({
      title: "Litigation Case",
      caseType: CaseType.LITIGATION,
    });

    expect(caseData.caseType).toBe(CaseType.LITIGATION);
  });

  it("should create case with federal jurisdiction", async () => {
    const caseData = await manager.createCase({
      title: "Federal Case",
      jurisdictionFederal: true,
    });

    expect(caseData.jurisdiction.federal).toBe(true);
  });

  it("should create case with cantonal jurisdiction", async () => {
    const caseData = await manager.createCase({
      title: "Zurich Case",
      jurisdictionCantons: ["ZH", "BE"],
    });

    expect(caseData.jurisdiction.cantons).toContain("ZH");
    expect(caseData.jurisdiction.cantons).toContain("BE");
  });

  it("should create case with multiple languages", async () => {
    const caseData = await manager.createCase({
      title: "Multi-lingual Case",
      languages: ["DE", "FR"],
    });

    expect(caseData.jurisdiction.languages).toContain("DE");
    expect(caseData.jurisdiction.languages).toContain("FR");
  });

  it("should create case with initial parties", async () => {
    const caseData = await manager.createCase({
      title: "Party Case",
      parties: [
        { name: "Client AG", role: "client", metadata: {} },
        { name: "Opponent GmbH", role: "defendant", metadata: {} },
      ],
    });

    expect(caseData.parties.length).toBe(2);
    expect(caseData.managedParties.length).toBe(2);
  });

  it("should set current case after creation", async () => {
    const caseData = await manager.createCase({ title: "Current Case" });

    expect(manager.currentCase).toBeDefined();
    expect(manager.currentCase?.caseId).toBe(caseData.caseId);
  });

  it("should set creation timestamps", async () => {
    const before = new Date();
    const caseData = await manager.createCase({ title: "Timestamped Case" });
    const after = new Date();

    expect(caseData.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(caseData.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(caseData.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });
});

describe("CaseManager - Case Opening", () => {
  let manager: CaseManager;
  let createdCaseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Openable Case" });
    createdCaseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should open existing case", async () => {
    const caseData = await manager.openCase(createdCaseId);

    expect(caseData).toBeDefined();
    expect(caseData?.caseId).toBe(createdCaseId);
    expect(caseData?.title).toBe("Openable Case");
  });

  it("should set current case after opening", async () => {
    // Create another case to change current
    await manager.createCase({ title: "Another Case" });

    // Open original case
    await manager.openCase(createdCaseId);

    expect(manager.currentCase?.caseId).toBe(createdCaseId);
  });

  it("should return null for non-existent case", async () => {
    const caseData = await manager.openCase("NON-EXISTENT-ID");

    expect(caseData).toBeNull();
  });
});

describe("CaseManager - Case Closing", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Closable Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should close case by ID", async () => {
    const success = await manager.closeCase(caseId);

    expect(success).toBe(true);

    const closed = await manager.openCase(caseId);
    expect(closed?.status).toBe(CaseStatus.CLOSED);
  });

  it("should close current case when no ID provided", async () => {
    const success = await manager.closeCase();

    expect(success).toBe(true);
  });

  it("should set closure reason", async () => {
    await manager.closeCase(caseId, "Case settled");

    const closed = await manager.openCase(caseId);
    expect(closed?.closureReason).toBe("Case settled");
  });

  it("should set closedAt timestamp", async () => {
    const before = new Date();
    await manager.closeCase(caseId);
    const after = new Date();

    const closed = await manager.openCase(caseId);
    expect(closed?.closedAt).toBeDefined();
    expect(closed?.closedAt?.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(closed?.closedAt?.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("should clear current case after closing", async () => {
    await manager.closeCase(caseId);

    expect(manager.currentCase).toBeNull();
  });

  it("should return false when no case specified and none active", async () => {
    // Create new manager without current case
    const freshManager = new CaseManager(new JSONFileCaseStorage(TEST_STORAGE_DIR));

    const success = await freshManager.closeCase();

    expect(success).toBe(false);
  });
});

describe("CaseManager - Case Archiving", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Archivable Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should archive case", async () => {
    const success = await manager.archiveCase(caseId);

    expect(success).toBe(true);

    const archived = await manager.openCase(caseId);
    expect(archived?.status).toBe(CaseStatus.ARCHIVED);
  });

  it("should set archivedAt timestamp", async () => {
    await manager.archiveCase(caseId);

    const archived = await manager.openCase(caseId);
    expect(archived?.archivedAt).toBeDefined();
  });
});

describe("CaseManager - Case Listing", () => {
  let manager: CaseManager;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    await manager.createCase({ title: "Case 1", firmId: "firm-a" });
    await manager.createCase({ title: "Case 2", firmId: "firm-a" });
    await manager.createCase({ title: "Case 3", firmId: "firm-b" });
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should list all cases", async () => {
    const cases = await manager.listCases();

    expect(cases.length).toBe(3);
  });

  it("should filter by firm ID", async () => {
    const cases = await manager.listCases({ firmId: "firm-a" });

    expect(cases.length).toBe(2);
  });

  it("should filter by status", async () => {
    // Close one case
    const allCases = await manager.listCases();
    await manager.closeCase(allCases[0].caseId);

    const activeCases = await manager.listCases({ status: CaseStatus.ACTIVE });
    const closedCases = await manager.listCases({ status: CaseStatus.CLOSED });

    expect(activeCases.length).toBe(2);
    expect(closedCases.length).toBe(1);
  });

  it("should respect limit", async () => {
    const cases = await manager.listCases({ limit: 2 });

    expect(cases.length).toBe(2);
  });

  it("should respect offset", async () => {
    const allCases = await manager.listCases();
    const offsetCases = await manager.listCases({ offset: 1 });

    expect(offsetCases.length).toBe(2);
    expect(offsetCases[0].caseId).not.toBe(allCases[0].caseId);
  });
});

describe("CaseManager - Party Management", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Party Test Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should add party to case", async () => {
    const success = await manager.addParty(caseId, {
      name: "New Client",
      role: "client",
      metadata: {},
    });

    expect(success).toBe(true);

    const caseData = await manager.openCase(caseId);
    expect(caseData?.parties.length).toBe(1);
    expect(caseData?.parties[0].name).toBe("New Client");
  });

  it("should add party to current case when no ID provided", async () => {
    const success = await manager.addParty(undefined, {
      name: "Current Client",
      role: "client",
      metadata: {},
    });

    expect(success).toBe(true);
  });

  it("should create managed party with ID and timestamp", async () => {
    await manager.addParty(caseId, {
      name: "Managed Party",
      role: "defendant",
      metadata: {},
    });

    const caseData = await manager.openCase(caseId);
    expect(caseData?.managedParties[0].partyId).toBeDefined();
    expect(caseData?.managedParties[0].addedAt).toBeDefined();
  });
});

describe("CaseManager - Fact Management", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Fact Test Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should add fact to case", async () => {
    const success = await manager.addFact(caseId, "Contract signed on 2024-01-15");

    expect(success).toBe(true);

    const caseData = await manager.openCase(caseId);
    expect(caseData?.facts).toContain("Contract signed on 2024-01-15");
  });

  it("should add multiple facts", async () => {
    await manager.addFact(caseId, "Fact 1");
    await manager.addFact(caseId, "Fact 2");
    await manager.addFact(caseId, "Fact 3");

    const caseData = await manager.openCase(caseId);
    expect(caseData?.facts.length).toBe(3);
  });
});

describe("CaseManager - Deadline Management", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Deadline Test Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should add deadline to case", async () => {
    const dueDate = new Date("2025-03-15");

    const success = await manager.addDeadline(caseId, {
      name: "Response Due",
      dueDate,
      description: "File response to complaint",
    });

    expect(success).toBe(true);

    const caseData = await manager.openCase(caseId);
    expect(caseData?.deadlines.length).toBe(1);
    expect(caseData?.deadlines[0].name).toBe("Response Due");
  });

  it("should auto-generate deadline ID", async () => {
    await manager.addDeadline(caseId, {
      name: "Deadline",
      dueDate: new Date(),
      description: "",
    });

    const caseData = await manager.openCase(caseId);
    expect(caseData?.deadlines[0].deadlineId).toBeDefined();
  });

  it("should set deadline as not completed by default", async () => {
    await manager.addDeadline(caseId, {
      name: "New Deadline",
      dueDate: new Date(),
      description: "",
    });

    const caseData = await manager.openCase(caseId);
    expect(caseData?.deadlines[0].completed).toBe(false);
  });
});

describe("CaseManager - Finding Management", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Finding Test Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should add finding to case", async () => {
    const success = await manager.addFinding(caseId, {
      content: "Relevant precedent found in BGE 147 IV 73",
      source: "Bundesgericht",
      category: "precedent",
      confidence: 0.95,
      citations: ["BGE 147 IV 73"],
      agentId: "researcher",
    });

    expect(success).toBe(true);

    const caseData = await manager.openCase(caseId);
    expect(caseData?.managedFindings.length).toBe(1);
  });

  it("should auto-generate finding ID and timestamp", async () => {
    await manager.addFinding(caseId, {
      content: "Finding content",
      source: "Source",
      category: "research",
      confidence: 0.8,
      citations: [],
    });

    const caseData = await manager.openCase(caseId);
    expect(caseData?.managedFindings[0].findingId).toBeDefined();
    expect(caseData?.managedFindings[0].timestamp).toBeDefined();
  });
});

describe("CaseManager - Document Management", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Document Test Case" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should add document to case", async () => {
    const success = await manager.addDocument(caseId, {
      name: "Contract",
      path: "/docs/contract.pdf",
      documentType: "contract",
      metadata: { pages: 10 },
    });

    expect(success).toBe(true);

    const caseData = await manager.openCase(caseId);
    expect(caseData?.documents.length).toBe(1);
    expect(caseData?.documents[0].name).toBe("Contract");
  });
});

describe("CaseManager - Agent Execution Recording", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({ title: "Agent Execution Test" });
    caseId = created.caseId;
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should record agent execution", async () => {
    const success = await manager.recordAgentExecution(caseId, {
      agentId: "researcher",
      task: "Find precedents",
      outcome: "success",
      summary: "Found 5 relevant precedents",
      durationMs: 5000,
      deliverables: ["precedent_report.md"],
    });

    expect(success).toBe(true);

    const caseData = await manager.openCase(caseId);
    expect(caseData?.agentExecutions.length).toBe(1);
    expect(caseData?.agentExecutions[0].agentId).toBe("researcher");
  });

  it("should add agent to history", async () => {
    await manager.recordAgentExecution(caseId, {
      agentId: "researcher",
      task: "Research",
      outcome: "success",
      summary: "",
      durationMs: 1000,
      deliverables: [],
    });

    const caseData = await manager.openCase(caseId);
    expect(caseData?.agentHistory).toContain("researcher");
  });
});

describe("CaseManager - Summary Generation", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({
      title: "Summary Test Case",
      caseType: CaseType.LITIGATION,
    });
    caseId = created.caseId;

    // Add some data
    await manager.addParty(caseId, { name: "Client", role: "client", metadata: {} });
    await manager.addFact(caseId, "Fact 1");
    await manager.addFact(caseId, "Fact 2");
    await manager.addFinding(caseId, {
      content: "Finding",
      source: "Source",
      category: "research",
      confidence: 0.9,
      citations: [],
    });
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should generate summary", async () => {
    const summary = await manager.generateSummary(caseId);

    expect(summary).toBeDefined();
    expect(summary?.caseId).toBe(caseId);
    expect(summary?.title).toBe("Summary Test Case");
  });

  it("should include counts", async () => {
    const summary = await manager.generateSummary(caseId);

    expect(summary?.partiesCount).toBe(1);
    expect(summary?.factsCount).toBe(2);
    expect(summary?.findingsCount).toBe(1);
  });

  it("should return null for non-existent case", async () => {
    const summary = await manager.generateSummary("NON-EXISTENT");

    expect(summary).toBeNull();
  });
});

describe("CaseManager - Export", () => {
  let manager: CaseManager;
  let caseId: string;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);

    const created = await manager.createCase({
      title: "Export Test Case",
      caseType: CaseType.CONTRACT,
    });
    caseId = created.caseId;

    await manager.addParty(caseId, { name: "Exporter AG", role: "client", metadata: {} });
    await manager.addFact(caseId, "Contract signed");
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should export as JSON", async () => {
    const exported = await manager.exportCase(caseId, "json");

    expect(exported).toBeDefined();
    const parsed = JSON.parse(exported!);
    expect(parsed.caseId).toBe(caseId);
    expect(parsed.title).toBe("Export Test Case");
  });

  it("should export as Markdown", async () => {
    const exported = await manager.exportCase(caseId, "markdown");

    expect(exported).toBeDefined();
    expect(exported).toContain("# Case: Export Test Case");
    expect(exported).toContain("**Case ID:**");
    expect(exported).toContain("## Parties");
    expect(exported).toContain("Exporter AG");
    expect(exported).toContain("## Facts");
    expect(exported).toContain("Contract signed");
  });

  it("should return null for non-existent case", async () => {
    const exported = await manager.exportCase("NON-EXISTENT");

    expect(exported).toBeNull();
  });
});

describe("CaseManager - Agent Context Conversion", () => {
  let manager: CaseManager;

  beforeEach(async () => {
    cleanupTestStorage();
    const storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
    manager = new CaseManager(storage);
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should convert ManagedCaseContext to CaseContext", async () => {
    const created = await manager.createCase({
      title: "Conversion Test",
      caseType: CaseType.LITIGATION,
    });

    const agentContext = manager.toAgentContext(created);

    expect(agentContext.caseId).toBe(created.caseId);
    expect(agentContext.title).toBe(created.title);
    expect(agentContext.caseType).toBe(created.caseType);
    // Should not have managed-specific fields
    expect((agentContext as unknown as ManagedCaseContext).status).toBeUndefined();
    expect((agentContext as unknown as ManagedCaseContext).managedParties).toBeUndefined();
  });
});

describe("JSONFileCaseStorage", () => {
  let storage: JSONFileCaseStorage;

  beforeEach(() => {
    cleanupTestStorage();
    storage = new JSONFileCaseStorage(TEST_STORAGE_DIR);
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it("should create storage directory", () => {
    expect(fs.existsSync(TEST_STORAGE_DIR)).toBe(true);
  });

  it("should create index file", () => {
    const indexPath = path.join(TEST_STORAGE_DIR, "index.json");
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  it("should check case existence", async () => {
    expect(await storage.caseExists("NON-EXISTENT")).toBe(false);

    // Save a case
    const testCase: ManagedCaseContext = {
      caseId: "TEST-001",
      title: "Test",
      caseType: "other",
      status: CaseStatus.ACTIVE,
      jurisdiction: { federal: true, cantons: [], languages: ["DE"] },
      parties: [],
      facts: [],
      legalIssues: [],
      agentHistory: [],
      findings: {},
      createdAt: new Date(),
      firmId: "default",
      userId: "test",
      managedParties: [],
      deadlines: [],
      milestones: [],
      managedLegalIssues: [],
      agentExecutions: [],
      managedFindings: [],
      documents: [],
      createdBy: "test",
      updatedAt: new Date(),
      workingLanguages: ["DE"],
    };

    await storage.saveCase("TEST-001", testCase);
    expect(await storage.caseExists("TEST-001")).toBe(true);
  });

  it("should delete case", async () => {
    const testCase: ManagedCaseContext = {
      caseId: "DELETE-001",
      title: "Delete Test",
      caseType: "other",
      status: CaseStatus.ACTIVE,
      jurisdiction: { federal: true, cantons: [], languages: ["DE"] },
      parties: [],
      facts: [],
      legalIssues: [],
      agentHistory: [],
      findings: {},
      createdAt: new Date(),
      firmId: "default",
      userId: "test",
      managedParties: [],
      deadlines: [],
      milestones: [],
      managedLegalIssues: [],
      agentExecutions: [],
      managedFindings: [],
      documents: [],
      createdBy: "test",
      updatedAt: new Date(),
      workingLanguages: ["DE"],
    };

    await storage.saveCase("DELETE-001", testCase);
    expect(await storage.caseExists("DELETE-001")).toBe(true);

    await storage.deleteCase("DELETE-001");
    expect(await storage.caseExists("DELETE-001")).toBe(false);
  });
});

describe("CaseStatus Enum", () => {
  it("should have correct values", () => {
    expect(CaseStatus.ACTIVE).toBe("active");
    expect(CaseStatus.PAUSED).toBe("paused");
    expect(CaseStatus.CLOSED).toBe("closed");
    expect(CaseStatus.ARCHIVED).toBe("archived");
  });
});

describe("CaseType Enum", () => {
  it("should have correct values", () => {
    expect(CaseType.LITIGATION).toBe("litigation");
    expect(CaseType.CORPORATE).toBe("corporate");
    expect(CaseType.CONTRACT).toBe("contract");
    expect(CaseType.REGULATORY).toBe("regulatory");
    expect(CaseType.OTHER).toBe("other");
  });
});

describe("LegalArea Enum", () => {
  it("should have correct values", () => {
    expect(LegalArea.OR).toBe("or");
    expect(LegalArea.ZGB).toBe("zgb");
    expect(LegalArea.STGB).toBe("stgb");
    expect(LegalArea.ZPO).toBe("zpo");
    expect(LegalArea.STPO).toBe("stpo");
    expect(LegalArea.SCHKG).toBe("schkg");
    expect(LegalArea.VWG).toBe("vwg");
    expect(LegalArea.OTHER).toBe("other");
  });
});
