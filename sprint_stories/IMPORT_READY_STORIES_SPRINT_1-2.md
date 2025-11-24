# Import-Ready Story Cards: Sprint 1-2

**Format Support**: Jira CSV, Linear JSON, GitHub Issues, Trello
**Total Stories**: 12 (Sprint 1: 6, Sprint 2: 6)
**Total Story Points**: 75

---

## 📋 Jira CSV Import (Copy-Paste Ready)

```csv
Summary,Issue Type,Priority,Story Points,Assignee,Description,Acceptance Criteria,Epic Link,Sprint,Labels,Estimated Hours
"Command Registry System",Story,Highest,8,Developer A,"As a developer, I need a centralized command registry system so that commands can be auto-discovered, routed, and executed with proper argument validation and error handling.","- BaseCommand abstract class with metadata
- CommandRegistry with auto-discovery
- Command router with argument parsing
- Error handling for invalid commands
- Unit tests: >85% coverage",Foundation,Sprint 1,"backend,foundation,critical",16h
"/legal:research Command (Basic)",Story,High,5,Developer A,"As a Swiss lawyer, I need a /legal:research command to search legal sources so that I can find relevant precedents and statutes.","- Accepts query string and optional filters
- Returns structured results
- Help text with usage examples
- Error handling for empty queries
- Integration test with mock legal database",Commands,Sprint 1,"backend,commands",10h
"/legal:help Command System",Story,High,3,Developer A,"As a user, I need a /legal:help command to view available commands and their usage.","- Lists all registered commands
- Detailed help per command
- Categorizes commands
- Examples for each command
- Unit tests: >90% coverage",Commands,Sprint 1,"backend,commands",6h
"SQLite Citation Cache",Story,High,5,Developer B,"As a developer, I need a SQLite-based citation cache for quick access to frequently accessed legal citations.","- SQLite database schema for citations
- Cache hit/miss logic with TTL
- CRUD operations
- Automatic expiration
- Unit tests: >85% coverage",Infrastructure,Sprint 1,"backend,infrastructure,database",10h
"MCP Server Connection Manager",Story,Highest,8,Developer B,"As a developer, I need an MCP connection manager to handle connections to multiple MCP servers.","- MCPConnectionManager class
- Connection pooling
- Retry logic with exponential backoff
- Error handling for server unavailability
- Health check endpoints
- Unit tests: >85% coverage",Infrastructure,Sprint 1,"backend,infrastructure,mcp,critical",16h
"Persona Activation Framework",Story,High,5,Developer B,"As a developer, I need a persona activation framework for automatic legal expert persona activation.","- PersonaActivator class with registry
- Auto-activation based on command metadata
- Context injection for activated personas
- Persona switching mechanism
- Unit tests: >85% coverage",Personas,Sprint 1,"backend,personas",10h
"BGE Search MCP Server",Story,Highest,13,Developer A,"As a Swiss lawyer, I need an MCP server that scrapes BGE.ch for federal court precedents.","- MCP server in TypeScript
- BGE.ch scraping with rate limiting
- Citation extraction and parsing
- Relevance ranking algorithm
- Caching layer (24-hour TTL)
- Error handling
- Jest unit tests: >85% coverage",MCP Servers,Sprint 2,"mcp,typescript,scraping,critical",26h
"Entscheidsuche MCP Server",Story,Highest,10,Developer A,"As a Swiss lawyer, I need an MCP server for Entscheidsuche.ch to search federal court decisions.","- MCP server in TypeScript
- Federal court search integration
- Result normalization
- Caching layer (24-hour TTL)
- Error handling
- Jest unit tests: >85% coverage",MCP Servers,Sprint 2,"mcp,typescript,critical",20h
"/swiss:federal Command",Story,High,5,Developer B,"As a Swiss lawyer, I need a /swiss:federal command to research federal law sources in a unified interface.","- Integrates BGE Search MCP + Entscheidsuche MCP
- Accepts query + filters
- Returns ranked results from both MCPs
- Deduplicates results
- Help text with examples",Commands,Sprint 2,"backend,commands,mcp-integration",10h
"/swiss:precedent Command",Story,High,5,Developer B,"As a Swiss lawyer, I need a /swiss:precedent command for BGE precedent search with advanced filtering.","- Integrates BGE Search MCP only
- Advanced filters (legal area, court chamber)
- Citation-based search
- Precedent hierarchy visualization
- Help text with examples",Commands,Sprint 2,"backend,commands,mcp-integration",10h
"/doc:analyze Command",Story,Medium,5,Developer B,"As a Swiss lawyer, I need a /doc:analyze command to analyze legal documents for citations and legal issues.","- Accepts file path or text input
- Extracts citations (BGE, cantonal, statutes)
- Identifies legal issues
- Detects jurisdiction
- Returns structured analysis report",Commands,Sprint 2,"backend,commands",10h
"Enhanced /legal:cite Command",Story,Medium,3,Developer B,"As a Swiss lawyer, I need /legal:cite to verify citations using BGE Search MCP.","- Accepts citation string
- Queries BGE Search MCP for verification
- Returns citation validity + full case details
- Suggests corrections for malformed citations
- Unit tests: >85% coverage",Commands,Sprint 2,"backend,commands,mcp-integration,enhancement",6h
```

