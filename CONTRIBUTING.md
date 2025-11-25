# Contributing to BetterCallClaude

Thank you for your interest in contributing to BetterCallClaude! This document provides guidelines and instructions for contributing.

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

---

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)
   - Relevant logs or screenshots

### Suggesting Features

1. **Check the roadmap** in README.md for planned features
2. **Open a discussion** to propose new ideas
3. **Provide context**: Use case, benefits, implementation ideas

### Contributing Code

#### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude

# Install dependencies
npm install

# Build MCP servers
cd mcp-servers && npm install && npm run build
cd ..

# Run tests
npm test
```

#### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes** following our code standards
4. **Write tests** for new functionality
5. **Run the test suite**:
   ```bash
   npm test
   ```
6. **Commit with conventional messages**:
   ```bash
   git commit -m "feat(scope): add new feature"
   git commit -m "fix(scope): resolve bug"
   git commit -m "docs(scope): update documentation"
   ```
7. **Push and create a Pull Request**

---

## Code Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use ESLint configuration provided
- Maintain >80% test coverage

### Documentation

- Update relevant docs for any changes
- Include JSDoc comments for public APIs
- Provide examples for new features

### Legal Accuracy

- Verify all Swiss law references
- Use correct citation formats (BGE/ATF/DTF)
- Include multi-lingual terminology where applicable

### Multi-Lingual Support

- Provide translations for DE/FR/IT when adding user-facing content
- Use proper legal terminology in each language

---

## Priority Contribution Areas

### High Priority

- **Additional Cantons**: Expand to all 26 Swiss cantons
- **Test Coverage**: Improve integration and E2E tests
- **Documentation**: Workflow examples and tutorials

### Medium Priority

- **Commercial Database Integrations**: Swisslex, Weblaw plugins
- **Local LLM Support**: Ollama integration
- **Performance Optimization**: Query caching, parallel processing

### Good First Issues

Look for issues labeled `good-first-issue` for beginner-friendly contributions.

---

## Pull Request Process

1. **Ensure all tests pass**
2. **Update documentation** as needed
3. **Add your changes to CHANGELOG.md** (if applicable)
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** if requested

### PR Title Format

Use conventional commit format:
- `feat(agents): add new research capability`
- `fix(mcp): resolve connection timeout`
- `docs(readme): update installation guide`

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific package tests
cd packages/agents && npm test

# Run MCP server tests
cd mcp-servers/entscheidsuche && npm test
```

### Writing Tests

- Use Vitest for TypeScript packages
- Use pytest for Python components
- Include both unit and integration tests
- Mock external services appropriately

---

## Questions?

- **GitHub Issues**: For bugs and feature requests
- **Email**: federico@cesconi.com for general questions

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

*Thank you for helping improve BetterCallClaude for the Swiss legal community!*
