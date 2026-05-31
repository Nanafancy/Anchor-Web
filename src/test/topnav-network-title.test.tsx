import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { NetworkProvider } from "@/context/NetworkContext";
import { TopNav } from "@/components/layouts/TopNav";

// next/navigation is used by TopNav; mock it
vi.mock("next/navigation", () => ({
	usePathname: () => "/demo/dashboard/wallets",
}));

function renderTopNav() {
	return render(
		<NetworkProvider>
			<TopNav onMenuClick={() => {}} />
		</NetworkProvider>,
	);
}

describe("TopNav network label in page title", () => {
	beforeEach(() => {
		document.title = "";
	});

	it("shows Mainnet badge in h1 by default", () => {
		renderTopNav();
		const badges = screen.getAllByText("Mainnet");
		expect(badges.length).toBeGreaterThanOrEqual(1);
	});

	it("sets document.title with Mainnet by default", () => {
		renderTopNav();
		expect(document.title).toBe("Wallets · Mainnet — Mux");
	});

	it("shows Testnet badge in h1 after switching", () => {
		renderTopNav();
		fireEvent.click(screen.getByRole("button", { name: "Testnet" }));
		const badges = screen.getAllByText("Testnet");
		// one in the switcher button, one in the h1/breadcrumb
		expect(badges.length).toBeGreaterThanOrEqual(2);
	});

	it("updates document.title to Testnet after switching", () => {
		renderTopNav();
		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "Testnet" }));
		});
		expect(document.title).toBe("Wallets · Testnet — Mux");
	});

	it("updates document.title back to Mainnet when switching back", () => {
		renderTopNav();
		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "Testnet" }));
		});
		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "Mainnet" }));
		});
		expect(document.title).toBe("Wallets · Mainnet — Mux");
	});
});
