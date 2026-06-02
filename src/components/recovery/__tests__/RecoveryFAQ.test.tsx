import { render, screen, fireEvent } from "@testing-library/react";
import { RecoveryFAQ } from "../RecoveryFAQ";

describe("RecoveryFAQ", () => {
	it("renders FAQ heading and items", () => {
		render(<RecoveryFAQ />);
		expect(
			screen.getByRole("heading", { name: /frequently asked questions/i })
		).toBeInTheDocument();
		expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
	});

	it("renders external docs link at the bottom", () => {
		render(<RecoveryFAQ />);
		const link = screen.getByRole("link", {
			name: /read recovery documentation/i,
		});
		expect(link).toBeInTheDocument();
		expect(link).toHaveTextContent("Read Docs");
	});

	it("expands and collapses FAQ items", () => {
		render(<RecoveryFAQ />);
		const firstQuestion = screen.getAllByRole("button")[0];
		
		fireEvent.click(firstQuestion);
		expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
	});
});