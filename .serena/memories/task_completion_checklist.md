# Task Completion Checklist for BetterCallClaude

## Before Marking Task Complete

### 1. Code Quality Verification
- [ ] Run `black .` to format Python code
- [ ] Run `ruff check --fix .` to auto-fix linting issues
- [ ] Run `mypy src/` to verify type correctness
- [ ] Check for any remaining linting errors: `ruff check .`
- [ ] Verify no type checking errors from mypy

### 2. Testing
- [ ] Run all tests: `pytest`
- [ ] Verify test coverage: `pytest --cov=src --cov-report=term-missing`
- [ ] Ensure coverage meets project standards (aim for >80%)
- [ ] All tests pass without failures or warnings
- [ ] Add new tests for new functionality
- [ ] Update existing tests if behavior changed

### 3. Pre-commit Validation
- [ ] Pre-commit hooks passed during commit (or run `pre-commit run --all-files`)
- [ ] No trailing whitespace
- [ ] Files end with newline
- [ ] YAML/JSON/TOML files are valid
- [ ] No merge conflicts
- [ ] No private keys detected

### 4. Documentation
- [ ] Update docstrings for new/modified functions
- [ ] Update README.md if user-facing changes
- [ ] Update IMPLEMENTATION_STATUS.md if implementation milestone reached
- [ ] Add comments for complex logic
- [ ] Update .claude/ framework files if persona/mode changes

### 5. Multi-lingual Consistency (if applicable)
- [ ] Legal terminology accurate in all supported languages (DE/FR/IT/EN)
- [ ] Citation formats correct for each language
- [ ] Terminology consistency checked against LEGAL_SYMBOLS.md

### 6. Git Workflow
- [ ] Working on feature branch (not main/master)
- [ ] Meaningful commit messages with conventional format
- [ ] Changes staged and committed: `git add . && git commit -m "..."`
- [ ] Consider pushing to remote: `git push origin <branch-name>`

### 7. MCP Server Changes (if applicable)
- [ ] TypeScript builds without errors: `cd mcp-servers && npm run build`
- [ ] MCP server tests pass: `cd mcp-servers && npm test`
- [ ] Linting passes: `cd mcp-servers && npm run lint`

### 8. Integration Testing (for cross-component changes)
- [ ] Integration tests pass: `pytest src/tests/integration/`
- [ ] Persona activation works correctly
- [ ] MCP server adapters function as expected
- [ ] Multi-lingual mode handles all languages

### 9. Legal Framework Compliance
- [ ] Citation accuracy verified (>95% target)
- [ ] Swiss legal reasoning standards followed (LEGAL_PRINCIPLES.md)
- [ ] Federal vs. cantonal law distinction clear
- [ ] Privacy considerations addressed (Anwaltsgeheimnis)

### 10. Performance Check
- [ ] No obvious performance regressions
- [ ] Caching implemented where appropriate
- [ ] External API calls minimized
- [ ] Memory usage reasonable

## Quick Verification Command
Run this one-liner before marking task complete:
```bash
black . && ruff check --fix . && mypy src/ && pytest --cov=src --cov-report=term-missing
```

## When to Skip Steps
- **Minor documentation changes**: Can skip testing if no code changes
- **Configuration updates**: May skip extensive testing, but verify format
- **Draft/WIP commits**: Can skip some checks, but fix before PR

## Critical Blockers (Never Skip)
- ❌ **Failing tests**: MUST be fixed before completion
- ❌ **Type errors**: MUST be resolved (mypy strict mode)
- ❌ **Broken builds**: MCP servers must build successfully
- ❌ **Security issues**: Private keys, sensitive data exposure

## Post-Completion Actions
- [ ] Update TodoWrite status to "completed"
- [ ] Write session summary if significant milestone
- [ ] Update project memories if architecture changed
- [ ] Consider creating PR if feature is complete
- [ ] Tag reviewer if collaboration needed

## Continuous Integration (Future)
When CI/CD is set up (.github/workflows/ci.yml):
- All these checks will run automatically on push
- PR cannot merge until all checks pass
- Coverage reports automatically generated
