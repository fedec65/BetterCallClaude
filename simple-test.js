// Simple Node.js MCP integration test
const { spawn } = require('child_process');

async function testMCPServer(serverPath, toolName, args = {}) {
    return new Promise((resolve, reject) => {
        const server = spawn('node', [serverPath]);
        let output = '';
        let errorOutput = '';

        // MCP Initialize request
        const initRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: {
                    name: 'test-client',
                    version: '1.0.0'
                }
            }
        };

        server.stdout.on('data', (data) => {
            output += data.toString();
        });

        server.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        server.on('close', (code) => {
            resolve({ code, output, errorOutput });
        });

        // Send init request
        server.stdin.write(JSON.stringify(initRequest) + '\n');

        setTimeout(() => {
            server.kill();
        }, 3000);
    });
}

async function runTests() {
    console.log('Testing BGE Search Server...');
    const bgeResult = await testMCPServer('mcp-servers/bge-search/dist/index.js');
    console.log('BGE Exit Code:', bgeResult.code);
    console.log('BGE Error Output:', bgeResult.errorOutput.slice(0, 200));

    console.log('\nTesting Entscheidsuche Server...');
    const entResult = await testMCPServer('mcp-servers/entscheidsuche/dist/index.js');
    console.log('Entscheidsuche Exit Code:', entResult.code);
    console.log('Entscheidsuche Error Output:', entResult.errorOutput.slice(0, 200));
}

runTests().catch(console.error);
