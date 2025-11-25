/**
 * BetterCallClaude Case Management System (TypeScript)
 *
 * Provides case lifecycle management with persistence:
 * - Case creation, opening, closing, archiving
 * - Context management for agent executions
 * - Findings, parties, deadlines, documents tracking
 * - Export functionality (JSON, Markdown)
 *
 * Swiss Legal Context:
 * - Federal and cantonal jurisdiction support
 * - Multi-language support (DE, FR, IT, EN)
 * - Legal domain awareness (OR, ZGB, StGB, etc.)
 */

import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import type { CaseContext, Party, Jurisdiction } from "./base";

// =============================================================================
// Enums and Constants
// =============================================================================

/**
 * Case status lifecycle states.
 */
export enum CaseStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  CLOSED = "closed",
  ARCHIVED = "archived",
}

/**
 * Types of legal cases.
 */
export enum CaseType {
  LITIGATION = "litigation",
  CORPORATE = "corporate",
  CONTRACT = "contract",
  REGULATORY = "regulatory",
  OTHER = "other",
}

/**
 * Legal areas in Swiss law.
 */
export enum LegalArea {
  OR = "or", // Obligationenrecht
  ZGB = "zgb", // Zivilgesetzbuch
  STGB = "stgb", // Strafgesetzbuch
  ZPO = "zpo", // Zivilprozessordnung
  STPO = "stpo", // Strafprozessordnung
  SCHKG = "schkg", // Schuldbetreibungs- und Konkursgesetz
  VWG = "vwg", // Verwaltungsverfahren
  OTHER = "other",
}

/**
 * Swiss cantons.
 */
export const SWISS_CANTONS = [
  "ZH",
  "BE",
  "LU",
  "UR",
  "SZ",
  "OW",
  "NW",
  "GL",
  "ZG",
  "FR",
  "SO",
  "BS",
  "BL",
  "SH",
  "AR",
  "AI",
  "SG",
  "GR",
  "AG",
  "TG",
  "TI",
  "VD",
  "VS",
  "NE",
  "GE",
  "JU",
] as const;

export type SwissCanton = (typeof SWISS_CANTONS)[number];

// =============================================================================
// Interfaces
// =============================================================================

/**
 * Extended party information.
 */
export interface ManagedParty extends Party {
  partyId: string;
  addedAt: Date;
}

/**
 * Deadline tracking.
 */
export interface Deadline {
  deadlineId: string;
  name: string;
  dueDate: Date;
  description: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

/**
 * Milestone tracking.
 */
export interface Milestone {
  milestoneId: string;
  name: string;
  date: Date;
  description: string;
  createdAt: Date;
}

/**
 * Legal issue tracking.
 */
export interface LegalIssue {
  issueId: string;
  description: string;
  legalArea: LegalArea;
  relevantArticles: string[];
  status: "open" | "resolved" | "pending";
  notes: string;
  createdAt: Date;
  resolvedAt?: Date;
}

/**
 * Agent execution record.
 */
export interface AgentExecution {
  executionId: string;
  agentId: string;
  timestamp: Date;
  task: string;
  outcome: "success" | "partial" | "failed" | "cancelled";
  summary: string;
  durationMs: number;
  deliverables: string[];
}

/**
 * Finding from research or analysis.
 */
export interface Finding {
  findingId: string;
  content: string;
  source: string;
  timestamp: Date;
  category: string;
  confidence: number;
  citations: string[];
  agentId?: string;
}

/**
 * Document reference.
 */
export interface DocumentRef {
  documentId: string;
  name: string;
  path: string;
  documentType: string;
  addedAt: Date;
  metadata: Record<string, unknown>;
}

/**
 * Full managed case context with all lifecycle fields.
 */
export interface ManagedCaseContext extends CaseContext {
  status: CaseStatus;
  firmId: string;
  userId: string;

  // Extended data
  managedParties: ManagedParty[];
  deadlines: Deadline[];
  milestones: Milestone[];
  managedLegalIssues: LegalIssue[];
  agentExecutions: AgentExecution[];
  managedFindings: Finding[];
  documents: DocumentRef[];

