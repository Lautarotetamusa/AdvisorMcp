import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getAdvisors, updateAdvisor } from "./api";
import { z } from "zod";

// Create server instance
const server = new McpServer({
    name: "advisors",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

server.tool(
    "get-advisors",
    "Get all the advisors",
    {},
    getAdvisors
);

server.tool(
    "update-advisor",
    "Update the status of an advisor by phone number",
    {
        phone: z.string().describe("Phone number of the advisor to activate"),
        status: z.boolean().describe("Indicates if the advisor its active or inactive")
    },
    updateAdvisor
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Advisor MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
