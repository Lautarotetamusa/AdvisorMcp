"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeAdvisor = activeAdvisor;
exports.getAdvisors = getAdvisors;
const API_BASE = "https://reboraautomatizaciones.com/api";
async function makeRequest(url, payload) {
    let options = {
        headers: {
            Accept: "application/json",
        },
        body: JSON.stringify(payload)
    };
    //if (payload) {
    //    options["body"] = JSON.stringify(payload)
    //}
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error("Error making request:", error);
        return null;
    }
}
function formatAdvisor(a) {
    return "" +
        `Name: ${a.name || "Unknown"}` +
        `Phone: ${a.phone || "Unknown"}` +
        `Email: ${a.email || "Unknown"}` +
        `Active: ${a.active || "Unknown"}` +
        "---";
}
async function activeAdvisor(args) {
    const advisorUrl = `${API_BASE}/asesor/${args.phone}`;
    const payload = {
        "active": true,
    };
    const response = await makeRequest(advisorUrl, payload);
    if (!response) {
        return {
            content: [
                {
                    type: "text",
                    text: `⚠️ Network error`
                },
            ],
        };
    }
    if (!response.success) {
        return {
            content: [{
                    type: "text",
                    text: `❌ Activation failed: ${response.message || 'Unknown error'}`
                }]
        };
    }
    return {
        content: [{
                type: "text",
                text: `✅ Advisor with phone ${args.phone} activated successfully!`
            }]
    };
}
async function getAdvisors() {
    const advisorUrl = `${API_BASE}/asesor`;
    const advisorsData = await makeRequest(advisorUrl);
    if (!advisorsData) {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to retrieve alerts data",
                },
            ],
        };
    }
    const advisors = advisorsData.data || [];
    if (advisors.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No advisors`,
                },
            ],
        };
    }
    const formattedAdvisors = advisors.map(formatAdvisor);
    const advisorsText = `Advisors: \n\n${formattedAdvisors.join("\n")}`;
    return {
        content: [
            {
                type: "text",
                text: advisorsText,
            },
        ],
    };
}
