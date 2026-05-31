import { describe, expect, it } from "vitest";
import { mockTransactions } from "./analytics";

describe("mockTransactions", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(mockTransactions)).toBe(true);
		expect(mockTransactions.length).toBeGreaterThan(0);
	});

	it("every transaction has a unique id", () => {
		const ids = mockTransactions.map((tx) => tx.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});

	it("every transaction has a valid status", () => {
		const validStatuses = new Set(["completed", "pending", "failed"]);
		for (const tx of mockTransactions) {
			expect(validStatuses.has(tx.status)).toBe(true);
		}
	});

	it("every transaction has a valid type", () => {
		const validTypes = new Set(["incoming", "outgoing"]);
		for (const tx of mockTransactions) {
			expect(validTypes.has(tx.type)).toBe(true);
		}
	});

	it("every transaction has a positive amount", () => {
		for (const tx of mockTransactions) {
			expect(tx.amount).toBeGreaterThan(0);
		}
	});

	it("every transaction has a non-empty description", () => {
		for (const tx of mockTransactions) {
			expect(tx.description.trim().length).toBeGreaterThan(0);
		}
	});

	it("every transaction date is a valid ISO date string (YYYY-MM-DD)", () => {
		const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
		for (const tx of mockTransactions) {
			expect(tx.date).toMatch(isoDatePattern);
		}
	});

	it("contains at least one incoming and one outgoing transaction", () => {
		const types = mockTransactions.map((tx) => tx.type);
		expect(types).toContain("incoming");
		expect(types).toContain("outgoing");
	});

	it("contains at least one completed, one pending, and one failed transaction", () => {
		const statuses = mockTransactions.map((tx) => tx.status);
		expect(statuses).toContain("completed");
		expect(statuses).toContain("pending");
		expect(statuses).toContain("failed");
	});
});
