# BetterCallClaude Code Structure

## Directory Layout

```
BetterCallClaude/
├── .claude/                    # Framework configuration
│   ├── BETTERASK.md           # Main entry point
│   ├── LEGAL_PRINCIPLES.md    # Swiss legal reasoning standards
│   ├── LEGAL_SYMBOLS.md       # Citation formatting symbols
│   ├── SWISS_LAW_CONFIG.md    # Jurisdiction routing system
│   ├── personas/              # Legal expert personas
│   │   ├── PERSONA_Legal_Researcher.md  (✓ Complete)
│   │   ├── PERSONA_Case_Strategist.md   (In Progress)
│   │   └── PERSONA_Legal_Drafter.md     (In Progress)
│   ├── modes/                 # Swiss law operation modes
│   │   ├── MODE_Federal_Law.md         (In Progress)
│   │   ├── MODE_Cantonal_Law.md        (In Progress)
│   │   └── MODE_Multi_Lingual.md       (In Progress)
│   └── mcp/                   # MCP server documentation
│       ├── MCP_Entscheidsuche.md       (In Progress)
│       └── MCP_Legal_Citations.md      (In Progress)
│
├── src/                       # Python source code
│   ├── core/
│   │   ├── cache/            # Caching infrastructure
│   │   │   └── citation_cache.py
│   │   ├── mcp/              # MCP integration
│   │   │   ├── protocol.py
│   │   │   ├── connection_manager.py
│   │   │   └── adapters/     # MCP server adapters
│   │   │       ├── bge_search.py
│   │   │       ├── entscheidsuche.py
│   │   │       └── cantonal_courts.py
│   │   ├── personas/         # Persona activation logic
│   │   │   └── activator.py
│   │   ├── commands/         # Command registry and handlers
│   │   │   ├── base.py
│   │   │   ├── registry.py
│   │   │   ├── legal_research.py
│   │   │   └── legal_help.py
│   │   └── config/           # Configuration management
│   ├── tests/
│   │   ├── unit/             # Unit tests
│   │   │   ├── test_citation_cache.py
│   │   │   └── test_command_registry.py
│   │   └── integration/      # Integration tests
│   │       ├── test_mcp_protocol.py
│   │       ├── test_mcp_adapters.py
│   │       └── test_legal_research_integration.py
│   └── utils/                # Utility functions
│
├── mcp-servers/              # MCP server implementations (TypeScript)
│   ├── bge-search/           # Federal Supreme Court search
│   ├── entscheidsuche/       # Court decision search
│   ├── cantonal-courts/      # Canton-specific courts
│   ├── legal-citations/      # Citation verification
│   ├── commercial-registry/  # Swiss commercial registry
│   ├── land-registry/        # Land registry
│   └── legal-news/           # Legal news aggregation
│
├── docs/                     # Documentation
│   ├── onboarding/           # Setup guides
│   └── workflows/            # Legal workflow documentation
│
└── version-manager/          # Version control system
```

## Python Package Structure

### Core Module (`src/core/`)
- **cache/**: Citation and decision caching with TTL support
- **mcp/**: MCP protocol implementation and server adapters
- **personas/**: Legal persona activation and routing logic
- **commands/**: Command registry for legal operations
- **config/**: Configuration management

### Testing Structure (`src/tests/`)
- **unit/**: Isolated component tests (citation cache, command registry)
- **integration/**: Cross-component tests (MCP protocol, legal research workflows)

## MCP Servers (TypeScript)
- Workspace-based monorepo using npm workspaces
- Each server is independent but shares common dependencies
- TypeScript with strict type checking
- Jest for testing
- ESLint + Prettier for code quality

## Key Design Patterns
- Persona-based AI activation (Legal Researcher, Case Strategist, Legal Drafter)
- Mode-based jurisdiction routing (Federal, Cantonal, Multi-lingual)
- MCP server abstraction for external data sources
- Citation verification pipeline with caching
- Multi-lingual terminology management
