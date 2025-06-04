"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const api_1 = require("./api");
const zod_1 = require("zod");
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "advisors",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("get-advisors", "Get all the advisors", {}, api_1.getAdvisors);
server.tool("active-advisor", "Activate an advisor by phone number", {
    phone: zod_1.z.string().describe("Phone number of the advisor to activate")
}, api_1.activeAdvisor);
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Advisor MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