  // Metadata
  createdBy: string;
  updatedAt: Date;
  closedAt?: Date;
  closureReason?: string;
  archivedAt?: Date;
  workingLanguages: ("DE" | "FR" | "IT" | "EN")[];
}

/**
 * Options for creating a new case.
 */
export interface CreateCaseOptions {
  title: string;
  caseType?: CaseType;
  jurisdictionFederal?: boolean;
  jurisdictionCantons?: SwissCanton[];
  languages?: ("DE" | "FR" | "IT" | "EN")[];
  parties?: Party[];
  userId?: string;
  firmId?: string;
}

/**
 * Case listing filters.
 */
export interface ListCasesOptions {
  firmId?: string;
  status?: CaseStatus;
  limit?: number;
  offset?: number;
}

/**
 * Case summary data.
 */
export interface CaseSummary {
  caseId: string;
  title: string;
  status: CaseStatus;
  caseType: CaseType;
  partiesCount: number;
  factsCount: number;
  findingsCount: number;
  openIssuesCount: number;
  upcomingDeadlines: Deadline[];
  recentAgentExecutions: AgentExecution[];
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Storage Interface
// =============================================================================

/**
 * Abstract storage backend for cases.
 */
export interface CaseStorage {
  saveCase(caseId: string, data: ManagedCaseContext): Promise<boolean>;
  loadCase(caseId: string): Promise<ManagedCaseContext | null>;
  deleteCase(caseId: string): Promise<boolean>;
  listCases(options: ListCasesOptions): Promise<CaseIndexEntry[]>;
  caseExists(caseId: string): Promise<boolean>;
}

/**
 * Index entry for case listing.
 */
export interface CaseIndexEntry {
  caseId: string;
  title: string;
  caseType: string;
  status: string;
  firmId: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// JSON File Storage Implementation
// =============================================================================

/**
 * JSON file-based case storage.
 *
 * Stores each case as a separate JSON file with an index for fast listing.
 */
export class JSONFileCaseStorage implements CaseStorage {
  private storageDir: string;
  private indexFile: string;

  constructor(storageDir = ".bettercallclaude/cases") {
    this.storageDir = path.resolve(storageDir);
    this.indexFile = path.join(this.storageDir, "index.json");
    this.ensureStorageDir();
  }

  private ensureStorageDir(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    if (!fs.existsSync(this.indexFile)) {
      this.saveIndex({});
    }
  }

  private getCaseFile(caseId: string): string {
    const safeId = caseId.replace(/[^a-zA-Z0-9-_]/g, "_");
    return path.join(this.storageDir, `${safeId}.json`);
  }

  private loadIndex(): Record<string, CaseIndexEntry> {
    try {
      if (fs.existsSync(this.indexFile)) {
        const content = fs.readFileSync(this.indexFile, "utf-8");
        return JSON.parse(content);
      }
    } catch (error) {
      console.error("Failed to load case index:", error);
    }
    return {};
  }

