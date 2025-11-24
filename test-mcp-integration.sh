#!/bin/bash

# Integration Test Script for BetterCallClaude MCP Servers
# Tests stdio communication with bge-search and entscheidsuche servers

set -e

echo "========================================="
echo "BetterCallClaude MCP Integration Tests"
echo "========================================="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((FAILED++))
    fi
}

# Function to test JSON-RPC call
test_mcp_call() {
    local server_path=$1
    local method=$2
    local params=$3
    local test_name=$4

    echo -e "\n${YELLOW}Testing${NC}: $test_name"
    echo "Server: $server_path"
    echo "Method: $method"

    # Create JSON-RPC request
    local request=$(cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "$method",
  "params": $params
}
EOF
)

    echo "Request:"
    echo "$request" | jq '.' 2>/dev/null || echo "$request"

    # Send request to server via stdio
    local response=$(echo "$request" | node "$server_path" 2>/dev/null)

    echo "Response:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"

    # Check if response contains "result" (success) or "error"
    if echo "$response" | jq -e '.result' >/dev/null 2>&1; then
        print_result 0 "$test_name"
        return 0
    else
        print_result 1 "$test_name"
        return 1
    fi
}

echo "Step 1: Checking MCP server builds"
echo "-----------------------------------"

# Check if dist directories exist
if [ -d "mcp-servers/bge-search/dist" ] && [ -f "mcp-servers/bge-search/dist/index.js" ]; then
    print_result 0 "BGE Search server built"
else
    print_result 1 "BGE Search server NOT built"
    echo "Run: cd mcp-servers/bge-search && npm run build"
fi

if [ -d "mcp-servers/entscheidsuche/dist" ] && [ -f "mcp-servers/entscheidsuche/dist/index.js" ]; then
    print_result 0 "Entscheidsuche server built"
else
    print_result 1 "Entscheidsuche server NOT built"
    echo "Run: cd mcp-servers/entscheidsuche && npm run build"
fi

echo
echo "Step 2: Testing BGE Search MCP Server"
echo "--------------------------------------"

# Test 1: List tools
test_mcp_call \
    "mcp-servers/bge-search/dist/index.js" \
    "tools/list" \
    "{}" \
    "BGE Search: List available tools"

# Test 2: Search BGE
test_mcp_call \
    "mcp-servers/bge-search/dist/index.js" \
    "tools/call" \
    '{"name": "search_bge", "arguments": {"query": "Invalidenversicherung", "limit": 3}}' \
    "BGE Search: Search for disability insurance decisions"

# Test 3: Validate citation
test_mcp_call \
    "mcp-servers/bge-search/dist/index.js" \
    "tools/call" \
    '{"name": "validate_citation", "arguments": {"citation": "BGE 147 V 321"}}' \
    "BGE Search: Validate citation format"

# Test 4: Get specific decision
test_mcp_call \
    "mcp-servers/bge-search/dist/index.js" \
    "tools/call" \
    '{"name": "get_bge_decision", "arguments": {"citation": "BGE 147 V 321"}}' \
    "BGE Search: Get decision by citation"

echo
echo "Step 3: Testing Entscheidsuche MCP Server"
echo "------------------------------------------"

# Test 5: List tools
test_mcp_call \
    "mcp-servers/entscheidsuche/dist/index.js" \
    "tools/list" \
    "{}" \
    "Entscheidsuche: List available tools"

# Test 6: Search decisions (federal only)
test_mcp_call \
    "mcp-servers/entscheidsuche/dist/index.js" \
    "tools/call" \
    '{"name": "search_decisions", "arguments": {"query": "Arbeitsrecht", "courtLevel": "federal", "limit": 3}}' \
    "Entscheidsuche: Search federal employment law decisions"

# Test 7: Get related decisions
test_mcp_call \
    "mcp-servers/entscheidsuche/dist/index.js" \
    "tools/call" \
    '{"name": "get_related_decisions", "arguments": {"decisionId": "BG-2021-001", "limit": 3}}' \
    "Entscheidsuche: Get related decisions"

# Test 8: Get decision details
test_mcp_call \
    "mcp-servers/entscheidsuche/dist/index.js" \
    "tools/call" \
    '{"name": "get_decision_details", "arguments": {"decisionId": "BG-2021-001"}}' \
    "Entscheidsuche: Get decision details"

echo
echo "Step 4: Command Integration Check"
echo "----------------------------------"

# Check if command files exist
if [ -f ".claude/commands/swiss:federal.md" ]; then
    print_result 0 "Swiss Federal command file exists"
else
    print_result 1 "Swiss Federal command file MISSING"
fi

if [ -f ".claude/commands/swiss:precedent.md" ]; then
    print_result 0 "Swiss Precedent command file exists"
else
    print_result 1 "Swiss Precedent command file MISSING"
fi

if [ -f ".claude/commands/doc:analyze.md" ]; then
    print_result 0 "Doc Analyze command file exists"
else
    print_result 1 "Doc Analyze command file MISSING"
fi

if [ -f ".claude/commands/legal:cite.md" ]; then
    print_result 0 "Legal Cite command file exists"
else
    print_result 1 "Legal Cite command file MISSING"
fi

echo
echo "========================================="
echo "Integration Test Summary"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo
echo "Total: $((PASSED + FAILED)) tests"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed. Review output above.${NC}"
    exit 1
fi
