"use client";

import React, { createContext, useContext } from "react";
import createApiClient, { ApiClient } from "./index";

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({
  children,
  apiKey,
}: {
  children: React.ReactNode;
  apiKey?: string;
}) {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "";
  const client = createApiClient(
    base,
    apiKey ?? process.env.NEXT_PUBLIC_MUX_API_KEY,
  );
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}

export default ApiProvider;