  private saveIndex(index: Record<string, CaseIndexEntry>): void {
    try {
      fs.writeFileSync(this.indexFile, JSON.stringify(index, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to save case index:", error);
    }
  }

  async saveCase(caseId: string, data: ManagedCaseContext): Promise<boolean> {
    try {
      const caseFile = this.getCaseFile(caseId);

      // Save full case data
      fs.writeFileSync(
        caseFile,
        JSON.stringify(data, null, 2),
        "utf-8"
      );

      // Update index
      const index = this.loadIndex();
      index[caseId] = {
        caseId,
        title: data.title,
        caseType: data.caseType,
        status: data.status,
        firmId: data.firmId,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
      };
      this.saveIndex(index);

      console.log(`Saved case ${caseId} to ${caseFile}`);
      return true;
    } catch (error) {
      console.error(`Failed to save case ${caseId}:`, error);
      return false;
    }
  }

  async loadCase(caseId: string): Promise<ManagedCaseContext | null> {
    try {
      const caseFile = this.getCaseFile(caseId);

      if (!fs.existsSync(caseFile)) {
        console.warn(`Case file not found: ${caseFile}`);
        return null;
      }

      const content = fs.readFileSync(caseFile, "utf-8");
      const data = JSON.parse(content);

      // Convert date strings back to Date objects
      data.createdAt = new Date(data.createdAt);
      data.updatedAt = new Date(data.updatedAt);
      if (data.closedAt) data.closedAt = new Date(data.closedAt);
      if (data.archivedAt) data.archivedAt = new Date(data.archivedAt);

      console.log(`Loaded case ${caseId} from ${caseFile}`);
      return data as ManagedCaseContext;
    } catch (error) {
      console.error(`Failed to load case ${caseId}:`, error);
      return null;
    }
  }

  async deleteCase(caseId: string): Promise<boolean> {
    try {
      const caseFile = this.getCaseFile(caseId);

      if (fs.existsSync(caseFile)) {
        fs.unlinkSync(caseFile);
      }

      // Remove from index
      const index = this.loadIndex();
      if (index[caseId]) {
        delete index[caseId];
        this.saveIndex(index);
      }

      console.log(`Deleted case ${caseId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete case ${caseId}:`, error);
      return false;
    }
  }

  async listCases(options: ListCasesOptions): Promise<CaseIndexEntry[]> {
    const index = this.loadIndex();
    let cases = Object.values(index);

    // Apply filters
    if (options.firmId) {
      cases = cases.filter((c) => c.firmId === options.firmId);
    }
    if (options.status) {
      cases = cases.filter((c) => c.status === options.status);
    }

    // Sort by updatedAt descending
    cases.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    // Apply pagination
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 100;
    return cases.slice(offset, offset + limit);
  }

  async caseExists(caseId: string): Promise<boolean> {
    const caseFile = this.getCaseFile(caseId);
    return fs.existsSync(caseFile);
  }
}

// =============================================================================
// Case Manager
// =============================================================================

/**
 * Central case management class.
 *
 * Manages case lifecycle:
 * - Creation with jurisdiction and party setup
 * - Opening and context loading
 * - Updates (parties, facts, deadlines, findings)
 * - Closing and archiving
 * - Summary generation and export
 */
export class CaseManager {
  private storage: CaseStorage;
  private _currentCase: ManagedCaseContext | null = null;

  constructor(storage?: CaseStorage) {
    this.storage = storage ?? new JSONFileCaseStorage();
  }

  /**
   * Get the currently active case.
   */
  get currentCase(): ManagedCaseContext | null {
    return this._currentCase;
  }

  /**
   * Generate a unique case ID.
   */
  private generateCaseId(title: string): string {
    const prefix = title
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "X");
    const year = new Date().getFullYear();
    const suffix = uuidv4().substring(0, 4).toUpperCase();
    return `${prefix}-${year}-${suffix}`;
  }

  /**
   * Create a new case.
   */
  async createCase(options: CreateCaseOptions): Promise<ManagedCaseContext> {
    const caseId = this.generateCaseId(options.title);
    const now = new Date();

    const jurisdiction: Jurisdiction = {
      federal: options.jurisdictionFederal ?? true,
      cantons: options.jurisdictionCantons ?? [],
      languages: options.languages ?? ["DE"],
    };

    // Convert parties to managed parties
    const managedParties: ManagedParty[] = (options.parties ?? []).map((p) => ({
      ...p,
      partyId: uuidv4(),
      addedAt: now,
    }));

    const newCase: ManagedCaseContext = {
      caseId,
      title: options.title,
      caseType: options.caseType ?? CaseType.OTHER,
      jurisdiction,
      parties: options.parties ?? [],
      facts: [],
      legalIssues: [],
      agentHistory: [],
      findings: {},
      createdAt: now,
      status: CaseStatus.ACTIVE,
      firmId: options.firmId ?? "default",
      userId: options.userId ?? "anonymous",
      managedParties,
      deadlines: [],
      milestones: [],
      managedLegalIssues: [],
      agentExecutions: [],
      managedFindings: [],
      documents: [],
      createdBy: options.userId ?? "anonymous",
      updatedAt: now,
      workingLanguages: options.languages ?? ["DE"],
    };

    await this.storage.saveCase(caseId, newCase);
    this._currentCase = newCase;

    console.log(`Created case: ${caseId} - ${options.title}`);
    return newCase;
  }

  /**
   * Open an existing case.
   */
  async openCase(caseId: string): Promise<ManagedCaseContext | null> {
    const caseData = await this.storage.loadCase(caseId);
    if (caseData) {
      this._currentCase = caseData;
      console.log(`Opened case: ${caseId} - ${caseData.title}`);
    }
    return caseData;
  }

  /**
   * Close a case.
   */
  async closeCase(caseId?: string, reason?: string): Promise<boolean> {
    const targetId = caseId ?? this._currentCase?.caseId;
    if (!targetId) {
      console.error("No case specified and no current case active");
      return false;
    }

    const caseData = await this.storage.loadCase(targetId);
    if (!caseData) {
      console.error(`Case not found: ${targetId}`);
      return false;
    }

    caseData.status = CaseStatus.CLOSED;
    caseData.closedAt = new Date();
    caseData.closureReason = reason ?? "";
    caseData.updatedAt = new Date();

    const saved = await this.storage.saveCase(targetId, caseData);

    if (this._currentCase?.caseId === targetId) {
      this._currentCase = null;
    }

    console.log(`Closed case: ${targetId}`);
    return saved;
  }

  /**
   * Archive a case.
   */
  async archiveCase(caseId?: string): Promise<boolean> {
    const targetId = caseId ?? this._currentCase?.caseId;
    if (!targetId) {
      return false;
    }

    const caseData = await this.storage.loadCase(targetId);
    if (!caseData) {
      return false;
    }

    caseData.status = CaseStatus.ARCHIVED;
    caseData.archivedAt = new Date();
    caseData.updatedAt = new Date();

    const saved = await this.storage.saveCase(targetId, caseData);

    if (this._currentCase?.caseId === targetId) {
      this._currentCase = null;
    }

    console.log(`Archived case: ${targetId}`);
    return saved;
  }

  /**
   * List cases with filtering.
   */
  async listCases(options: ListCasesOptions = {}): Promise<CaseIndexEntry[]> {
    return this.storage.listCases(options);
  }

  /**
   * Add a party to a case.
   */
  async addParty(caseId: string | undefined, party: Party): Promise<boolean> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return false;

    const managedParty: ManagedParty = {
      ...party,
      partyId: uuidv4(),
      addedAt: new Date(),
    };

    targetCase.parties.push(party);
    targetCase.managedParties.push(managedParty);
    targetCase.updatedAt = new Date();

    return this.storage.saveCase(targetCase.caseId, targetCase);
  }