---

## 🔷 Linear JSON Import (API-Ready)

```json
[
  {
    "title": "Command Registry System",
    "description": "As a developer, I need a centralized command registry system so that commands can be auto-discovered, routed, and executed with proper argument validation and error handling.\n\n**Acceptance Criteria:**\n- BaseCommand abstract class with metadata\n- CommandRegistry with auto-discovery\n- Command router with argument parsing\n- Error handling for invalid commands\n- Unit tests: >85% coverage",
    "priority": 1,
    "estimate": 8,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-1",
    "projectId": "foundation",
    "labelIds": ["backend", "foundation", "critical"],
    "assigneeId": "developer-a",
    "state": "Backlog"
  },
  {
    "title": "/legal:research Command (Basic)",
    "description": "As a Swiss lawyer, I need a /legal:research command to search legal sources so that I can find relevant precedents and statutes.\n\n**Acceptance Criteria:**\n- Accepts query string and optional filters\n- Returns structured results\n- Help text with usage examples\n- Error handling for empty queries\n- Integration test with mock legal database",
    "priority": 1,
    "estimate": 5,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-1",
    "projectId": "commands",
    "labelIds": ["backend", "commands"],
    "assigneeId": "developer-a",
    "state": "Backlog"
  },
  {
    "title": "/legal:help Command System",
    "description": "As a user, I need a /legal:help command to view available commands and their usage.\n\n**Acceptance Criteria:**\n- Lists all registered commands\n- Detailed help per command\n- Categorizes commands\n- Examples for each command\n- Unit tests: >90% coverage",
    "priority": 2,
    "estimate": 3,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-1",
    "projectId": "commands",
    "labelIds": ["backend", "commands"],
    "assigneeId": "developer-a",
    "state": "Backlog"
  },
  {
    "title": "SQLite Citation Cache",
    "description": "As a developer, I need a SQLite-based citation cache for quick access to frequently accessed legal citations.\n\n**Acceptance Criteria:**\n- SQLite database schema for citations\n- Cache hit/miss logic with TTL\n- CRUD operations\n- Automatic expiration\n- Unit tests: >85% coverage",
    "priority": 2,
    "estimate": 5,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-1",
    "projectId": "infrastructure",
    "labelIds": ["backend", "infrastructure", "database"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  },
  {
    "title": "MCP Server Connection Manager",
    "description": "As a developer, I need an MCP connection manager to handle connections to multiple MCP servers.\n\n**Acceptance Criteria:**\n- MCPConnectionManager class\n- Connection pooling\n- Retry logic with exponential backoff\n- Error handling for server unavailability\n- Health check endpoints\n- Unit tests: >85% coverage",
    "priority": 1,
    "estimate": 8,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-1",
    "projectId": "infrastructure",
    "labelIds": ["backend", "infrastructure", "mcp", "critical"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  },
  {
    "title": "Persona Activation Framework",
    "description": "As a developer, I need a persona activation framework for automatic legal expert persona activation.\n\n**Acceptance Criteria:**\n- PersonaActivator class with registry\n- Auto-activation based on command metadata\n- Context injection for activated personas\n- Persona switching mechanism\n- Unit tests: >85% coverage",
    "priority": 2,
    "estimate": 5,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-1",
    "projectId": "personas",
    "labelIds": ["backend", "personas"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  },
  {
    "title": "BGE Search MCP Server",
    "description": "As a Swiss lawyer, I need an MCP server that scrapes BGE.ch for federal court precedents.\n\n**Acceptance Criteria:**\n- MCP server in TypeScript\n- BGE.ch scraping with rate limiting\n- Citation extraction and parsing\n- Relevance ranking algorithm\n- Caching layer (24-hour TTL)\n- Error handling\n- Jest unit tests: >85% coverage",
    "priority": 1,
    "estimate": 13,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-2",
    "projectId": "mcp-servers",
    "labelIds": ["mcp", "typescript", "scraping", "critical"],
    "assigneeId": "developer-a",
    "state": "Backlog"
  },
  {
    "title": "Entscheidsuche MCP Server",
    "description": "As a Swiss lawyer, I need an MCP server for Entscheidsuche.ch to search federal court decisions.\n\n**Acceptance Criteria:**\n- MCP server in TypeScript\n- Federal court search integration\n- Result normalization\n- Caching layer (24-hour TTL)\n- Error handling\n- Jest unit tests: >85% coverage",
    "priority": 1,
    "estimate": 10,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-2",
    "projectId": "mcp-servers",
    "labelIds": ["mcp", "typescript", "critical"],
    "assigneeId": "developer-a",
    "state": "Backlog"
  },
  {
    "title": "/swiss:federal Command",
    "description": "As a Swiss lawyer, I need a /swiss:federal command to research federal law sources in a unified interface.\n\n**Acceptance Criteria:**\n- Integrates BGE Search MCP + Entscheidsuche MCP\n- Accepts query + filters\n- Returns ranked results from both MCPs\n- Deduplicates results\n- Help text with examples",
    "priority": 2,
    "estimate": 5,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-2",
    "projectId": "commands",
    "labelIds": ["backend", "commands", "mcp-integration"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  },
  {
    "title": "/swiss:precedent Command",
    "description": "As a Swiss lawyer, I need a /swiss:precedent command for BGE precedent search with advanced filtering.\n\n**Acceptance Criteria:**\n- Integrates BGE Search MCP only\n- Advanced filters (legal area, court chamber)\n- Citation-based search\n- Precedent hierarchy visualization\n- Help text with examples",
    "priority": 2,
    "estimate": 5,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-2",
    "projectId": "commands",
    "labelIds": ["backend", "commands", "mcp-integration"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  },
  {
    "title": "/doc:analyze Command",
    "description": "As a Swiss lawyer, I need a /doc:analyze command to analyze legal documents for citations and legal issues.\n\n**Acceptance Criteria:**\n- Accepts file path or text input\n- Extracts citations (BGE, cantonal, statutes)\n- Identifies legal issues\n- Detects jurisdiction\n- Returns structured analysis report",
    "priority": 3,
    "estimate": 5,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-2",
    "projectId": "commands",
    "labelIds": ["backend", "commands"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  },
  {
    "title": "Enhanced /legal:cite Command",
    "description": "As a Swiss lawyer, I need /legal:cite to verify citations using BGE Search MCP.\n\n**Acceptance Criteria:**\n- Accepts citation string\n- Queries BGE Search MCP for verification\n- Returns citation validity + full case details\n- Suggests corrections for malformed citations\n- Unit tests: >85% coverage",
    "priority": 3,
    "estimate": 3,
    "teamId": "bettercallclaude-dev",
    "cycleId": "sprint-2",
    "projectId": "commands",
    "labelIds": ["backend", "commands", "mcp-integration", "enhancement"],
    "assigneeId": "developer-b",
    "state": "Backlog"
  }
]
```

