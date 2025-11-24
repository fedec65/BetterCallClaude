# BetterCallClaude Suggested Commands

## Development Workflow Commands

### Python Backend

#### Testing
```bash
# Run all tests with coverage
pytest

# Run with detailed coverage report
pytest --cov=src --cov-report=html --cov-report=term-missing

# Run specific test file
pytest src/tests/unit/test_citation_cache.py

# Run specific test function
pytest src/tests/unit/test_citation_cache.py::test_cache_hit

# Run only integration tests
pytest src/tests/integration/

# Run only unit tests
pytest src/tests/unit/
```

#### Code Quality
```bash
# Format code with Black
black .

# Check formatting without changes
black --check .

# Lint with Ruff
ruff check .

# Auto-fix linting issues
ruff check --fix .

# Type check with Mypy
mypy src/

# Run all pre-commit hooks manually
pre-commit run --all-files
```

#### Pre-commit Setup
```bash
# Install pre-commit hooks (one-time)
pre-commit install

# Update hook versions
pre-commit autoupdate
```

### TypeScript MCP Servers

#### Build
```bash
# Build all workspace MCP servers
cd mcp-servers && npm run build

# Build specific server
cd mcp-servers/bge-search && npm run build
```

#### Testing
```bash
# Test all MCP servers
cd mcp-servers && npm test

# Test specific server
cd mcp-servers/entscheidsuche && npm test
```

#### Code Quality
```bash
# Lint all servers
cd mcp-servers && npm run lint

# Format with Prettier
cd mcp-servers && npm run format
```

#### Development
```bash
# Start development mode (if applicable)
cd mcp-servers && npm run dev
```

## Git Workflow Commands

### Basic Git Operations
```bash
# Check current status and branch
git status && git branch

# Create feature branch
git checkout -b feature/legal-drafter-persona

# Stage changes
git add .

# Commit (triggers pre-commit hooks)
git commit -m "feat: implement Legal Drafter persona"

# Push to remote
git push origin feature/legal-drafter-persona
```

### Git Best Practices
- Always work on feature branches, never directly on main
- Pre-commit hooks run automatically (black, ruff, mypy)
- Use descriptive commit messages with conventional commit format
- Pull latest changes before creating new branch: `git pull origin main`

## Project Management Commands

### Installation
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies for MCP servers
cd mcp-servers && npm install

# Install pre-commit hooks
pre-commit install
```

### Configuration
```bash
# Edit user configuration
nano ~/.betterask/config.yaml

# Copy framework to user config (deployment)
cp -r .claude ~/.claude/betterask/
```

## System-Specific Commands (macOS)

### File Operations
```bash
# List directory contents
ls -la

# Find files
find . -name "*.py" -type f

# Search in files (prefer Grep tool over grep command)
grep -r "BGE" --include="*.md"

# File permissions
chmod +x script.sh
```

### Process Management
```bash
# Check running processes
ps aux | grep python

# Kill process
kill -9 <PID>
```

## Documentation Commands

### Generate Documentation
```bash
# View README
cat README.md

# List all documentation
ls -R docs/

# Open specific workflow doc
cat docs/workflows/research-precedents.md
```

## Quick Verification Checklist

After completing a development task, run:
```bash
# 1. Format code
black .

# 2. Fix linting issues
ruff check --fix .

# 3. Type check
mypy src/

# 4. Run tests
pytest

# 5. Check coverage
pytest --cov=src --cov-report=term-missing

# Or run all in one command:
black . && ruff check --fix . && mypy src/ && pytest --cov=src
```

## Troubleshooting Commands

### Clean Build Artifacts
```bash
# Remove Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Remove test coverage files
rm -rf htmlcov/ .coverage

# Remove TypeScript build artifacts
cd mcp-servers && npm run clean
```

### Reset Environment
```bash
# Recreate virtual environment
deactivate
rm -rf .venv
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Reinstall MCP dependencies
cd mcp-servers && rm -rf node_modules package-lock.json
npm install
```

## Performance Commands

### Profile Python Code
```bash
# Run with profiler
python -m cProfile -o profile.stats src/your_script.py

# View profile results
python -m pstats profile.stats
```

### Memory Usage
```bash
# Check memory usage
python -m memory_profiler src/your_script.py
```
