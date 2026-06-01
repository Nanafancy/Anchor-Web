"use client";

import React, { createContext, useContext } from "react";
import createApiClient, { ApiClient } from "./index";
import { getApiKey } from "./config";

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({
	children,
	apiKey,
}: {
	children: React.ReactNode;
	apiKey?: string;
}) {
  const client = createApiClient(undefined, apiKey ?? getApiKey());
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

export function useApi() {
	const ctx = useContext(ApiContext);
	if (!ctx) throw new Error("useApi must be used within ApiProvider");
	return ctx;
}

export default ApiProvider;
