/**
 * Contract tests for src/mock-data/analytics.ts
 *
 * These tests verify that every export matches the shape documented in
 * src/docs/Analytics_Data_Sources.md. If a field is added, removed, or
 * renamed in the mock data, these tests will catch the drift before it
 * reaches components or the real API integration.
 */

import { describe, expect, it } from "vitest";
import {
	metrics,
	volumeData,
	transactionsData,
	topAssets,
} from "./analytics";
import type { Metric, ChartDataPoint, AssetData } from "./analytics";

// ---------------------------------------------------------------------------
// Metric[]
// ---------------------------------------------------------------------------

describe("metrics — contract", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(metrics)).toBe(true);
		expect(metrics.length).toBeGreaterThan(0);
	});

	it("contains exactly 4 KPI cards as documented", () => {
		expect(metrics).toHaveLength(4);
	});

	it("every entry satisfies the Metric interface shape", () => {
		for (const m of metrics) {
			// label: non-empty string
			expect(typeof m.label).toBe("string");
			expect(m.label.trim().length).toBeGreaterThan(0);

			// value: non-empty string (pre-formatted)
			expect(typeof m.value).toBe("string");
			expect(m.value.trim().length).toBeGreaterThan(0);

			// change: number (may be negative)
			expect(typeof m.change).toBe("number");
			expect(Number.isFinite(m.change)).toBe(true);

			// changeLabel: non-empty string
			expect(typeof m.changeLabel).toBe("string");
			expect(m.changeLabel.trim().length).toBeGreaterThan(0);
		}
	});

	it("contains the four documented KPI labels", () => {
		const labels = metrics.map((m) => m.label);
		expect(labels).toContain("Total Volume");
		expect(labels).toContain("Total Transactions");
		expect(labels).toContain("Active Wallets");
		expect(labels).toContain("Success Rate");
	});

	it("all labels are unique", () => {
		const labels = metrics.map((m) => m.label);
		expect(new Set(labels).size).toBe(labels.length);
	});
});

// ---------------------------------------------------------------------------
// volumeData: ChartDataPoint[]
// ---------------------------------------------------------------------------

describe("volumeData — contract", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(volumeData)).toBe(true);
		expect(volumeData.length).toBeGreaterThan(0);
	});

	it("contains exactly 7 data points (one per day of the week) as documented", () => {
		expect(volumeData).toHaveLength(7);
	});

	it("every entry satisfies the ChartDataPoint interface shape", () => {
		for (const point of volumeData) {
			expect(typeof point.date).toBe("string");
			expect(point.date.trim().length).toBeGreaterThan(0);
			expect(typeof point.value).toBe("number");
			expect(Number.isFinite(point.value)).toBe(true);
			expect(point.value).toBeGreaterThan(0);
		}
	});

	it("all date labels are unique", () => {
		const dates = volumeData.map((p) => p.date);
		expect(new Set(dates).size).toBe(dates.length);
	});

	it("values are in USD (all > 1,000,000 as documented)", () => {
		for (const point of volumeData) {
			expect(point.value).toBeGreaterThan(1_000_000);
		}
	});
});

// ---------------------------------------------------------------------------
// transactionsData: ChartDataPoint[]
// ---------------------------------------------------------------------------

describe("transactionsData — contract", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(transactionsData)).toBe(true);
		expect(transactionsData.length).toBeGreaterThan(0);
	});

	it("contains exactly 7 data points (one per day of the week) as documented", () => {
		expect(transactionsData).toHaveLength(7);
	});

	it("every entry satisfies the ChartDataPoint interface shape", () => {
		for (const point of transactionsData) {
			expect(typeof point.date).toBe("string");
			expect(point.date.trim().length).toBeGreaterThan(0);
			expect(typeof point.value).toBe("number");
			expect(Number.isFinite(point.value)).toBe(true);
			expect(point.value).toBeGreaterThan(0);
		}
	});

	it("all date labels are unique", () => {
		const dates = transactionsData.map((p) => p.date);
		expect(new Set(dates).size).toBe(dates.length);
	});

	it("uses the same date labels as volumeData", () => {
		const vDates = volumeData.map((p) => p.date);
		const tDates = transactionsData.map((p) => p.date);
		expect(tDates).toEqual(vDates);
	});
});

