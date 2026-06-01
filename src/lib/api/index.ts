import ApiClient from "./client";

// Minimal factory used by the app. The API key may be provided at runtime.
export const createApiClient = (baseUrl = "", apiKey?: string) =>
	new ApiClient(baseUrl, apiKey);

export default createApiClient;
