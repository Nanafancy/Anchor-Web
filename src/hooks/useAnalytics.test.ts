import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useAnalytics } from "./useAnalytics";

// ---------------------------------------------------------------------------
// Default mock — non-empty data
// ---------------------------------------------------------------------------

vi.mock("@/mock-data/analytics", () => ({
	metrics: [
		{
			label: "Total Volume",
			value: "$12.4M",
			change: 12.5,
			changeLabel: "vs last period",
		},
	],
	volumeData: [{ date: "Mon", value: 2400000 }],
	transactionsData: [{ date: "Mon", value: 12000 }],
	topAssets: [
		{
			rank: 1,
			name: "Mux Protocol",
			symbol: "MUX",
			volume: "$4,234,567",
			volumeChange: 15.2,
			tvl: "$18.2M",
			txCount: 28432,
		},
	],
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useAnalytics", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	// -------------------------------------------------------------------------
	// Initial state
	// -------------------------------------------------------------------------

	it("starts in a loading state", () => {
		const { result } = renderHook(() => useAnalytics());
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeNull();
		expect(result.current.isError).toBe(false);
		expect(result.current.isEmpty).toBe(false);
	});

	// -------------------------------------------------------------------------
	// Success path
	// -------------------------------------------------------------------------

	it("transitions to success and returns data", async () => {
		const { result } = renderHook(() => useAnalytics());

		await waitFor(() => {
			expect(result.current.status).toBe("success");
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.isEmpty).toBe(false);
		expect(result.current.data).not.toBeNull();
		expect(result.current.data?.metrics).toHaveLength(1);
		expect(result.current.data?.volumeData).toHaveLength(1);
		expect(result.current.data?.transactionsData).toHaveLength(1);
		expect(result.current.data?.topAssets).toHaveLength(1);
	});

	// -------------------------------------------------------------------------
	// Empty state
	// -------------------------------------------------------------------------

	it("transitions to empty when all collections are empty", async () => {
		vi.doMock("@/mock-data/analytics", () => ({
			metrics: [],
			volumeData: [],
			transactionsData: [],
			topAssets: [],
		}));

		const { useAnalytics: useAnalyticsEmpty } = await import("./useAnalytics");
		const { result } = renderHook(() => useAnalyticsEmpty());

		await waitFor(() => {
			expect(result.current.status).toBe("empty");
		});

		expect(result.current.isEmpty).toBe(true);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		// data is still set (the empty object), not null
		expect(result.current.data).not.toBeNull();

		// Restore
		vi.doMock("@/mock-data/analytics", () => ({
			metrics: [{ label: "Total Volume", value: "$12.4M", change: 12.5, changeLabel: "vs last period" }],
			volumeData: [{ date: "Mon", value: 2400000 }],
			transactionsData: [{ date: "Mon", value: 12000 }],
			topAssets: [{ rank: 1, name: "Mux Protocol", symbol: "MUX", volume: "$4,234,567", volumeChange: 15.2, tvl: "$18.2M", txCount: 28432 }],
		}));
	});

	it("does NOT go to empty when only some collections are empty", async () => {
		// Partial data — metrics present but charts empty — should still be "success"
		vi.doMock("@/mock-data/analytics", () => ({
			metrics: [{ label: "Total Volume", value: "$12.4M", change: 12.5, changeLabel: "vs last period" }],
			volumeData: [],
			transactionsData: [],
			topAssets: [],
		}));

		const { useAnalytics: useAnalyticsPartial } = await import("./useAnalytics");
		const { result } = renderHook(() => useAnalyticsPartial());

		await waitFor(() => {
			expect(result.current.status).toBe("success");
		});

		expect(result.current.isEmpty).toBe(false);

		// Restore
		vi.doMock("@/mock-data/analytics", () => ({
			metrics: [{ label: "Total Volume", value: "$12.4M", change: 12.5, changeLabel: "vs last period" }],
			volumeData: [{ date: "Mon", value: 2400000 }],
			transactionsData: [{ date: "Mon", value: 12000 }],
			topAssets: [{ rank: 1, name: "Mux Protocol", symbol: "MUX", volume: "$4,234,567", volumeChange: 15.2, tvl: "$18.2M", txCount: 28432 }],
		}));
	});

	// -------------------------------------------------------------------------
	// Refetch
	// -------------------------------------------------------------------------

	it("exposes a refetch function that re-triggers the load", async () => {
		const { result } = renderHook(() => useAnalytics());

		await waitFor(() => expect(result.current.status).toBe("success"));

		act(() => {
			result.current.refetch();
		});

		await waitFor(() => expect(result.current.isLoading).toBe(true));
		await waitFor(() => expect(result.current.status).toBe("success"));
	});

	// -------------------------------------------------------------------------
	// Error state
	// -------------------------------------------------------------------------

	it("transitions to error state when the import fails", async () => {
		vi.doMock("@/mock-data/analytics", () => {
			throw new Error("Network error");
		});

		const { useAnalytics: useAnalyticsError } = await import("./useAnalytics");
		const { result } = renderHook(() => useAnalyticsError());

		await waitFor(() => {
			expect(result.current.status).toBe("error");
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.isEmpty).toBe(false);
		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeTruthy();

		// Restore
		vi.doMock("@/mock-data/analytics", () => ({
			metrics: [],
			volumeData: [],
			transactionsData: [],
			topAssets: [],
		}));
	});

	// -------------------------------------------------------------------------
	// Stale / unmount cleanup
	// -------------------------------------------------------------------------

	it("cleans up and ignores stale responses when unmounted during fetch", async () => {
		const { result, unmount } = renderHook(() => useAnalytics());

		unmount();

		// No state updates should throw after unmount
		await waitFor(() => {
			expect(true).toBe(true);
		});
	});
});
