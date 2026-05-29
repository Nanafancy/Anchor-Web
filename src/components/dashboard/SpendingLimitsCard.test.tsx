import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SpendingLimitsCard } from "./SpendingLimitsCard";

describe("SpendingLimitsCard", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("renders limit inputs and save button", () => {
		render(<SpendingLimitsCard />);

		expect(screen.getByLabelText(/daily spending limit/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/per-transaction limit/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /save settings/i }),
		).toBeEnabled();
	});

	it("shows validation errors for invalid limit values", async () => {
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByLabelText(/daily spending limit/i);
		await userEvent.clear(dailyInput);
		await userEvent.type(dailyInput, "0");

		const txInput = screen.getByLabelText(/per-transaction limit/i);
		await userEvent.clear(txInput);
		await userEvent.type(txInput, "-1");

		expect(
			await screen.findByText(/daily spending limit must be at least \$1/i),
		).toBeInTheDocument();
		expect(
			await screen.findByText(/per-transaction limit must be at least \$1/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /save settings/i }),
		).toBeDisabled();
	});

	it("validates that transaction limit does not exceed daily limit", async () => {
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByLabelText(/daily spending limit/i);
		await userEvent.clear(dailyInput);
		await userEvent.type(dailyInput, "100");

		const txInput = screen.getByLabelText(/per-transaction limit/i);
		await userEvent.clear(txInput);
		await userEvent.type(txInput, "101");

		expect(
			await screen.findByText(
				/per-transaction limit cannot exceed the daily spending limit/i,
			),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /save settings/i }),
		).toBeDisabled();
	});

	it("persists valid limits to localStorage when saved", async () => {
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByLabelText(/daily spending limit/i);
		await userEvent.clear(dailyInput);
		await userEvent.type(dailyInput, "9000");

		const txInput = screen.getByLabelText(/per-transaction limit/i);
		await userEvent.clear(txInput);
		await userEvent.type(txInput, "500");

		await userEvent.click(
			screen.getByRole("button", { name: /save settings/i }),
		);

		expect(window.localStorage.getItem("spending-limits")).toContain(
			'"dailyLimit":9000',
		);
		expect(window.localStorage.getItem("spending-limits")).toContain(
			'"transactionLimit":500',
		);
		expect(
			await screen.findByText(/spending limits saved/i),
		).toBeInTheDocument();
	});
});