// ---------------------------------------------------------------------------
// topAssets: AssetData[]
// ---------------------------------------------------------------------------

describe("topAssets — contract", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(topAssets)).toBe(true);
		expect(topAssets.length).toBeGreaterThan(0);
	});

	it("contains exactly 5 assets as documented", () => {
		expect(topAssets).toHaveLength(5);
	});

	it("every entry satisfies the AssetData interface shape", () => {
		for (const asset of topAssets) {
			// rank: positive integer
			expect(typeof asset.rank).toBe("number");
			expect(Number.isInteger(asset.rank)).toBe(true);
			expect(asset.rank).toBeGreaterThan(0);

			// name: non-empty string
			expect(typeof asset.name).toBe("string");
			expect(asset.name.trim().length).toBeGreaterThan(0);

			// symbol: non-empty string
			expect(typeof asset.symbol).toBe("string");
			expect(asset.symbol.trim().length).toBeGreaterThan(0);

			// volume: pre-formatted string starting with "$"
			expect(typeof asset.volume).toBe("string");
			expect(asset.volume.startsWith("$")).toBe(true);

			// volumeChange: finite number (may be negative)
			expect(typeof asset.volumeChange).toBe("number");
			expect(Number.isFinite(asset.volumeChange)).toBe(true);

			// tvl: pre-formatted string starting with "$"
			expect(typeof asset.tvl).toBe("string");
			expect(asset.tvl.startsWith("$")).toBe(true);

			// txCount: positive integer
			expect(typeof asset.txCount).toBe("number");
			expect(Number.isInteger(asset.txCount)).toBe(true);
			expect(asset.txCount).toBeGreaterThan(0);
		}
	});

	it("ranks are sequential starting from 1", () => {
		const ranks = topAssets.map((a) => a.rank).sort((a, b) => a - b);
		expect(ranks[0]).toBe(1);
		for (let i = 1; i < ranks.length; i++) {
			expect(ranks[i]).toBe(ranks[i - 1] + 1);
		}
	});

	it("ranks are unique", () => {
		const ranks = topAssets.map((a) => a.rank);
		expect(new Set(ranks).size).toBe(ranks.length);
	});

	it("symbols are unique", () => {
		const symbols = topAssets.map((a) => a.symbol);
		expect(new Set(symbols).size).toBe(symbols.length);
	});

	it("contains the five documented assets: MUX, XLM, USDC, ETH, BTC", () => {
		const symbols = topAssets.map((a) => a.symbol);
		expect(symbols).toContain("MUX");
		expect(symbols).toContain("XLM");
		expect(symbols).toContain("USDC");
		expect(symbols).toContain("ETH");
		expect(symbols).toContain("BTC");
	});

	it("assets are ordered by rank ascending", () => {
		for (let i = 1; i < topAssets.length; i++) {
			expect(topAssets[i].rank).toBeGreaterThan(topAssets[i - 1].rank);
		}
	});

	it("contains at least one asset with a negative volumeChange (documented)", () => {
		const hasNegative = topAssets.some((a) => a.volumeChange < 0);
		expect(hasNegative).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Cross-collection consistency
// ---------------------------------------------------------------------------

describe("cross-collection consistency", () => {
	it("volumeData and transactionsData have the same length", () => {
		expect(volumeData.length).toBe(transactionsData.length);
	});

	it("metrics count matches the documented KPI count (4)", () => {
		expect(metrics.length).toBe(4);
	});

	it("topAssets count matches the documented asset count (5)", () => {
		expect(topAssets.length).toBe(5);
	});
});