  /**
   * Add a fact to a case.
   */
  async addFact(caseId: string | undefined, fact: string): Promise<boolean> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return false;

    targetCase.facts.push(fact);
    targetCase.updatedAt = new Date();

    return this.storage.saveCase(targetCase.caseId, targetCase);
  }

  /**
   * Add a deadline to a case.
   */
  async addDeadline(
    caseId: string | undefined,
    deadline: Omit<Deadline, "deadlineId" | "completed" | "createdAt">
  ): Promise<boolean> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return false;

    const fullDeadline: Deadline = {
      ...deadline,
      deadlineId: uuidv4(),
      completed: false,
      createdAt: new Date(),
    };

    targetCase.deadlines.push(fullDeadline);
    targetCase.updatedAt = new Date();

    return this.storage.saveCase(targetCase.caseId, targetCase);
  }

  /**
   * Add a finding to a case.
   */
  async addFinding(
    caseId: string | undefined,
    finding: Omit<Finding, "findingId" | "timestamp">
  ): Promise<boolean> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return false;

    const fullFinding: Finding = {
      ...finding,
      findingId: uuidv4(),
      timestamp: new Date(),
    };

    targetCase.managedFindings.push(fullFinding);
    targetCase.updatedAt = new Date();

    return this.storage.saveCase(targetCase.caseId, targetCase);
  }

  /**
   * Add a document reference to a case.
   */
  async addDocument(
    caseId: string | undefined,
    document: Omit<DocumentRef, "documentId" | "addedAt">
  ): Promise<boolean> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return false;

    const fullDocument: DocumentRef = {
      ...document,
      documentId: uuidv4(),
      addedAt: new Date(),
    };

    targetCase.documents.push(fullDocument);
    targetCase.updatedAt = new Date();

