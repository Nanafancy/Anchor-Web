"use client";

import { useCallback, useEffect, useState } from "react";
import type { Wallet } from "@/types/wallet";
import { getApiBaseUrl } from "@/lib/api/config";

interface UseWalletResult {
	wallet: Wallet | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useWallet(id: string): UseWalletResult {
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tick, setTick] = useState(0);

	const refetch = useCallback(() => setTick((t) => t + 1), []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: tick is the refetch trigger
	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		setLoading(true);
		setError(null);

		const base = getApiBaseUrl();
		if (!base) {
			setError("API URL is not configured.");
			setLoading(false);
			return;
		}

		fetch(`${base}/wallets/${encodeURIComponent(id)}`)
			.then((res) => {
				if (res.status === 404) throw new Error("not_found");
				if (!res.ok) throw new Error(`Request failed: ${res.status}`);
				return res.json() as Promise<Wallet>;
			})
			.then((data) => {
				if (!cancelled) setWallet(data);
			})
			.catch((err: unknown) => {
				if (!cancelled)
					setError(
						err instanceof Error ? err.message : "Failed to load wallet.",
					);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [id, tick]);

	return { wallet, loading, error, refetch };
}
