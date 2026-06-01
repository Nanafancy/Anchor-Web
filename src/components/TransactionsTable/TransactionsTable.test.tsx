import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TransactionsTable from "./TransactionsTable";
import { mockTransactions } from "@/mock-data/transactions";

function setup() {
	const user = userEvent.setup();
	render(<TransactionsTable />);
	return { user };
}

function getVisibleRows() {
	return screen.getAllByTestId("tx-row");
}

describe("TransactionsTable", () => {
	it("renders with transactions and sorts by newest date descending by default", () => {
		setup();
		const rows = getVisibleRows();
		expect(rows.length).toBe(5);
		expect(rows[0]).toHaveTextContent(mockTransactions[0].hash.slice(0, 8));
		const dateHeader = screen.getByText("Date").closest("[aria-sort]");
		expect(dateHeader).toHaveAttribute("aria-sort", "descending");
	});

	it("toggles date sort to ascending after clicking the Date header", async () => {
		const { user } = setup();
		await user.click(screen.getByText("Date"));

		const rows = getVisibleRows();
		expect(rows[0]).toHaveTextContent(
			mockTransactions[mockTransactions.length - 1].hash.slice(0, 8),
		);
		const dateHeader = screen.getByText("Date").closest("[aria-sort]");
		expect(dateHeader).toHaveAttribute("aria-sort", "ascending");
	});

	it("filters transactions by search term", async () => {
		const { user } = setup();
		const searchInput = screen.getByLabelText("Search transactions");
		await user.type(searchInput, "refund");

		const rows = getVisibleRows();
		expect(rows.length).toBe(1);
		expect(rows[0]).toHaveTextContent("refund-tx");
	});

	it("filters transactions by status and preserves date order", async () => {
		const { user } = setup();
		const statusSelect = screen.getByLabelText("Filter by status");
		await user.selectOptions(statusSelect, "pending");

		const expectedPending = mockTransactions.filter(
			tx => tx.status === "pending",
		);
		const rows = getVisibleRows();
		expect(rows.length).toBe(expectedPending.length);
		expect(rows[0]).toHaveTextContent(expectedPending[0].hash.slice(0, 8));
	});

	it("filters transactions by network", async () => {
		const { user } = setup();
		const networkSelect = screen.getByLabelText("Filter by network");
		await user.selectOptions(networkSelect, "mainnet");

		const expectedMainnet = mockTransactions.filter(
			tx => tx.network === "mainnet",
		);
		const rows = getVisibleRows();
		expect(rows.length).toBe(expectedMainnet.length >= 5 ? 5 : expectedMainnet.length);
		expect(rows[0]).toHaveTextContent(expectedMainnet[0].hash.slice(0, 8));
	});

	it("shows the empty state when no results match and clears filters", async () => {
		const { user } = setup();
		const searchInput = screen.getByLabelText("Search transactions");
		await user.type(searchInput, "no-such-hash");

		expect(screen.getByText("No transactions found")).toBeInTheDocument();
		expect(screen.getByText("No results for current filters.")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /clear all filters/i }));
		expect(getVisibleRows().length).toBe(5);
	});

	it("shows pagination controls and allows page navigation", async () => {
		const { user } = setup();
		const page2 = screen.getByRole("button", { name: "2" });
		await user.click(page2);

		const rows = getVisibleRows();
		expect(rows.length).toBe(5);
		expect(screen.getByRole("button", { name: "1" })).toHaveClass("text-indigo-600");
	});
});
