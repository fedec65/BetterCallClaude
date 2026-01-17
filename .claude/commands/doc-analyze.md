# Legal Document Analysis Command

Analyze Swiss legal documents and court decisions using MCP server tools and AI-powered legal analysis.

## Purpose
Perform comprehensive analysis of legal documents, court decisions, statutes, and legal briefs with focus on Swiss law context.

## MCP Server Integration

This command integrates with all available MCP servers:
- **bge-search**: Citation extraction and validation
- **entscheidsuche**: Decision context and precedent
- **Sequential thinking**: Multi-step legal reasoning (if available)

## Analysis Capabilities

### 1. Document Type Detection
Automatically identify document type:
- Court decisions (BGE, cantonal, district)
- Legal briefs and submissions
- Statutes and regulations
- Contracts and agreements
- Legal opinions and memoranda

### 2. Structural Analysis
Extract and analyze document structure:
- **Headings and sections**: Identify organization
- **Legal issues presented**: Core questions of law
- **Facts summary**: Relevant factual background
- **Legal reasoning**: Analysis and application
- **Holdings and conclusions**: Outcomes and rules
- **Citations**: References to authority

### 3. Citation Analysis
Using `bge-search` MCP server:
- Extract all legal citations from document
- Validate citation formats with `validate_citation`
- Retrieve cited decisions with `get_bge_decision`
- Verify citation accuracy and context
- Identify missing or miscited authorities

### 4. Precedent Contextualization
Using `entscheidsuche` MCP server:
- Find related decisions with `get_related_decisions`
- Analyze how cited cases relate to document's arguments
- Identify additional relevant precedent
- Check for superseded or overruled authority
- Map precedent network

### 5. Legal Reasoning Analysis
Break down legal arguments step-by-step:
- Identify logical structure (syllogism, analogy, policy)
- Evaluate argument strength
- Spot logical gaps or fallacies
- Suggest counter-arguments

### 6. Multi-Lingual Support
Handle Swiss legal multilingualism:
- German (Deutsch)
- French (Français)
- Italian (Italiano)
- Provide translations where needed

## Analysis Framework

### Legal Issue Identification (IRAC Method)
- **Issue**: What is the legal question?
- **Rule**: What law or precedent applies?
- **Application**: How does law apply to facts?
- **Conclusion**: What is the outcome?

### Argument Structure Analysis
```
Premise 1: [Legal rule from statute/precedent]
Premise 2: [Factual assertion]
─────────────────────────────────────────
Conclusion: [Legal consequence]

Strength: [Strong/Moderate/Weak]
Basis: [Authority cited, facts established, logical validity]
Vulnerabilities: [Counter-arguments, factual disputes]
```

## Integration with Other Commands

- Use `/swiss:federal` to find federal decisions mentioned
- Use `/swiss:precedent` for deep precedent analysis
- Use `/legal:cite` to format citations properly

## Privacy & Confidentiality

⚠️ **Important**: Never store or remember confidential client documents
- Analyze only for current session
- Don't include confidential facts in examples
- Redact sensitive information in outputs