---

## 🐙 GitHub Issues Import (CLI or Web)

### Using GitHub CLI (`gh`)
```bash
# Sprint 1 Stories
gh issue create --title "Command Registry System" \
  --body "**User Story**: As a developer, I need a centralized command registry system so that commands can be auto-discovered, routed, and executed with proper argument validation and error handling.

**Acceptance Criteria:**
- [ ] BaseCommand abstract class with metadata
- [ ] CommandRegistry with auto-discovery
- [ ] Command router with argument parsing
- [ ] Error handling for invalid commands
- [ ] Unit tests: >85% coverage

**Story Points**: 8
**Assignee**: Developer A
**Sprint**: Sprint 1" \
  --label "backend,foundation,critical" \
  --milestone "Sprint 1" \
  --assignee developer-a

gh issue create --title "/legal:research Command (Basic)" \
  --body "**User Story**: As a Swiss lawyer, I need a /legal:research command to search legal sources so that I can find relevant precedents and statutes.

**Acceptance Criteria:**
- [ ] Accepts query string and optional filters
- [ ] Returns structured results
- [ ] Help text with usage examples
- [ ] Error handling for empty queries
- [ ] Integration test with mock legal database

**Story Points**: 5
**Assignee**: Developer A
**Sprint**: Sprint 1" \
  --label "backend,commands" \
  --milestone "Sprint 1" \
  --assignee developer-a

# ... (repeat for all 12 stories)
```

