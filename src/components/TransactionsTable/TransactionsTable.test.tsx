import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TransactionsTable, { INITIAL_DATA } from "./TransactionsTable";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render the component and return a userEvent instance. */
function setup() {
	const user = userEvent.setup();
	render(<TransactionsTable />);
	return { user };
}

/**
 * Returns the visible transaction description cells in DOM order.
 * Uses data-testid="tx-description" which is set on each description <p>.
 */
function getVisibleDescriptions(): string[] {
	return screen
		.getAllByTestId("tx-description")
		.map((el) => el.textContent ?? "");
}

// ---------------------------------------------------------------------------
// Default sort — newest first
// ---------------------------------------------------------------------------

describe("TransactionsTable default sort", () => {
	it("renders the newest transaction first by default", () => {
		setup();
		const descriptions = getVisibleDescriptions();
		// INITIAL_DATA[0] has date "2023-10-24" — the most recent entry.
		expect(descriptions[0]).toBe("Spotify Premium");
	});

	it("renders the Date column header", () => {
		setup();
		expect(screen.getByText("Date")).toBeInTheDocument();
	});

	it("shows the Date header with aria-sort='descending' by default", () => {
		setup();
		const dateHeader = screen.getByText("Date").closest("[aria-sort]");
		expect(dateHeader).toHaveAttribute("aria-sort", "descending");
	});
});

// ---------------------------------------------------------------------------
// Clicking the Date header
// ---------------------------------------------------------------------------

describe("TransactionsTable date sort interaction", () => {
	it("sorts oldest-first after one click on the Date header", async () => {
		const { user } = setup();
		await user.click(screen.getByText("Date"));

		const descriptions = getVisibleDescriptions();
		// INITIAL_DATA[11] has date "2023-10-13" — the oldest entry.
		expect(descriptions[0]).toBe("Apple Store");
	});

	it("sorts newest-first again after two clicks on the Date header", async () => {
		const { user } = setup();
		await user.click(screen.getByText("Date"));
		await user.click(screen.getByText("Date"));

		const descriptions = getVisibleDescriptions();
		expect(descriptions[0]).toBe("Spotify Premium");
	});

	it("updates aria-sort to 'ascending' after one click", async () => {
		const { user } = setup();
		await user.click(screen.getByText("Date"));

		const dateHeader = screen.getByText("Date").closest("[aria-sort]");
		expect(dateHeader).toHaveAttribute("aria-sort", "ascending");
	});

	it("resets to page 1 when the sort column changes", async () => {
		const { user } = setup();

		// Navigate to page 2 first.
		const page2Button = screen.getByRole("button", { name: "2" });
		await user.click(page2Button);

		// Now sort by description — should jump back to page 1.
		await user.click(screen.getByText("Description"));

		// Page 1 button should now be the active page (has the indigo style).
		const page1Button = screen.getByRole("button", { name: "1" });
		expect(page1Button).toHaveClass("text-indigo-600");
	});
});

// ---------------------------------------------------------------------------
// Sort correctness — full ordering
// ---------------------------------------------------------------------------

describe("TransactionsTable sort ordering", () => {
	it("produces a strictly descending date sequence across all visible rows", async () => {
		// Default is desc; render and collect dates from the first page.
		setup();

		// Grab humanDate text nodes from the date column cells.
		// They appear as text inside the col-span-2 date cell (desktop).
		// We identify them by matching against known humanDate values.
		const allHumanDates = INITIAL_DATA.map((tx) => tx.humanDate);
		const visibleDates = screen
			.getAllByText((text) => allHumanDates.includes(text))
			.map((el) => el.textContent ?? "");

		// Convert humanDate strings back to ISO for comparison.
		const dateMap = Object.fromEntries(
			INITIAL_DATA.map((tx) => [tx.humanDate, tx.date]),
		);
		const isoDates = visibleDates.map((h) => dateMap[h]);

		for (let i = 0; i < isoDates.length - 1; i++) {
			expect(isoDates[i] >= isoDates[i + 1]).toBe(true);
		}
	});

	it("produces a strictly ascending date sequence after clicking Date once", async () => {
		const { user } = setup();
		await user.click(screen.getByText("Date"));

		const allHumanDates = INITIAL_DATA.map((tx) => tx.humanDate);
		const visibleDates = screen
			.getAllByText((text) => allHumanDates.includes(text))
			.map((el) => el.textContent ?? "");

		const dateMap = Object.fromEntries(
			INITIAL_DATA.map((tx) => [tx.humanDate, tx.date]),
		);
		const isoDates = visibleDates.map((h) => dateMap[h]);

		for (let i = 0; i < isoDates.length - 1; i++) {
			expect(isoDates[i] <= isoDates[i + 1]).toBe(true);
		}
	});
});

