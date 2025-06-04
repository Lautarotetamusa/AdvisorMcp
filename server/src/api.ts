const API_BASE = "https://reboraautomatizaciones.com/api";

async function makeRequest<T>(url: string, payload?: object): Promise<T | null> {
    let options = { 
        headers: {
            Accept: "application/json",
        },
        body: JSON.stringify(payload)
    }
    //if (payload) {
    //    options["body"] = JSON.stringify(payload)
    //}

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        console.error("Error making request:", error);
        return null;
    }
}

interface Advisor {
    name: string;
    phone: string;
    email: string;
    active: boolean;
}

interface AdvisorListResponse {
    success: boolean;
    data: Advisor[];
}

interface BasicApiResponse {
    success: boolean;
    message?: string;
}

type Response = Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;

function formatAdvisor(a: Advisor): string {
    return ""  +
    `Name: ${a.name || "Unknown"}` + 
    `Phone: ${a.phone || "Unknown"}` + 
    `Email: ${a.email || "Unknown"}` + 
    `Active: ${a.active || "Unknown"}` +
    "---";
}

export async function activeAdvisor(args: {phone: string}): Response {
    const advisorUrl = `${API_BASE}/asesor/${args.phone}`;
    const payload = {
        "active": true,
    }
    const response = await makeRequest<BasicApiResponse>(advisorUrl, payload);
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

export async function getAdvisors(): Response {
    const advisorUrl = `${API_BASE}/asesor`;
    const advisorsData = await makeRequest<AdvisorListResponse>(advisorUrl);

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
