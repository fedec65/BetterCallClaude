**BetterCallClaude Cheatsheet v2.2.1**

This cheatsheet provides a quick reference to the most important commands, agents, workflows, and MCP commands available in the BetterCallClaude framework.

> ⚠️ **Note (v2.2.1)**: All commands now use hyphens (`-`) instead of colons (`:`) for Windows compatibility.

---

**1. The `/legal` Command: Your Universal Gateway**

The `/legal` command is the primary entry point for all interactions with BetterCallClaude. It acts as an intelligent proxy, routing your query to the appropriate agent or workflow.

**Basic Syntax:**
`/legal [your natural language query]`

**Example:**
`/legal I need to understand the precedents for 'Werkvertrag Mängelhaftung' in the canton of Zurich.`

---

**2. Core `legal-` Commands**

These are the foundational commands for specific, direct tasks.

| Command | Description | Parameters | Example |
| :--- | :--- | :--- | :--- |
| `/legal-research` | Search Swiss legal sources for precedents and statutes. | `query` (required), `jurisdiction`, `date-from`, `date-to` | `/legal-research "rental law" --jurisdiction=ZH` |
| `/legal-draft` | Draft legal documents, such as contracts or court submissions. | `document_type` (required), `case_facts` | `/legal-draft "service agreement" --case_facts @facts.txt` |
| `/legal-strategy` | Develop case strategies and assess strengths/weaknesses. | `case_facts` (required) | `/legal-strategy @case_brief.md` |
| `/legal-help` | Display help for commands, categories, or agents. | `category`, `command` | `/legal-help --category=research` |
| `/legal-validate` | Validate a Swiss legal citation (BGE/ATF/DTF or statutory). | `citation` (required) | `/legal-validate "BGE 147 IV 73"` |
| `/legal-federal` | Search Swiss federal law. | `query` (required) | `/legal-federal "data protection act"` |
| `/legal-cantonal` | Search cantonal law for a specific canton. | `canton`, `query` (required) | `/legal-cantonal ZH "building regulations"` |
| `/legal-cite` | Validate, format, convert, or parse legal citations. | `citation` (required), `lang` | `/legal-cite "BGE 147 IV 73" --lang fr` |
| `/legal-version` | Display the version of BetterCallClaude. | - | `/legal-version` |
| `/legal-routing` | Configure routing settings for the /legal proxy. | - | `/legal-routing` |

---

**3. Document & Swiss Commands**

| Command | Description | Parameters | Example |
| :--- | :--- | :--- | :--- |
| `/doc-analyze` | Analyzes a document for legal issues. | `document` (required) | `/doc-analyze @contract.docx` |
| `/swiss-federal` | Search Swiss federal law (alias for /legal-federal). | `query` (required) | `/swiss-federal "data protection act"` |
| `/swiss-precedent`| Search for Swiss legal precedents. | `query` (required) | `/swiss-precedent "Mängelhaftung"` |

---

**4. Specialized Agents (`/agent-*`)**

Invoke specialized agents for deep expertise in specific legal domains.

| Agent Command | Description | Key Parameters | Example Usage |
| :--- | :--- | :--- | :--- |
| `/agent-researcher` | Performs in-depth legal research and precedent analysis. | `query`, `legal_domains` | `/agent-researcher "liability for defective products"` |
| `/agent-strategist` | Assists in developing litigation strategy and risk assessment. | `case_facts` | `/agent-strategist @case_brief.md` |
| `/agent-drafter` | Generates properly structured legal documents. | `document_type`, `clauses` | `/agent-drafter "employment contract"` |
| `/agent-citation` | Verifies and formats legal citations. | `citation` | `/agent-citation "BGE 147 IV 73"` |
| `/agent-compliance` | Checks for compliance with FINMA, AML/KYC regulations. | `frameworks`, `document` | `/agent-compliance assess @ops.pdf --frameworks "FINMA"` |
| `/agent-data-protection` | Analyzes documents for GDPR and Swiss nDSG/FADP compliance. | `document` | `/agent-data-protection review @contract.docx` |
| `/agent-risk` | Scores case outcomes and calculates settlement ranges. | `case_facts`, `dispute_amount` | `/agent-risk @case.md --dispute_amount 200000` |
| `/agent-procedure` | Manages procedural rules and deadlines (ZPO/StPO). | `procedure_code`, `query` | `/agent-procedure query "deadline for appeal" --code=ZPO` |
| `/agent-fiscal` | Handles tax law and double-taxation agreements. | `tax_issue`, `jurisdiction` | `/agent-fiscal "corporate tax" --jurisdiction=ZG` |
| `/agent-corporate` | Manages M&A, contracts, and corporate governance. | `transaction_type`, `documents`| `/agent-corporate review-m&a @deal_room/` |
| `/agent-realestate` | Handles real estate transactions and related documents. | `property_type`, `canton` | `/agent-realestate draft-agreement --canton=GE` |
| `/agent-translator` | Provides high-quality legal translations (DE/FR/IT/EN). | `text`, `source_lang`, `target_lang` | `/agent-translator "..." --source_lang=de --target_lang=en` |
| `/agent-cantonal` | Specializes in the laws of the 26 Swiss cantons. | `canton`, `query` | `/agent-cantonal --canton=BE "building regulations"` |
| `/agent-orchestrator` | Coordinates complex workflows between multiple agents. | `workflow` (required) | `/agent-orchestrator --workflow "Due Diligence"` |