### GitHub Issues Bulk Import Template (YAML)
```yaml
- title: "Command Registry System"
  body: |
    **User Story**: As a developer, I need a centralized command registry system...

    **Acceptance Criteria:**
    - [ ] BaseCommand abstract class with metadata
    - [ ] CommandRegistry with auto-discovery
    - [ ] Command router with argument parsing
    - [ ] Error handling for invalid commands
    - [ ] Unit tests: >85% coverage

    **Story Points**: 8
    **Estimated Hours**: 16h
  labels: ["backend", "foundation", "critical"]
  milestone: "Sprint 1"
  assignees: ["developer-a"]

- title: "/legal:research Command (Basic)"
  body: |
    **User Story**: As a Swiss lawyer, I need a /legal:research command...

    **Acceptance Criteria:**
    - [ ] Accepts query string and optional filters
    - [ ] Returns structured results
    - [ ] Help text with usage examples
    - [ ] Error handling for empty queries
    - [ ] Integration test with mock legal database

    **Story Points**: 5
    **Estimated Hours**: 10h
  labels: ["backend", "commands"]
  milestone: "Sprint 1"
  assignees: ["developer-a"]
```

---

## 📊 Trello Board Import (JSON for Power-Up)

```json
{
  "name": "BetterCallClaude v2.0 Sprint 1-2",
  "lists": [
    {
      "name": "Sprint 1 Backlog",
      "cards": [
        {
          "name": "Command Registry System",
          "desc": "**Story Points**: 8\n**Priority**: Highest\n**Assignee**: Developer A\n\n**User Story**: As a developer, I need a centralized command registry system so that commands can be auto-discovered, routed, and executed with proper argument validation and error handling.\n\n**Acceptance Criteria:**\n- [ ] BaseCommand abstract class with metadata\n- [ ] CommandRegistry with auto-discovery\n- [ ] Command router with argument parsing\n- [ ] Error handling for invalid commands\n- [ ] Unit tests: >85% coverage\n\n**Estimated Hours**: 16h",
          "labels": ["backend", "foundation", "critical"],
          "due": "2025-01-31"
        },
        {
          "name": "/legal:research Command (Basic)",
          "desc": "**Story Points**: 5\n**Priority**: High\n**Assignee**: Developer A\n\n**User Story**: As a Swiss lawyer, I need a /legal:research command to search legal sources so that I can find relevant precedents and statutes.\n\n**Acceptance Criteria:**\n- [ ] Accepts query string and optional filters\n- [ ] Returns structured results\n- [ ] Help text with usage examples\n- [ ] Error handling for empty queries\n- [ ] Integration test with mock legal database\n\n**Estimated Hours**: 10h",
          "labels": ["backend", "commands"],
          "due": "2025-01-31"
        }
      ]
    },
    {
      "name": "Sprint 2 Backlog",
      "cards": [
        {
          "name": "BGE Search MCP Server",
          "desc": "**Story Points**: 13\n**Priority**: Highest\n**Assignee**: Developer A\n\n**User Story**: As a Swiss lawyer, I need an MCP server that scrapes BGE.ch for federal court precedents.\n\n**Acceptance Criteria:**\n- [ ] MCP server in TypeScript\n- [ ] BGE.ch scraping with rate limiting\n- [ ] Citation extraction and parsing\n- [ ] Relevance ranking algorithm\n- [ ] Caching layer (24-hour TTL)\n- [ ] Error handling\n- [ ] Jest unit tests: >85% coverage\n\n**Estimated Hours**: 26h",
          "labels": ["mcp", "typescript", "scraping", "critical"],
          "due": "2025-02-14"
        }
      ]
    }
  ]
}
```

