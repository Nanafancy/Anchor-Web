"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { Wallet } from "@/types/wallet";

export function useWallets() {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadWallets = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await apiFetch<Wallet[]>("/api/wallets");
			setWallets(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to load wallets");
			setWallets([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadWallets();
	}, [loadWallets]);

	return {
		wallets,
		loading,
		error,
		refresh: loadWallets,
	};
}