---

**5. Workflows: Automating Complex Tasks**

Combine multiple agents into a single, powerful command using the `--workflow` flag.

| Workflow | Agent Sequence | Description | Example |
| :--- | :--- | :--- | :--- |
| **Due Diligence** | `researcher`, `corporate`, `risk` | Conducts comprehensive due diligence for an M&A transaction. | `/legal --workflow researcher,corporate,risk @deal.md` |
| **Litigation Prep** | `strategist`, `researcher`, `drafter` | Prepares for litigation by developing a strategy, researching precedents, and drafting initial filings. | `/legal --workflow strategist,researcher,drafter @case.txt` |
| **Contract Lifecycle**| `drafter`, `data-protection`, `compliance` | Manages the entire lifecycle of a contract, from drafting to compliance review. | `/legal --workflow drafter,data-protection,compliance --document_type="service_agreement"` |
| **Real Estate Closing**| `realestate`, `fiscal`, `drafter` | Handles all aspects of a real estate transaction, including tax implications and final documentation. | `/legal --workflow realestate,fiscal,drafter @property_sale.md` |

---

**6. Adversarial Workflow: Advanced Legal Analysis**

This workflow uses a three-agent system to conduct a robust, multi-perspective analysis of a legal issue.

**Adversarial Agents:**

| Agent | Description |
| :--- | :--- |
| **`AdvocateAgent`** | Takes a pro-position stance, building the strongest possible arguments in favor of a specific legal claim. |
| **`AdversaryAgent`** | Takes an anti-position stance, developing the strongest counter-arguments and identifying weaknesses. |
| **`JudicialAgent`** | Acts as a neutral arbiter, synthesizing the arguments from the Advocate and Adversary to provide a balanced conclusion and risk assessment. |

**Adversarial Analysis Workflow:**

| Workflow | Agent Sequence | Description | Example |
| :--- | :--- | :--- | :--- |
| **`AdversarialAnalysis`** | `advocate`, `adversary`, `judicial` | Performs a deep analysis of a legal question by simulating a structured debate between opposing sides and providing a judicial summary. | `/legal --workflow advocate,adversary,judicial --query "Is the non-compete clause in @contract.pdf enforceable under Swiss law?"` |

---

**7. MCP (Model Context Protocol) Commands**

These are the low-level commands that power the agents. They can be used directly for more granular control.

| MCP Server | Command | Description |
| :--- | :--- | :--- |
| **`entscheidsuche`** | `search` | Searches Swiss federal and cantonal court decisions. |
| | `get_document` | Retrieves the full text of a court decision. |
| **`bge-search`** | `search` | Provides direct access to the Federal Supreme Court database. |
| | `get_bge` | Retrieves a specific BGE decision. |
| **`legal-citations`**| `validate_citation`| Validates a Swiss legal citation. |
| | `format_citation` | Formats a citation to a specific language. |
| | `convert_citation`| Converts a citation between languages. |
| | `parse_citation` | Extracts the components of a citation. |
| **`fedlex-sparql`** | `lookup_statute` | Find federal legislation by SR number or abbreviation. |
| | `get_article` | Retrieve specific articles from legislation. |
| | `search_legislation` | Full-text search across federal law. |
| | `find_related` | Discover legislative relationships. |
| | `get_metadata` | Retrieve comprehensive legislation metadata. |
| **`onlinekommentar`** | `search_commentaries` | Search Swiss legal commentaries. |
| | `get_commentary` | Retrieve full commentary content. |
| | `get_commentary_for_article` | Get commentary for a specific article. |
| | `list_legislative_acts` | List available legislative acts. |

---

**8. Quick Command Reference**

| Old Syntax (v2.2.0) | New Syntax (v2.2.1) |
|---------------------|---------------------|
| `/legal:research` | `/legal-research` |
| `/legal:strategy` | `/legal-strategy` |
| `/legal:draft` | `/legal-draft` |
| `/agent:researcher` | `/agent-researcher` |
| `/agent:strategist` | `/agent-strategist` |
| `/agent:drafter` | `/agent-drafter` |
| `/doc:analyze` | `/doc-analyze` |
| `/swiss:federal` | `/swiss-federal` |

---

**9. Advanced Tips & Best Practices**

*   **Be Specific in Your Queries:** The more context you provide, the better the results. Include relevant facts, legal questions, and desired outcomes.
*   **Use Document References:** For complex tasks, reference documents using the `@` symbol (e.g., `@case_brief.md`).
*   **Leverage Privacy Features:** For sensitive matters, use the local Ollama LLM by invoking the `privacy-first` mode or by including keywords related to attorney-client privilege.
*   **Start with `Cautious` Mode:** When using a new agent or workflow, start with the `Cautious` autonomy mode to review each step.
*   **Customize Your Experience:** Use the `config.yaml` file to set your preferences and extend the framework with custom agents and personas in the `.claude` directory.

---

**10. Multi-Lingual Citation Support**

| Language | Citation Format | Court Reference |
|----------|-----------------|-----------------|
| German (DE) | Art. 1 Abs. 2 OR | BGE 145 III 229 |
| French (FR) | art. 1 al. 2 CO | ATF 145 III 229 |
| Italian (IT) | art. 1 cpv. 2 CO | DTF 145 III 229 |
| English (EN) | Art. 1 para. 2 OR | BGE 145 III 229 |

---

**BetterCallClaude v2.2.1** — Built for Swiss Legal Professionals