---

## 📝 Sprint Summary Cards

### Sprint 1 Summary
```
Sprint 1: Foundation & Core Command System
Duration: Weeks 1-2 (Jan 20 - Jan 31, 2025)

Total Story Points: 34
Total Stories: 6
Total Estimated Hours: 68h

Developer A (34h):
  - STORY-1.1: Command Registry System (16h)
  - STORY-1.2: /legal:research Command (10h)
  - STORY-1.3: /legal:help Command (6h)

Developer B (34h):
  - STORY-1.4: SQLite Citation Cache (10h)
  - STORY-1.5: MCP Server Connection Manager (16h)
  - STORY-1.6: Persona Activation Framework (10h)

Legal Consultant (8h):
  - Validate BGE citation format specifications (2h)
  - Review federal law source prioritization logic (2h)
  - Provide sample legal research queries for testing (4h)

Sprint Goal:
  ✅ Command registry operational
  ✅ 3 commands working (/legal:research, /legal:help, /legal:cite)
  ✅ MCP connection framework ready for server integration

Acceptance Criteria:
  - Commands execute with proper argument validation
  - Error handling for invalid inputs
  - Help system shows command documentation
  - Unit tests: 80%+ coverage
```

### Sprint 2 Summary
```
Sprint 2: First MCP Servers & Enhanced Commands
Duration: Weeks 3-4 (Feb 3 - Feb 14, 2025)

Total Story Points: 41
Total Stories: 6
Total Estimated Hours: 82h

Developer A (46h):
  - STORY-2.1: BGE Search MCP Server (26h)
  - STORY-2.2: Entscheidsuche MCP Server (20h)

Developer B (36h):
  - STORY-2.3: /swiss:federal Command (10h)
  - STORY-2.4: /swiss:precedent Command (10h)
  - STORY-2.5: /doc:analyze Command (10h)
  - STORY-2.6: Enhanced /legal:cite Command (6h)

Legal Consultant (8h):
  - Test BGE Search accuracy (sample 50 citations) (4h)
  - Validate federal law prioritization (2h)
  - Provide cantonal law comparison examples (2h)

Sprint Goal:
  ✅ BGE Search MCP + Entscheidsuche MCP operational
  ✅ 6 total commands working
  ✅ Citation accuracy >85% on federal cases

Acceptance Criteria:
  - BGE Search returns relevant cases within 3 seconds
  - Entscheidsuche handles all federal court types
  - Commands correctly route to appropriate MCP servers
  - Integration tests passing
```

---

## 🔗 Import Instructions

### Jira Import
1. Navigate to your Jira project
2. Go to **Issues** → **Import Issues from CSV**
3. Copy the CSV content above
4. Paste into import dialog
5. Map fields: Summary → Summary, Description → Description, etc.
6. Verify and import

### Linear Import
1. Use Linear API or bulk import tool
2. Copy JSON array above
3. POST to `/api/issues/bulk-create` endpoint
4. Or use Linear CLI: `linear issue create --from-file stories.json`

### GitHub Issues Import
1. Use GitHub CLI (`gh issue create`) as shown above
2. Or use GitHub's issue templates
3. Bulk import via GitHub API with Python script

### Trello Import
1. Use Trello's "Import JSON" Power-Up
2. Or manually create cards from JSON structure
3. Export from other tools (Jira, etc.) and import to Trello

---

**Document Version**: 1.0
**Last Updated**: 2025-01-17
**Format**: Multi-platform import-ready
**Total Stories**: 12 (Sprint 1-2)
**Total Story Points**: 75
