import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SpendingLimitsCard } from "./SpendingLimitsCard";

describe("SpendingLimitsCard", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("shows a toast after saving spending limits", async () => {
		render(<SpendingLimitsCard />);

		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(await screen.findByText(/spending limits saved/i)).toBeTruthy();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 3100));
		});

		expect(screen.queryByText(/spending limits saved/i)).toBeNull();
	});

	it("persists saved values to localStorage", async () => {
		render(<SpendingLimitsCard />);

		const user = userEvent.setup();
		const dailyInput = screen.getByLabelText(/daily spending limit/i);
		await user.clear(dailyInput);
		await user.type(dailyInput, "7500");

		const txInput = screen.getByLabelText(/per-transaction limit/i);
		await user.clear(txInput);
		await user.type(txInput, "1250");

		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(window.localStorage.getItem("spending-limits")).toContain(
			'"dailyLimit":7500',
		);
		expect(window.localStorage.getItem("spending-limits")).toContain(
			'"transactionLimit":1250',
		);
	});
});
