import type { ApiKey } from "@/mock-data/api-keys";
import { getApiKeys, revokeApiKey } from "@/mock-data/api-keys";

export async function fetchApiKeys(): Promise<ApiKey[]> {
    // In a real app this would call a server endpoint. Keep it sync-compatible.
    return Promise.resolve(getApiKeys());
}

export async function revokeKey(id: string): Promise<ApiKey | null> {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 100));
    return Promise.resolve(revokeApiKey(id));
}

export default { fetchApiKeys, revokeKey };
