"use client";

import { useState, useCallback } from "react";
import type { ApiKey } from "@/mock-data/api-keys";
import { revokeKey } from "@/lib/api";

export function useRevokeApiKey() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const revoke = useCallback(async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			const updated = await revokeKey(id);
			return updated as ApiKey | null;
		} catch (err: any) {
			setError(err);
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	return { revoke, loading, error };
}