// ---------------------------------------------------------------------------
// Date sort + search filter interaction
// ---------------------------------------------------------------------------

describe("TransactionsTable date sort with search filter", () => {
	it("maintains date-desc order when a search term is applied", async () => {
		const { user } = setup();

		// Filter to only "Subscription" items (Spotify Premium, Netflix).
		const searchInput = screen.getByPlaceholderText("Search...");
		await user.type(searchInput, "subscription");

		const descriptions = getVisibleDescriptions();
		// Spotify Premium (Oct 24) should appear before Netflix (Oct 17).
		const spotifyIdx = descriptions.indexOf("Spotify Premium");
		const netflixIdx = descriptions.indexOf("Netflix");
		expect(spotifyIdx).toBeGreaterThanOrEqual(0);
		expect(netflixIdx).toBeGreaterThanOrEqual(0);
		expect(spotifyIdx).toBeLessThan(netflixIdx);
	});

	it("maintains date-asc order when a search term is applied after toggling sort", async () => {
		const { user } = setup();

		// Switch to ascending date order.
		await user.click(screen.getByText("Date"));

		// Filter to only "Subscription" items.
		const searchInput = screen.getByPlaceholderText("Search...");
		await user.type(searchInput, "subscription");

		const descriptions = getVisibleDescriptions();
		// Netflix (Oct 17) should appear before Spotify Premium (Oct 24).
		const spotifyIdx = descriptions.indexOf("Spotify Premium");
		const netflixIdx = descriptions.indexOf("Netflix");
		expect(netflixIdx).toBeLessThan(spotifyIdx);
	});
});

// ---------------------------------------------------------------------------
// Date sort + status filter interaction
// ---------------------------------------------------------------------------

describe("TransactionsTable date sort with status filter", () => {
	it("maintains date-desc order when status filter is applied", async () => {
		const { user } = setup();

		const statusSelect = screen.getByDisplayValue("All Status");
		await user.selectOptions(statusSelect, "pending");

		const descriptions = getVisibleDescriptions();
		// Pending transactions: Uber Ride (Oct 22) and Coffee Shop (Oct 15).
		const uberIdx = descriptions.indexOf("Uber Ride");
		const coffeeIdx = descriptions.indexOf("Coffee Shop");
		expect(uberIdx).toBeGreaterThanOrEqual(0);
		expect(coffeeIdx).toBeGreaterThanOrEqual(0);
		expect(uberIdx).toBeLessThan(coffeeIdx);
	});
});

// ---------------------------------------------------------------------------
// Clear filters resets to default sort
// ---------------------------------------------------------------------------

describe("TransactionsTable clearFilters", () => {
	it("resets sort to date-desc when Clear all filters is clicked from empty state", async () => {
		const { user } = setup();

		// Produce an empty state by searching for something that doesn't exist.
		const searchInput = screen.getByPlaceholderText("Search...");
		await user.type(searchInput, "zzznomatch");

		// The empty state renders a "Clear all filters" button.
		const clearBtn = screen.getByRole("button", { name: /clear all filters/i });
		await user.click(clearBtn);

		// After clearing, newest-first order should be restored.
		const descriptions = getVisibleDescriptions();
		expect(descriptions[0]).toBe("Spotify Premium");
	});
});

// ---------------------------------------------------------------------------
// Pagination reset on sort change
// ---------------------------------------------------------------------------

describe("TransactionsTable pagination reset", () => {
	it("resets to page 1 when Date sort is toggled", async () => {
		const { user } = setup();

		// Go to page 2.
		await user.click(screen.getByRole("button", { name: "2" }));

		// Toggle date sort.
		await user.click(screen.getByText("Date"));

		// Should be back on page 1.
		const page1Button = screen.getByRole("button", { name: "1" });
		expect(page1Button).toHaveClass("text-indigo-600");
	});
});

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

describe("TransactionsTable empty state", () => {
	it("shows the empty state when no transactions match the search", async () => {
		const { user } = setup();
		const searchInput = screen.getByPlaceholderText("Search...");
		await user.type(searchInput, "zzznomatch");

		expect(screen.getByText("No transactions found")).toBeInTheDocument();
		expect(
			screen.getByText("No results for current filters."),
		).toBeInTheDocument();
	});

	it("does not render the pagination footer when there are no results", async () => {
		const { user } = setup();
		const searchInput = screen.getByPlaceholderText("Search...");
		await user.type(searchInput, "zzznomatch");

		// Pagination buttons should not be present.
		expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
	});
});
