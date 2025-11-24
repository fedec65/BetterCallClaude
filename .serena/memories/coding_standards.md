# BetterCallClaude Coding Standards

## Python Code Style

### Formatting
- **Tool**: Black (version 23.12.1)
- **Line Length**: 100 characters
- **Target Version**: Python 3.11
- **Command**: `black .` (auto-formats all Python files)

### Linting
- **Tool**: Ruff (version 0.1.8)
- **Rules**: E (pycodestyle errors), W (warnings), F (pyflakes), I (isort), B (bugbear), C4 (comprehensions), UP (pyupgrade)
- **Command**: `ruff check .` or `ruff check --fix .` (auto-fix)

### Type Checking
- **Tool**: Mypy (version 1.7.1)
- **Strictness**: Very strict
  - `disallow_untyped_defs = true`
  - `disallow_incomplete_defs = true`
  - `no_implicit_optional = true`
  - `strict_equality = true`
- **Command**: `mypy src/`
- **Exception**: Tests can omit type hints (`disallow_untyped_defs = false` for tests)

### Import Organization
- Standard library imports first
- Third-party imports second
- Local imports last
- Sorted alphabetically within each group
- Managed automatically by Ruff (isort rules)

### Naming Conventions
- **Files**: snake_case (e.g., `citation_cache.py`)
- **Classes**: PascalCase (e.g., `CitationCache`)
- **Functions**: snake_case (e.g., `search_decisions`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_CACHE_SIZE`)
- **Private**: prefix with underscore (e.g., `_internal_method`)

### Docstrings
- Use Google-style docstrings for all public functions and classes
- Include type information in docstring Args/Returns sections
- Example:
```python
def search_decisions(query: str, jurisdiction: str) -> List[Decision]:
    """Search for legal decisions.
    
    Args:
        query: Search query string
        jurisdiction: Canton code or "federal"
    
    Returns:
        List of Decision objects matching the query
    
    Raises:
        ValueError: If jurisdiction is invalid
    """
```

## TypeScript Code Style (MCP Servers)

### Formatting
- **Tool**: Prettier (version 3.1.1)
- **Line Length**: 100 characters
- **Command**: `npm run format` (from mcp-servers/)

### Linting
- **Tool**: ESLint with TypeScript plugin
- **Parser**: @typescript-eslint/parser
- **Command**: `npm run lint` (from mcp-servers/)

### Type Safety
- TypeScript 5.3+ with strict mode enabled
- No implicit any
- Proper interface definitions for all data structures

## Pre-commit Hooks

Configured in `.pre-commit-config.yaml`:
1. **trailing-whitespace**: Remove trailing whitespace
2. **end-of-file-fixer**: Ensure files end with newline
3. **check-yaml/json/toml**: Validate configuration files
4. **check-merge-conflict**: Prevent merge conflicts
5. **detect-private-key**: Security check for keys
6. **black**: Auto-format Python code
7. **ruff**: Auto-fix Python linting issues
8. **mypy**: Type check Python code

**Installation**: `pre-commit install`
**Manual run**: `pre-commit run --all-files`

## Testing Standards

### Python Tests
- **Framework**: Pytest (version 7.0+)
- **Coverage**: Pytest-cov with HTML reports
- **Target**: src/ directory
- **Location**: src/tests/unit/ and src/tests/integration/
- **Naming**: test_*.py files, test_* functions, Test* classes
- **Command**: `pytest` (auto-discovers tests)
- **Coverage Report**: `pytest --cov=src --cov-report=html`

### TypeScript Tests
- **Framework**: Jest (version 29.7.0)
- **Location**: Each workspace has its own tests/
- **Command**: `npm test` (from mcp-servers/)

## Legal-Specific Guidelines

### Citation Formatting
- Use LEGAL_SYMBOLS.md symbols for consistency
- German: "Art. 123 Abs. 2 OR", "BGE 145 III 229"
- French: "art. 123 al. 2 CO", "ATF 145 III 229"
- Italian: "art. 123 cpv. 2 CO", "DTF 145 III 229"

### Multi-lingual Consistency
- Maintain terminology precision across DE/FR/IT/EN
- Use proper legal terms (e.g., "Treu und Glauben" not "good faith" in German context)
- Include language markers in outputs

### Privacy Considerations
- No hardcoded API keys or sensitive data
- Client data protection (Anwaltsgeheimnis compliance)
- Audit trails for external API calls

## Git Commit Standards
- Use clear, descriptive commit messages
- Prefix with type: feat:, fix:, docs:, test:, refactor:
- Reference issue numbers when applicable
- Pre-commit hooks run automatically before commit
