export class WatermelonClient {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    async request(method, path, body) {
        const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`${res.status} ${res.statusText}: ${text}`);
        }
        const text = await res.text();
        return (text ? JSON.parse(text) : null);
    }
}
