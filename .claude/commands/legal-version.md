# /legal:version - BetterCallClaude Version & Status

**Display framework version, MCP server status, and check for updates.**

---

## Framework Information

When this command is invoked, display the following information:

### 1. Version Information
- Read the version from the `version.txt` file in the BetterCallClaude installation directory
- Display as: **BetterCallClaude v{version}**

### 2. Installation Location
- Check for installation in `~/.claude/bettercallclaude/` (global) or `./.bettercallclaude/` (local)
- Display the active installation path

### 3. MCP Servers Status

Check and display the status of each MCP server:

| Server | Status | Description |
|--------|--------|-------------|
| `entscheidsuche` | [Check if configured in settings] | Swiss court decision search |
| `legal-citations` | [Check if configured in settings] | Citation verification & formatting |

For each server, indicate:
- **[Active]** - Server is configured and available
- **[Not Configured]** - Server not found in Claude Code settings

### 4. Update Check

Check for available updates:
- Compare local version with remote `version.txt` from GitHub main branch
- If update available, display: **Update available: v{remote_version}**
- Provide command to update: `./install.sh update` or `curl -fsSL ... | bash -s -- update`

---

## Response Format

```
╔══════════════════════════════════════════════════════╗
║           BetterCallClaude Status                     ║
╠══════════════════════════════════════════════════════╣
║  Version:     v1.3.2                                  ║
║  Location:    ~/.claude/bettercallclaude              ║
╠══════════════════════════════════════════════════════╣
║  MCP Servers:                                         ║
║    [✓] entscheidsuche - Swiss court decisions        ║
║    [✓] legal-citations - Citation verification       ║
╠══════════════════════════════════════════════════════╣
║  Update Status: Up to date                            ║
╚══════════════════════════════════════════════════════╝
```

---

## Usage

```
/legal:version
```

No arguments required. This command displays current status and checks for updates.

---

## Related Commands

- `/legal:help` - Full command reference
- `./install.sh version` - Terminal version check with update option
- `./install.sh doctor` - Comprehensive installation diagnostics

---

**BetterCallClaude v1.3.2 - Swiss Legal Intelligence Framework**