    return this.storage.saveCase(targetCase.caseId, targetCase);
  }

  /**
   * Record an agent execution.
   */
  async recordAgentExecution(
    caseId: string | undefined,
    execution: Omit<AgentExecution, "executionId" | "timestamp">
  ): Promise<boolean> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return false;

    const fullExecution: AgentExecution = {
      ...execution,
      executionId: uuidv4(),
      timestamp: new Date(),
    };

    targetCase.agentExecutions.push(fullExecution);
    targetCase.agentHistory.push(execution.agentId);
    targetCase.updatedAt = new Date();

    return this.storage.saveCase(targetCase.caseId, targetCase);
  }

  /**
   * Generate a case summary.
   */
  async generateSummary(caseId?: string): Promise<CaseSummary | null> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return null;

    const now = new Date();
    const upcomingDeadlines = targetCase.deadlines
      .filter((d) => !d.completed && d.dueDate > now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);

    const recentExecutions = [...targetCase.agentExecutions]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    const openIssuesCount = targetCase.managedLegalIssues.filter(
      (i) => i.status === "open"
    ).length;

    return {
      caseId: targetCase.caseId,
      title: targetCase.title,
      status: targetCase.status,
      caseType: targetCase.caseType as CaseType,
      partiesCount: targetCase.parties.length,
      factsCount: targetCase.facts.length,
      findingsCount: targetCase.managedFindings.length,
      openIssuesCount,
      upcomingDeadlines,
      recentAgentExecutions: recentExecutions,
      createdAt: targetCase.createdAt,
      updatedAt: targetCase.updatedAt,
    };
  }

  /**
   * Export case data.
   */
  async exportCase(
    caseId?: string,
    format: "json" | "markdown" = "json"
  ): Promise<string | null> {
    const targetCase = await this.getTargetCase(caseId);
    if (!targetCase) return null;

    if (format === "json") {
      return JSON.stringify(targetCase, null, 2);
    }

    // Markdown export
    return this.exportAsMarkdown(targetCase);
  }

  /**
   * Export case as Markdown.
   */
  private exportAsMarkdown(caseData: ManagedCaseContext): string {
    const lines: string[] = [];

    lines.push(`# Case: ${caseData.title}`);
    lines.push("");
    lines.push(`**Case ID:** ${caseData.caseId}`);
    lines.push(`**Status:** ${caseData.status}`);
    lines.push(`**Type:** ${caseData.caseType}`);
    lines.push(`**Created:** ${caseData.createdAt.toISOString()}`);
    lines.push(`**Updated:** ${caseData.updatedAt.toISOString()}`);
    lines.push("");

    // Jurisdiction
    lines.push("## Jurisdiction");
    lines.push(`- **Federal:** ${caseData.jurisdiction.federal ? "Yes" : "No"}`);
    if (caseData.jurisdiction.cantons.length > 0) {
      lines.push(`- **Cantons:** ${caseData.jurisdiction.cantons.join(", ")}`);
    }
    lines.push(`- **Languages:** ${caseData.jurisdiction.languages.join(", ")}`);
    lines.push("");

    // Parties
    if (caseData.parties.length > 0) {
      lines.push("## Parties");
      for (const party of caseData.parties) {
        lines.push(`- **${party.name}** (${party.role})`);
        if (party.contact) {
          lines.push(`  - Contact: ${party.contact}`);
        }
      }
      lines.push("");
    }

    // Facts
    if (caseData.facts.length > 0) {
      lines.push("## Facts");
      for (const fact of caseData.facts) {
        lines.push(`- ${fact}`);
      }
      lines.push("");
    }

    // Deadlines
    if (caseData.deadlines.length > 0) {
      lines.push("## Deadlines");
      for (const deadline of caseData.deadlines) {
        const status = deadline.completed ? "[x]" : "[ ]";
        lines.push(
          `- ${status} **${deadline.name}** - ${deadline.dueDate.toISOString().split("T")[0]}`
        );
        if (deadline.description) {
          lines.push(`  - ${deadline.description}`);
        }
      }
      lines.push("");
    }

    // Findings
    if (caseData.managedFindings.length > 0) {
      lines.push("## Findings");
      for (const finding of caseData.managedFindings) {
        lines.push(`### ${finding.category}`);
        lines.push(finding.content);
        lines.push(`- **Source:** ${finding.source}`);
        lines.push(`- **Confidence:** ${(finding.confidence * 100).toFixed(0)}%`);
        if (finding.citations.length > 0) {
          lines.push(`- **Citations:** ${finding.citations.join(", ")}`);
        }
        lines.push("");
      }
    }

    // Agent Executions
    if (caseData.agentExecutions.length > 0) {
      lines.push("## Agent Activity");
      for (const exec of caseData.agentExecutions) {
        lines.push(
          `- **${exec.agentId}** (${exec.timestamp.toISOString().split("T")[0]}): ${exec.task}`
        );
        lines.push(`  - Outcome: ${exec.outcome}`);
        if (exec.summary) {
          lines.push(`  - Summary: ${exec.summary}`);
        }
      }
      lines.push("");
    }

    // Documents
    if (caseData.documents.length > 0) {
      lines.push("## Documents");
      for (const doc of caseData.documents) {
        lines.push(`- **${doc.name}** (${doc.documentType})`);
        lines.push(`  - Path: ${doc.path}`);
      }
      lines.push("");
    }

    lines.push("---");
    lines.push(
      `*Exported on ${new Date().toISOString()} by BetterCallClaude*`
    );

    return lines.join("\n");
  }

  /**
   * Get the target case (specified or current).
   */
  private async getTargetCase(
    caseId?: string
  ): Promise<ManagedCaseContext | null> {
    if (caseId) {
      return this.storage.loadCase(caseId);
    }
    return this._currentCase;
  }

  /**
   * Convert ManagedCaseContext to simple CaseContext for agents.
   */
  toAgentContext(managed: ManagedCaseContext): CaseContext {
    return {
      caseId: managed.caseId,
      title: managed.title,
      caseType: managed.caseType,
      jurisdiction: managed.jurisdiction,
      parties: managed.parties,
      facts: managed.facts,
      legalIssues: managed.legalIssues,
      agentHistory: managed.agentHistory,
      findings: managed.findings,
      createdAt: managed.createdAt,
    };
  }
}

// =============================================================================
// Exports
// =============================================================================

export default CaseManager;
