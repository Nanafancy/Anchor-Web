import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FAQ_ITEMS, RecoveryFAQ } from "../RecoveryFAQ";
import type { FAQItem } from "../RecoveryFAQ";

const SAMPLE: FAQItem[] = [
	{ id: "q1", question: "First question?", answer: "First answer." },
	{ id: "q2", question: "Second question?", answer: "Second answer." },
	{ id: "q3", question: "Third question?", answer: "Third answer." },
];

describe("RecoveryFAQ", () => {
	it("renders the section heading", () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		expect(
			screen.getByRole("heading", { name: /frequently asked questions/i }),
		).toBeInTheDocument();
	});

	it("renders all question buttons", () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		for (const item of SAMPLE) {
			expect(
				screen.getByRole("button", { name: item.question }),
			).toBeInTheDocument();
		}
	});

	it("all answers are hidden by default", () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		for (const item of SAMPLE) {
			expect(screen.queryByText(item.answer)).not.toBeVisible();
		}
	});

	it("expands an answer when its button is clicked", async () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		await userEvent.click(
			screen.getByRole("button", { name: SAMPLE[0].question }),
		);
		expect(screen.getByText(SAMPLE[0].answer)).toBeVisible();
	});

	it("sets aria-expanded=true on the open item", async () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		const btn = screen.getByRole("button", { name: SAMPLE[1].question });
		expect(btn).toHaveAttribute("aria-expanded", "false");
		await userEvent.click(btn);
		expect(btn).toHaveAttribute("aria-expanded", "true");
	});

	it("collapses an open item when clicked again", async () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		const btn = screen.getByRole("button", { name: SAMPLE[0].question });
		await userEvent.click(btn);
		expect(screen.getByText(SAMPLE[0].answer)).toBeVisible();
		await userEvent.click(btn);
		expect(screen.queryByText(SAMPLE[0].answer)).not.toBeVisible();
	});

	it("only one item is open at a time", async () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		await userEvent.click(
			screen.getByRole("button", { name: SAMPLE[0].question }),
		);
		await userEvent.click(
			screen.getByRole("button", { name: SAMPLE[1].question }),
		);
		expect(screen.queryByText(SAMPLE[0].answer)).not.toBeVisible();
		expect(screen.getByText(SAMPLE[1].answer)).toBeVisible();
	});

	it("answer region is labelled by its question button", () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		const region = document.getElementById(`faq-answer-${SAMPLE[0].id}`);
		expect(region).toHaveAttribute(
			"aria-labelledby",
			`faq-question-${SAMPLE[0].id}`,
		);
	});

	it("renders a fallback message when items array is empty", () => {
		render(<RecoveryFAQ items={[]} />);
		expect(screen.getByText(/no faq items available/i)).toBeInTheDocument();
	});

	it("applies additional className to the section", () => {
		render(<RecoveryFAQ items={SAMPLE} className="custom-class" />);
		expect(
			screen.getByRole("region", { name: /frequently asked questions/i }),
		).toHaveClass("custom-class");
	});

	it("uses the default FAQ_ITEMS when no items prop is passed", () => {
		render(<RecoveryFAQ />);
		// At least the first default item should be present
		expect(
			screen.getByRole("button", { name: FAQ_ITEMS[0].question }),
		).toBeInTheDocument();
	});

	it("all default FAQ_ITEMS have unique ids", () => {
		const ids = FAQ_ITEMS.map((i) => i.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("keyboard: Enter key toggles an item", async () => {
		render(<RecoveryFAQ items={SAMPLE} />);
		const btn = screen.getByRole("button", { name: SAMPLE[2].question });
		btn.focus();
		await userEvent.keyboard("{Enter}");
		expect(screen.getByText(SAMPLE[2].answer)).toBeVisible();
		await userEvent.keyboard("{Enter}");
		expect(screen.queryByText(SAMPLE[2].answer)).not.toBeVisible();
	});
});
