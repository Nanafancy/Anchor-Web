"use client";

import { useEffect, useState } from "react";
import type { ChartDataPoint, AssetData, Metric } from "@/mock-data/analytics";

export interface AnalyticsData {
	metrics: Metric[];
	volumeData: ChartDataPoint[];
	transactionsData: ChartDataPoint[];
	topAssets: AssetData[];
}

export type AnalyticsStatus = "idle" | "loading" | "success" | "empty" | "error";

export interface UseAnalyticsResult {
	data: AnalyticsData | null;
	status: AnalyticsStatus;
	isLoading: boolean;
	isEmpty: boolean;
	isError: boolean;
	error: string | null;
	/** Re-trigger the fetch (e.g. after an error or range change). */
	refetch: () => void;
}

/**
 * Returns true when the loaded data has no meaningful content to display.
 * All four collections must be non-empty for the page to be considered populated.
 */
function isDataEmpty(data: AnalyticsData): boolean {
	return (
		data.metrics.length === 0 &&
		data.volumeData.length === 0 &&
		data.transactionsData.length === 0 &&
		data.topAssets.length === 0
	);
}

/**
 * Hook that manages analytics data fetching lifecycle.
 *
 * Exposes an `isEmpty` flag (status === "empty") so the page can render a
 * dedicated empty-state UI instead of blank charts when the API returns no data.
 *
 * Currently backed by mock data with a simulated async delay so the loading
 * skeleton is exercised in development. Swap the `loadAnalytics` function
 * body for a real API call when the backend is ready.
 */
export function useAnalytics(): UseAnalyticsResult {
	const [status, setStatus] = useState<AnalyticsStatus>("idle");
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fetchKey, setFetchKey] = useState(0);

	useEffect(() => {
		let cancelled = false;

		async function loadAnalytics() {
			setStatus("loading");
			setError(null);

			try {
				// Dynamic import keeps the mock data out of the initial bundle and
				// lets us swap this for a real fetch without touching the hook API.
				const mock = await import("@/mock-data/analytics");

				// Simulate network latency in development so the skeleton is visible.
				if (process.env.NODE_ENV === "development") {
					await new Promise((resolve) => setTimeout(resolve, 800));
				}

				if (cancelled) return;

				const loaded: AnalyticsData = {
					metrics: mock.metrics,
					volumeData: mock.volumeData,
					transactionsData: mock.transactionsData,
					topAssets: mock.topAssets,
				};

				setData(loaded);
				setStatus(isDataEmpty(loaded) ? "empty" : "success");
			} catch (err) {
				if (cancelled) return;
				const message =
					err instanceof Error ? err.message : "Failed to load analytics data.";
				setError(message);
				setStatus("error");
			}
		}

		loadAnalytics();

		return () => {
			cancelled = true;
		};
	}, [fetchKey]);

	return {
		data,
		status,
		isLoading: status === "loading" || status === "idle",
		isEmpty: status === "empty",
		isError: status === "error",
		error,
		refetch: () => setFetchKey((k) => k + 1),
	};
}
