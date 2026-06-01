import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WalletPage from "./page";
import type { Wallet } from "@/types/wallet";

const mockFundedWallet: Wallet = {
	id: "w-1",
	address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
	network: "mainnet",
	status: "active",
	createdAt: new Date("2024-01-15T10:30:00Z"),
	balance: "1,250.50 XLM",
};

const mockUnfundedWallet: Wallet = {
	id: "w-2",
	address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
	network: "mainnet",
	status: "active",
	createdAt: new Date("2024-03-10T16:45:00Z"),
	balance: "0.00 XLM",
};

beforeEach(() => {
	vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

describe("WalletPage", () => {
	it("renders wallet details when wallets exist", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockFundedWallet]),
			}),
		);

		render(<WalletPage />);

		await waitFor(() =>
			expect(screen.getByText(/Wallet Details/i)).toBeInTheDocument(),
		);

		// Address should be displayed (appears in both header and code block)
		const addressElements = screen.getAllByText(mockFundedWallet.address);
		expect(addressElements.length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("1,250.50 XLM")).toBeInTheDocument();
	});

	it("shows empty state when no wallets are returned", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }),
		);

		render(<WalletPage />);

		await waitFor(() =>
			expect(screen.getByText(/No wallets found/i)).toBeInTheDocument(),
		);
	});

	it("renders a Send button that is enabled when the wallet is funded", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockFundedWallet]),
			}),
		);

		render(<WalletPage />);

		await waitFor(() => {
			const sendButton = screen.getByRole("button", { name: /send funds/i });
			expect(sendButton).toBeInTheDocument();
			expect(sendButton).not.toBeDisabled();
		});
	});

	it("renders a Send button that is disabled when the wallet is not funded", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockUnfundedWallet]),
			}),
		);

		render(<WalletPage />);

		await waitFor(() => {
			const sendButton = screen.getByRole("button", { name: /cannot send/i });
			expect(sendButton).toBeInTheDocument();
			expect(sendButton).toBeDisabled();
		});
	});

	it("shows 'Send funds from this wallet' text for funded wallets", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockFundedWallet]),
			}),
		);

		render(<WalletPage />);

		await waitFor(() => {
			expect(
				screen.getByText(/send funds from this wallet/i),
			).toBeInTheDocument();
			expect(
				screen.getByText(/transfer xlm or tokens to another stellar address/i),
			).toBeInTheDocument();
		});
	});

	it("shows 'This wallet has no funds to send' text for unfunded wallets", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockUnfundedWallet]),
			}),
		);

		render(<WalletPage />);

		await waitFor(() => {
			expect(
				screen.getByText(/this wallet has no funds to send/i),
			).toBeInTheDocument();
		});
	});
});
