import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SpendingLimitsCard } from "./SpendingLimitsCard";

describe("SpendingLimitsCard", () => {
	test("renders daily usage meter and default limits", async () => {
		render(<SpendingLimitsCard />);

		expect(await screen.findByText("Spending Limits")).toBeInTheDocument();
		expect(screen.getByText("$750")).toBeInTheDocument();
		expect(screen.getByText("/ $5000")).toBeInTheDocument();
		expect(screen.getByText("15.0%"));
		const bar = screen.getByRole("progressbar");
		const innerBar = bar.querySelector("div");
		expect(innerBar).toHaveStyle("width: 15%");
	});

	test("shows invalid state when daily limit is not a positive number", async () => {
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByLabelText("Daily Spending Limit");
		fireEvent.change(dailyInput, { target: { value: "-1" } });

		expect(await screen.findByText(/Invalid daily limit/i)).toBeInTheDocument();
		expect(screen.getByText("N/A")).toBeInTheDocument();
	});

	test("falls back gracefully when browser storage is unavailable", async () => {
		const originalLocalStorage = Object.getOwnPropertyDescriptor(window, "localStorage");
		Object.defineProperty(window, "localStorage", {
			get: () => {
				throw new Error("Storage unavailable");
			},
		});

		render(<SpendingLimitsCard />);

		expect(await screen.findByText(/browser storage is unavailable/i)).toBeInTheDocument();

		const saveButton = screen.getByRole("button", { name: /save settings/i });
		fireEvent.click(saveButton);

		expect(await screen.findByText(/unable to persist settings/i)).toBeInTheDocument();

		if (originalLocalStorage) {
			Object.defineProperty(window, "localStorage", originalLocalStorage);
		}
	});
});
